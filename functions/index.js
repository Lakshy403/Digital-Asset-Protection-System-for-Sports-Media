const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {onObjectFinalized} = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const {BigQuery} = require("@google-cloud/bigquery");
const vision = require("@google-cloud/vision");
const {VertexAI} = require("@google-cloud/vertexai");
const {google} = require("googleapis");
const {createHash, randomUUID} = require("crypto");

admin.initializeApp();

const db = admin.firestore();
const REGION = "us-east1";
const VERTEX_LOCATION = process.env.VERTEX_LOCATION || "us-central1";
const VERTEX_MODEL = process.env.VERTEX_MODEL || "gemini-2.5-flash";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const BIGQUERY_DATASET = process.env.BIGQUERY_DATASET || "asset_protection";
const BIGQUERY_TABLE = process.env.BIGQUERY_SCAN_TABLE || "security_scan_results";
const MAX_SCAN_ASSETS = Number(process.env.MAX_SCAN_ASSETS || 10);
const MAX_SEARCH_ASSETS = Number(process.env.MAX_SEARCH_ASSETS || 50);
const OWNED_HOST_PATTERNS = [
  "guardian-sport-ai.web.app",
  "guardian-sport-ai.firebaseapp.com",
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
  "googleusercontent.com",
];

let bigQueryClient;
let vertexModel;
let visionClient;

function getProjectId() {
  return process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    admin.app().options.projectId;
}

function getVertexModel() {
  if (!vertexModel) {
    const project = getProjectId();
    if (!project) {
      throw new Error("Missing Google Cloud project ID for Vertex AI.");
    }

    const vertexAI = new VertexAI({
      project,
      location: VERTEX_LOCATION,
    });

    vertexModel = vertexAI.getGenerativeModel({
      model: VERTEX_MODEL,
      generationConfig: {
        temperature: 0,
        topP: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    });
  }

  return vertexModel;
}

function getVisionClient() {
  if (!visionClient) {
    visionClient = new vision.ImageAnnotatorClient();
  }

  return visionClient;
}

function getBigQueryClient() {
  if (!bigQueryClient) {
    bigQueryClient = new BigQuery({projectId: getProjectId()});
  }

  return bigQueryClient;
}

function buildStableDownloadUrl(bucket, filePath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/` +
    `${encodeURIComponent(filePath)}?alt=media&token=${token}`;
}

function parseStorageUri(bucketPath) {
  if (!bucketPath || !bucketPath.startsWith("gs://")) {
    return null;
  }

  const pathWithoutScheme = bucketPath.slice(5);
  const firstSlashIndex = pathWithoutScheme.indexOf("/");

  if (firstSlashIndex === -1) {
    return {
      bucket: pathWithoutScheme,
      filePath: "",
    };
  }

  return {
    bucket: pathWithoutScheme.slice(0, firstSlashIndex),
    filePath: pathWithoutScheme.slice(firstSlashIndex + 1),
  };
}

async function ensureDownloadToken(file) {
  const [metadata] = await file.getMetadata();
  const existingToken = metadata.metadata?.firebaseStorageDownloadTokens;

  if (existingToken) {
    return existingToken.split(",")[0];
  }

  const token = randomUUID();
  await file.setMetadata({
    metadata: {
      ...(metadata.metadata || {}),
      firebaseStorageDownloadTokens: token,
    },
  });
  return token;
}

function normalizeAnalysis(rawText, fileName) {
  const fallback = {
    authenticityScore: 50,
    isDeepfake: false,
    deepfakeReason: "Vertex AI returned an unreadable response.",
    semanticTags: ["sports-media"],
    contentDescription: fileName,
    status: "Needs Review",
  };

  if (!rawText) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawText);
    const score = Number(parsed.authenticityScore);
    return {
      authenticityScore: Number.isFinite(score) ?
        Math.min(100, Math.max(0, Math.round(score))) :
        fallback.authenticityScore,
      isDeepfake: Boolean(parsed.isDeepfake),
      deepfakeReason: parsed.deepfakeReason || "No anomalies detected.",
      semanticTags: Array.isArray(parsed.semanticTags) ?
        parsed.semanticTags.filter(Boolean).slice(0, 8) :
        fallback.semanticTags,
      contentDescription: parsed.contentDescription || fileName,
      status: ["Protected", "Violation", "Needs Review"].includes(parsed.status) ?
        parsed.status :
        fallback.status,
    };
  } catch (error) {
    console.error("[VERTEX PARSE ERROR]", error);
    return fallback;
  }
}

function buildSynthIdResult(contentType) {
  const normalizedType = (contentType || "").toLowerCase();
  const manuallyReviewableImageTypes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ]);

  if (!normalizedType.startsWith("image/")) {
    return {
      status: "not_applicable",
      note: "SynthID verification only applies to supported image workflows.",
      reasonCode: "non_image_asset",
      autoVerificationAvailable: false,
      manualVerificationAvailable: false,
      supportedInCurrentPipeline: false,
    };
  }

  if (!manuallyReviewableImageTypes.has(normalizedType)) {
    return {
      status: "unsupported_image_format",
      note: `SynthID manual verification is not configured for ${normalizedType || "this image format"} in the current pipeline.`,
      reasonCode: "unsupported_image_format",
      autoVerificationAvailable: false,
      manualVerificationAvailable: false,
      supportedInCurrentPipeline: false,
    };
  }

  // The current backend records eligibility and provenance context, but it
  // does not run a Google SynthID detector in Node for uploaded files.
  return {
    status: "manual_verification_required",
    note: "This image may still be manually reviewable for SynthID, but the current Node upload pipeline does not auto-verify Google watermarks.",
    reasonCode: "node_runtime_auto_verifier_unavailable",
    autoVerificationAvailable: false,
    manualVerificationAvailable: true,
    supportedInCurrentPipeline: false,
  };
}

function buildUploadProvenanceResult(fileMetadata, assetFingerprint) {
  const md5Hash = fileMetadata?.md5Hash || "";
  const crc32c = fileMetadata?.crc32c || "";
  const generation = fileMetadata?.generation || "";
  const metageneration = fileMetadata?.metageneration || "";
  const size = fileMetadata?.size || "";

  if (!md5Hash && !crc32c) {
    return {
      status: "manual_review_required",
      verificationMethod: "cloud-storage-object-integrity",
      verificationId: null,
      note: "Cloud Storage did not return enough integrity metadata to auto-verify this upload.",
      evidence: {
        generation,
        metageneration,
        size,
      },
    };
  }

  const verificationId = createHash("sha256")
    .update([
      assetFingerprint,
      md5Hash,
      crc32c,
      generation,
      metageneration,
      size,
    ].join(":"))
    .digest("hex");

  return {
    status: "verified",
    verificationMethod: "cloud-storage-object-integrity",
    verificationId,
    note: "Verified against immutable Cloud Storage object integrity metadata captured at upload.",
    evidence: {
      md5Hash,
      crc32c,
      generation,
      metageneration,
      size,
    },
  };
}

async function analyzeWithVertex(bucketUri, contentType, fileName) {
  const model = getVertexModel();
  const mediaPart = {
    fileData: {
      fileUri: bucketUri,
      mimeType: contentType,
    },
  };
  const promptPart = {
    text: [
      "You are a digital asset protection analyst for a sports media platform.",
      "Inspect the uploaded media and return only valid JSON.",
      "Required JSON fields:",
      "{",
      '  "authenticityScore": integer 0-100,',
      '  "isDeepfake": boolean,',
      '  "deepfakeReason": string,',
      '  "semanticTags": string[],',
      '  "contentDescription": string,',
      '  "status": "Protected" | "Violation" | "Needs Review"',
      "}",
      "Use 'Violation' when there are strong manipulation or deepfake signals.",
      "Use 'Needs Review' when the evidence is mixed or insufficient.",
      "Use 'Protected' when the media appears authentic.",
      `Filename: ${fileName}`,
    ].join("\n"),
  };

  const response = await model.generateContent({
    contents: [{
      role: "user",
      parts: [mediaPart, promptPart],
    }],
  });

  const responseText = response.response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  console.log("[VERTEX RAW RESPONSE]", responseText);
  return normalizeAnalysis(responseText, fileName);
}

async function findReusableAnalysis(fileMetadata, contentType) {
  const md5Hash = fileMetadata?.md5Hash || "";
  const crc32c = fileMetadata?.crc32c || "";

  if (!md5Hash && !crc32c) {
    return null;
  }

  let snapshot = null;

  if (md5Hash) {
    snapshot = await db.collection("mediaLibrary")
      .where("provenance.evidence.md5Hash", "==", md5Hash)
      .limit(1)
      .get();
  }

  if ((!snapshot || snapshot.empty) && crc32c) {
    snapshot = await db.collection("mediaLibrary")
      .where("provenance.evidence.crc32c", "==", crc32c)
      .limit(1)
      .get();
  }

  if (!snapshot || snapshot.empty) {
    return null;
  }

  const existing = snapshot.docs[0].data();
  if (!existing || existing.mimeType !== contentType) {
    return null;
  }

  const authenticityScore = Number(existing.authenticityScore);

  return {
    authenticityScore: Number.isFinite(authenticityScore) ?
      authenticityScore :
      50,
    isDeepfake: Boolean(existing.isDeepfake),
    deepfakeReason: existing.deepfakeReason || "No anomalies detected.",
    semanticTags: Array.isArray(existing.semanticTags) ?
      existing.semanticTags.filter(Boolean).slice(0, 8) :
      ["sports-media"],
    contentDescription: existing.contentDescription || existing.filename || "Previously analyzed upload",
    status: ["Protected", "Violation", "Needs Review"].includes(existing.status) ?
      existing.status :
      "Needs Review",
    reusedFromAssetId: snapshot.docs[0].id,
  };
}

function normalizeSearchResults(rawText, assets) {
  const assetMap = new Map(assets.map((asset) => [asset.id, asset]));
  const fallbackMatches = assets
    .map((asset) => {
      const score = similarityScore(
          rawText || "",
          [
            asset.title,
            asset.contentDescription || "",
            ...(asset.semanticTags || []),
          ].join(" "),
      );

      return {
        id: asset.id,
        score: Number(score.toFixed(2)),
        reason: "Keyword similarity fallback.",
      };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 12);

  if (!rawText) {
    return fallbackMatches;
  }

  try {
    const parsed = JSON.parse(rawText);
    const matches = Array.isArray(parsed.matches) ? parsed.matches : [];

    return matches
      .map((match) => ({
        id: match.id,
        score: Number(match.score || 0),
        reason: match.reason || "",
      }))
      .filter((match) => assetMap.has(match.id) && Number.isFinite(match.score))
      .sort((left, right) => right.score - left.score)
      .slice(0, 12);
  } catch (error) {
    console.error("[VERTEX SEARCH PARSE ERROR]", error);
    return fallbackMatches;
  }
}

async function rankAssetsWithVertex(searchQuery, assets) {
  const model = getVertexModel();
  const prompt = [
    "You rank media library search results for a digital asset protection app.",
    "Return only valid JSON with this shape:",
    "{",
    '  "matches": [{"id": string, "score": number, "reason": string}]',
    "}",
    "Rules:",
    "- score is 0 to 1",
    "- only include relevant matches",
    "- prefer semantic relevance from title, description, tags, and status",
    "- do not invent IDs",
    `Search query: ${searchQuery}`,
    `Assets: ${JSON.stringify(assets)}`,
  ].join("\n");

  const response = await model.generateContent({
    contents: [{
      role: "user",
      parts: [{
        text: prompt,
      }],
    }],
  });

  const responseText = response.response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  console.log("[VERTEX SEARCH RAW RESPONSE]", responseText);
  return normalizeSearchResults(responseText, assets);
}

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function similarityScore(left, right) {
  const leftTokens = new Set(tokenize(left));
  const rightTokens = new Set(tokenize(right));

  if (!leftTokens.size || !rightTokens.size) {
    return 0;
  }

  let intersection = 0;
  leftTokens.forEach((token) => {
    if (rightTokens.has(token)) {
      intersection += 1;
    }
  });

  return intersection / new Set([...leftTokens, ...rightTokens]).size;
}

function isOwnedUrl(url) {
  return OWNED_HOST_PATTERNS.some((pattern) => url.includes(pattern));
}

function buildSearchQuery(asset) {
  const pieces = [
    asset.title,
    asset.contentDescription,
    ...(asset.semanticTags || []).slice(0, 4),
  ];

  return pieces
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

async function detectWebMatches(asset) {
  if (asset.type !== "Image" || !asset.bucketPath) {
    return {
      provider: "vision_web_detection",
      status: "skipped",
      summary: "Web detection only runs on image assets.",
      matches: [],
      confidence: 0,
    };
  }

  try {
    const client = getVisionClient();
    const [result] = await client.annotateImage({
      image: {
        source: {
          imageUri: asset.bucketPath,
        },
      },
      features: [{
        type: "WEB_DETECTION",
      }],
    });

    const web = result.webDetection || {};
    const pageMatches = (web.pagesWithMatchingImages || [])
      .map((page) => ({
        url: page.url,
        pageTitle: page.pageTitle || "",
      }))
      .filter((page) => page.url && !isOwnedUrl(page.url))
      .slice(0, 5);
    const fullMatches = (web.fullMatchingImages || [])
      .map((image) => image.url)
      .filter((url) => url && !isOwnedUrl(url))
      .slice(0, 5);
    const entities = (web.webEntities || [])
      .map((entity) => ({
        description: entity.description || "",
        score: entity.score || 0,
      }))
      .filter((entity) => entity.description)
      .slice(0, 5);
    const confidence = Math.min(
        0.95,
        (pageMatches.length * 0.18) + (fullMatches.length * 0.2),
    );

    return {
      provider: "vision_web_detection",
      status: "completed",
      summary: pageMatches.length || fullMatches.length ?
        "Web references detected for this image." :
        "No web references detected by Vision API.",
      matches: {
        pages: pageMatches,
        fullMatchingImages: fullMatches,
        entities,
      },
      confidence,
    };
  } catch (error) {
    console.error("[VISION WEB DETECTION ERROR]", error);
    return {
      provider: "vision_web_detection",
      status: "failed",
      summary: error.message,
      matches: [],
      confidence: 0,
    };
  }
}

async function searchYouTubeMatches(asset) {
  if (!YOUTUBE_API_KEY) {
    return {
      provider: "youtube_search",
      status: "skipped",
      summary: "YOUTUBE_API_KEY is not configured.",
      matches: [],
      confidence: 0,
    };
  }

  const queryText = buildSearchQuery(asset);
  if (!queryText) {
    return {
      provider: "youtube_search",
      status: "skipped",
      summary: "Not enough metadata available to build a YouTube query.",
      matches: [],
      confidence: 0,
    };
  }

  try {
    const youtube = google.youtube({
      version: "v3",
      auth: YOUTUBE_API_KEY,
    });
    const response = await youtube.search.list({
      part: ["snippet"],
      type: ["video"],
      maxResults: 5,
      q: queryText,
      order: "relevance",
      safeSearch: "moderate",
    });

    const matches = (response.data.items || [])
      .map((item) => {
        const title = item.snippet?.title || "";
        const similarity = similarityScore(
            `${asset.title} ${asset.contentDescription || ""}`,
            `${title} ${item.snippet?.description || ""}`,
        );

        return {
          url: item.id?.videoId ?
            `https://www.youtube.com/watch?v=${item.id.videoId}` :
            "",
          title,
          channelTitle: item.snippet?.channelTitle || "",
          publishedAt: item.snippet?.publishedAt || "",
          similarity: Number(similarity.toFixed(2)),
        };
      })
      .filter((match) => match.url && match.similarity >= 0.25)
      .sort((left, right) => right.similarity - left.similarity)
      .slice(0, 5);

    const bestSimilarity = matches[0]?.similarity || 0;

    return {
      provider: "youtube_search",
      status: "completed",
      summary: matches.length ?
        "Potential YouTube matches found." :
        "No convincing YouTube matches found.",
      matches,
      confidence: Math.min(0.9, bestSimilarity + (matches.length * 0.05)),
      queryText,
    };
  } catch (error) {
    console.error("[YOUTUBE SEARCH ERROR]", error);
    return {
      provider: "youtube_search",
      status: "failed",
      summary: error.message,
      matches: [],
      confidence: 0,
      queryText,
    };
  }
}

async function ensureBigQueryTable() {
  const bigQuery = getBigQueryClient();
  const dataset = bigQuery.dataset(BIGQUERY_DATASET);
  const [datasetExists] = await dataset.exists();
  if (!datasetExists) {
    await dataset.create({
      location: "US",
    });
  }

  const table = dataset.table(BIGQUERY_TABLE);
  const [tableExists] = await table.exists();
  if (!tableExists) {
    await table.create({
      schema: [
        {name: "scanId", type: "STRING"},
        {name: "assetId", type: "STRING"},
        {name: "assetTitle", type: "STRING"},
        {name: "provider", type: "STRING"},
        {name: "status", type: "STRING"},
        {name: "confidence", type: "FLOAT"},
        {name: "summary", type: "STRING"},
        {name: "createdAt", type: "TIMESTAMP"},
        {name: "resultJson", type: "STRING"},
      ],
    });
  }

  return table;
}

async function logProviderResultsToBigQuery(scanId, asset, providerResults) {
  try {
    const table = await ensureBigQueryTable();
    const rows = providerResults.map((result) => ({
      scanId,
      assetId: asset.id,
      assetTitle: asset.title || asset.filename || "",
      provider: result.provider,
      status: result.status,
      confidence: result.confidence || 0,
      summary: result.summary || "",
      createdAt: new Date().toISOString(),
      resultJson: JSON.stringify(result),
    }));

    if (rows.length) {
      await table.insert(rows);
    }

    return {
      status: "completed",
      rowCount: rows.length,
    };
  } catch (error) {
    console.error("[BIGQUERY LOG ERROR]", error);
    return {
      status: "failed",
      summary: error.message,
    };
  }
}

function buildViolationSummary(asset, providerResults) {
  const evidence = providerResults
    .filter((result) => (result.confidence || 0) >= 0.45)
    .map((result) => ({
      provider: result.provider,
      confidence: result.confidence || 0,
      summary: result.summary,
      matches: result.matches,
    }));

  const maxConfidence = evidence.reduce(
      (current, result) => Math.max(current, result.confidence || 0),
      0,
  );

  const shouldCreateViolation = maxConfidence >= 0.6;

  return {
    shouldCreateViolation,
    maxConfidence,
    evidence,
    summary: shouldCreateViolation ?
      `Potential unauthorized distribution detected for ${asset.title}.` :
      "No external matches passed the violation threshold.",
  };
}

function buildViolationEvidenceSignature(violationSummary) {
  return createHash("sha256")
    .update(JSON.stringify({
      summary: violationSummary.summary,
      evidence: violationSummary.evidence,
    }))
    .digest("hex");
}

function upsertAuditEntry(existingAuditTrail, nextEntry) {
  const trail = Array.isArray(existingAuditTrail) ? [...existingAuditTrail] : [];
  const existingIndex = trail.findIndex((entry) =>
    entry.step === nextEntry.step &&
    entry.details === nextEntry.details,
  );

  if (existingIndex >= 0) {
    trail[existingIndex] = {
      ...trail[existingIndex],
      ...nextEntry,
    };
    return trail;
  }

  trail.push(nextEntry);
  return trail;
}

async function persistViolation(asset, scanId, violationSummary) {
  if (!violationSummary.shouldCreateViolation) {
    return null;
  }

  const createdAt = new Date().toISOString();
  const evidenceSignature = buildViolationEvidenceSignature(violationSummary);
  const existingViolationsSnapshot = await db.collection("violations")
    .where("sourceAssetId", "==", asset.id)
    .limit(10)
    .get();

  const matchingViolationDoc = existingViolationsSnapshot.docs.find((doc) => {
    const data = doc.data();
    return data.evidenceSignature === evidenceSignature;
  });
  const violationRef = matchingViolationDoc ?
    matchingViolationDoc.ref :
    db.collection("violations").doc();

  if (matchingViolationDoc) {
    const existing = matchingViolationDoc.data();
    await violationRef.set({
      scanId,
      sourceAssetId: asset.id,
      sourceAssetFingerprint: asset.assetFingerprint || null,
      title: asset.title,
      type: asset.type,
      thumbnail: asset.thumbnail || asset.downloadURL || asset.downloadUrl || null,
      status: existing.status || "Open",
      createdAt: existing.createdAt || createdAt,
      lastDetectedAt: createdAt,
      detectionCount: Number(existing.detectionCount || 1) + 1,
      confidence: violationSummary.maxConfidence,
      evidence: violationSummary.evidence,
      summary: violationSummary.summary,
      evidenceSignature,
    }, {merge: true});
  } else {
    await violationRef.set({
      scanId,
      sourceAssetId: asset.id,
      sourceAssetFingerprint: asset.assetFingerprint || null,
      title: asset.title,
      type: asset.type,
      thumbnail: asset.thumbnail || asset.downloadURL || asset.downloadUrl || null,
      status: "Open",
      createdAt,
      lastDetectedAt: createdAt,
      detectionCount: 1,
      confidence: violationSummary.maxConfidence,
      evidence: violationSummary.evidence,
      summary: violationSummary.summary,
      evidenceSignature,
    });
  }

  const existingAuditTrail = Array.isArray(asset.auditTrail) ? asset.auditTrail : [];
  const nextAuditTrail = upsertAuditEntry(existingAuditTrail, {
    step: "Security scan flagged potential unauthorized distribution",
    timestamp: createdAt,
    status: "warning",
    details: violationSummary.summary,
    violationId: violationRef.id,
  });
  await db.collection("mediaLibrary").doc(asset.id).set({
    status: "Violation",
    latestSecurityScan: {
      scanId,
      confidence: violationSummary.maxConfidence,
      summary: violationSummary.summary,
      checkedAt: createdAt,
      violationId: violationRef.id,
    },
    auditTrail: nextAuditTrail,
  }, {merge: true});

  return {
    id: violationRef.id,
    confidence: violationSummary.maxConfidence,
  };
}

async function syncMediaStatusForViolation(violation) {
  const sourceAssetId = violation?.sourceAssetId;
  if (!sourceAssetId) {
    return;
  }

  const mediaRef = db.collection("mediaLibrary").doc(sourceAssetId);
  const mediaSnapshot = await mediaRef.get();
  if (!mediaSnapshot.exists) {
    return;
  }

  const media = mediaSnapshot.data();
  const existingAuditTrail = Array.isArray(media.auditTrail) ? media.auditTrail : [];
  const now = new Date().toISOString();

  if (violation.status === "Removed") {
    const openViolationsSnapshot = await db.collection("violations")
      .where("sourceAssetId", "==", sourceAssetId)
      .limit(10)
      .get();
    const hasOtherOpenViolations = openViolationsSnapshot.docs.some((doc) => {
      if (doc.id === violation.id) {
        return false;
      }
      const data = doc.data();
      return data.status !== "Removed";
    });

    await mediaRef.set({
      status: hasOtherOpenViolations ? "Violation" : "Protected",
      latestSecurityScan: {
        ...(media.latestSecurityScan || {}),
        resolvedAt: now,
        violationId: violation.id,
      },
      auditTrail: upsertAuditEntry(existingAuditTrail, {
        step: "Violation case marked removed",
        timestamp: now,
        status: "success",
        details: violation.summary || "A linked violation case was marked removed.",
        violationId: violation.id,
      }),
    }, {merge: true});
    return;
  }

  if (violation.status === "Reviewing") {
    await mediaRef.set({
      status: "Needs Review",
      latestSecurityScan: {
        ...(media.latestSecurityScan || {}),
        reviewingAt: now,
        violationId: violation.id,
      },
      auditTrail: upsertAuditEntry(existingAuditTrail, {
        step: "Violation case moved to review",
        timestamp: now,
        status: "warning",
        details: violation.summary || "A linked violation case is under review.",
        violationId: violation.id,
      }),
    }, {merge: true});
    return;
  }

  await mediaRef.set({
    status: "Violation",
    latestSecurityScan: {
      ...(media.latestSecurityScan || {}),
      reopenedAt: now,
      violationId: violation.id,
    },
  }, {merge: true});
}

async function scanAssetForMatches(scanId, asset) {
  const providerResults = [];

  providerResults.push(await detectWebMatches(asset));
  providerResults.push(await searchYouTubeMatches(asset));

  const bigQueryLog = await logProviderResultsToBigQuery(scanId, asset, providerResults);
  const violationSummary = buildViolationSummary(asset, providerResults);
  const violation = await persistViolation(asset, scanId, violationSummary);

  return {
    assetId: asset.id,
    assetTitle: asset.title || asset.filename || asset.id,
    providerResults,
    bigQueryLog,
    violationSummary,
    violation,
  };
}

async function resolveMediaAsset(mediaId) {
  const directRef = db.collection("mediaLibrary").doc(mediaId);
  const directSnapshot = await directRef.get();

  if (directSnapshot.exists) {
    return {
      mediaId: directSnapshot.id,
      mediaRef: directRef,
      media: directSnapshot.data(),
      linkedViolationDocs: [],
    };
  }

  const violationRef = db.collection("violations").doc(mediaId);
  const violationSnapshot = await violationRef.get();
  if (violationSnapshot.exists) {
    const violation = violationSnapshot.data();
    const sourceAssetId = violation.sourceAssetId;

    if (sourceAssetId) {
      const sourceMediaRef = db.collection("mediaLibrary").doc(sourceAssetId);
      const sourceMediaSnapshot = await sourceMediaRef.get();

      if (sourceMediaSnapshot.exists) {
        return {
          mediaId: sourceMediaSnapshot.id,
          mediaRef: sourceMediaRef,
          media: sourceMediaSnapshot.data(),
          linkedViolationDocs: [violationRef],
        };
      }
    }
  }

  const fingerprintSnapshot = await db.collection("mediaLibrary")
    .where("assetFingerprint", "==", mediaId)
    .limit(1)
    .get();

  if (!fingerprintSnapshot.empty) {
    const doc = fingerprintSnapshot.docs[0];
    return {
      mediaId: doc.id,
      mediaRef: doc.ref,
      media: doc.data(),
      linkedViolationDocs: [],
    };
  }

  const sourceAssetViolationSnapshot = await db.collection("violations")
    .where("sourceAssetId", "==", mediaId)
    .limit(1)
    .get();

  if (!sourceAssetViolationSnapshot.empty) {
    const violationDoc = sourceAssetViolationSnapshot.docs[0];
    const violation = violationDoc.data();
    const sourceAssetId = violation.sourceAssetId;

    if (sourceAssetId) {
      const sourceMediaRef = db.collection("mediaLibrary").doc(sourceAssetId);
      const sourceMediaSnapshot = await sourceMediaRef.get();

      if (sourceMediaSnapshot.exists) {
        return {
          mediaId: sourceMediaSnapshot.id,
          mediaRef: sourceMediaRef,
          media: sourceMediaSnapshot.data(),
          linkedViolationDocs: [violationDoc.ref],
        };
      }
    }
  }

  return null;
}

exports.searchLibraryAssets = onCall({region: REGION}, async (request) => {
  const searchQuery = (request.data?.query || "").trim();

  if (searchQuery.length < 2) {
    return {
      query: searchQuery,
      matches: [],
    };
  }

  const snapshot = await db.collection("mediaLibrary")
    .orderBy("uploadDate", "desc")
    .limit(MAX_SEARCH_ASSETS)
    .get();

  const assets = snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title || "",
    type: doc.data().type || "",
    status: doc.data().status || "",
    authenticityScore: doc.data().authenticityScore || 0,
    contentDescription: doc.data().contentDescription || "",
    semanticTags: Array.isArray(doc.data().semanticTags) ?
      doc.data().semanticTags.slice(0, 8) :
      [],
  }));

  const matches = await rankAssetsWithVertex(searchQuery, assets);
  return {
    query: searchQuery,
    matches,
  };
});

exports.deleteMediaAsset = onCall({region: REGION}, async (request) => {
  const mediaId = request.data?.mediaId;

  if (!mediaId || typeof mediaId !== "string") {
    throw new HttpsError(
        "invalid-argument",
        "A valid mediaId is required to delete an asset.",
    );
  }

  const resolvedMedia = await resolveMediaAsset(mediaId);
  if (!resolvedMedia) {
    throw new HttpsError("not-found", "Media asset not found.");
  }

  const {mediaRef, media, linkedViolationDocs} = resolvedMedia;
  const parsedStorageUri = parseStorageUri(media.bucketPath);
  const storageBucket = parsedStorageUri?.bucket;
  const storagePath = media.storagePath || parsedStorageUri?.filePath;

  if (storageBucket && storagePath) {
    try {
      await admin.storage().bucket(storageBucket).file(storagePath).delete({
        ignoreNotFound: true,
      });
    } catch (error) {
      console.error("[DELETE MEDIA STORAGE ERROR]", error);
      throw new HttpsError(
          "internal",
          "The media record exists, but deleting the storage file failed.",
      );
    }
  }

  const violationsSnapshot = await db.collection("violations")
    .where("sourceAssetId", "==", mediaRef.id)
    .get();
  const batch = db.batch();
  const violationRefPaths = new Set();

  batch.delete(mediaRef);
  linkedViolationDocs.forEach((docRef) => {
    if (!violationRefPaths.has(docRef.path)) {
      violationRefPaths.add(docRef.path);
      batch.delete(docRef);
    }
  });
  violationsSnapshot.forEach((doc) => {
    if (!violationRefPaths.has(doc.ref.path)) {
      violationRefPaths.add(doc.ref.path);
      batch.delete(doc.ref);
    }
  });
  await batch.commit();

  return {
    status: "deleted",
    mediaId: mediaRef.id,
    deletedViolations: violationRefPaths.size,
    deletedStorageFile: Boolean(storageBucket && storagePath),
  };
});

exports.startSecurityScan = onCall({region: REGION}, async () => {
  const startedAt = new Date().toISOString();
  const scanRef = db.collection("securityScans").doc();

  await scanRef.set({
    startedAt,
    completedAt: null,
    status: "running",
    stage: "inventory",
    provider: "vision-youtube-bigquery",
    summary: "Initializing backend security scan.",
    totalAssetsScanned: 0,
    matchesFound: 0,
    findings: [],
  });

  try {
    const snapshot = await db.collection("mediaLibrary")
      .orderBy("uploadDate", "desc")
      .limit(MAX_SCAN_ASSETS)
      .get();
    const assets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const findings = [];

    for (const asset of assets) {
      const result = await scanAssetForMatches(scanRef.id, asset);
      findings.push(result);

      await scanRef.set({
        stage: `scanned:${asset.id}`,
        totalAssetsScanned: findings.length,
      }, {merge: true});
    }

    const matchesFound = findings.filter((finding) =>
      finding.violationSummary.shouldCreateViolation).length;

    await scanRef.set({
      completedAt: new Date().toISOString(),
      status: "completed",
      stage: "complete",
      summary: matchesFound ?
        `Security scan completed with ${matchesFound} potential violation(s).` :
        "Security scan completed with no matches above threshold.",
      totalAssetsScanned: assets.length,
      matchesFound,
      findings,
      providers: {
        visionWebDetection: true,
        youtubeSearch: Boolean(YOUTUBE_API_KEY),
        bigQueryLogging: true,
        xSearch: false,
        tiktokSearch: false,
      },
    }, {merge: true});

    return {
      scanId: scanRef.id,
      status: "completed",
      totalAssetsScanned: assets.length,
      matchesFound,
      summary: matchesFound ?
        `Security scan completed with ${matchesFound} potential violation(s).` :
        "Security scan completed with no matches above threshold.",
      unsupportedProviders: [
        "x_search_pending_provider_access",
        "tiktok_search_not_available_via_official_public_api",
      ],
    };
  } catch (error) {
    console.error("[SECURITY SCAN ERROR]", error);

    await scanRef.set({
      completedAt: new Date().toISOString(),
      status: "failed",
      stage: "error",
      summary: error.message,
      findings: [],
    }, {merge: true});

    throw error;
  }
});

exports.updateViolationStatus = onCall({region: REGION}, async (request) => {
  const violationId = request.data?.violationId;
  const nextStatus = request.data?.status;

  if (!violationId || typeof violationId !== "string") {
    throw new HttpsError("invalid-argument", "A valid violationId is required.");
  }

  if (!["Open", "Reviewing", "Removed"].includes(nextStatus)) {
    throw new HttpsError("invalid-argument", "Status must be Open, Reviewing, or Removed.");
  }

  const violationRef = db.collection("violations").doc(violationId);
  const violationSnapshot = await violationRef.get();

  if (!violationSnapshot.exists) {
    throw new HttpsError("not-found", "Violation not found.");
  }

  const updatedAt = new Date().toISOString();
  await violationRef.set({
    status: nextStatus,
    updatedAt,
  }, {merge: true});

  const updatedViolationSnapshot = await violationRef.get();
  const updatedViolation = {
    id: updatedViolationSnapshot.id,
    ...updatedViolationSnapshot.data(),
  };

  await syncMediaStatusForViolation(updatedViolation);

  return {
    violationId,
    status: nextStatus,
    updatedAt,
  };
});

exports.resetSecurityData = onCall({region: REGION}, async () => {
  const violationsSnapshot = await db.collection("violations").get();
  const scansSnapshot = await db.collection("securityScans").get();
  const mediaSnapshot = await db.collection("mediaLibrary").get();
  const batchSize = 400;

  const deleteDocsInBatches = async (docs) => {
    for (let index = 0; index < docs.length; index += batchSize) {
      const batch = db.batch();
      docs.slice(index, index + batchSize).forEach((item) => {
        batch.delete(item.ref);
      });
      await batch.commit();
    }
  };

  const mediaDocsToReset = mediaSnapshot.docs.filter((doc) => {
    const data = doc.data();
    return data.status === "Violation" ||
      data.status === "Needs Review" ||
      data.latestSecurityScan ||
      (Array.isArray(data.auditTrail) && data.auditTrail.some((entry) =>
        entry.step === "Security scan flagged potential unauthorized distribution" ||
        entry.step === "Violation case moved to review" ||
        entry.step === "Violation case marked removed",
      ));
  });

  for (let index = 0; index < mediaDocsToReset.length; index += batchSize) {
    const batch = db.batch();
    mediaDocsToReset.slice(index, index + batchSize).forEach((item) => {
      const data = item.data();
      const auditTrail = Array.isArray(data.auditTrail) ? data.auditTrail : [];
      const cleanedAuditTrail = auditTrail.filter((entry) =>
        entry.step !== "Security scan flagged potential unauthorized distribution" &&
        entry.step !== "Violation case moved to review" &&
        entry.step !== "Violation case marked removed",
      );

      batch.set(item.ref, {
        status: "Protected",
        latestSecurityScan: admin.firestore.FieldValue.delete(),
        auditTrail: cleanedAuditTrail,
      }, {merge: true});
    });
    await batch.commit();
  }

  await deleteDocsInBatches(violationsSnapshot.docs);
  await deleteDocsInBatches(scansSnapshot.docs);

  return {
    status: "reset",
    deletedViolations: violationsSnapshot.size,
    deletedScans: scansSnapshot.size,
    resetAssets: mediaDocsToReset.length,
  };
});

exports.onMediaUpload = onObjectFinalized({region: REGION}, async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;
  const contentType = event.data.contentType || "";

  if (!filePath) {
    console.log("Storage event missing file path. Skipping.");
    return;
  }

  if (!contentType.startsWith("video/") && !contentType.startsWith("image/")) {
    console.log(`Skipping unsupported content type: ${contentType}`);
    return;
  }

  const fileName = filePath.split("/").pop() || filePath;
  const storageUri = `gs://${fileBucket}/${filePath}`;
  const file = admin.storage().bucket(fileBucket).file(filePath);
  const assetFingerprint = createHash("sha256")
    .update(`${storageUri}:${event.data.generation || ""}`)
    .digest("hex");

  console.log(`[PIPELINE START] Processing ${storageUri}`);

  try {
    const [fileMetadata] = await file.getMetadata();
    const downloadToken = await ensureDownloadToken(file);
    const downloadURL = buildStableDownloadUrl(fileBucket, filePath, downloadToken);
    const reusableAnalysis = await findReusableAnalysis(fileMetadata, contentType);
    const aiAnalysis = reusableAnalysis ||
      await analyzeWithVertex(storageUri, contentType, fileName);
    const synthId = buildSynthIdResult(contentType);
    const provenance = buildUploadProvenanceResult(fileMetadata, assetFingerprint);
    const now = new Date();

    const metadata = {
      assetFingerprint,
      filename: fileName,
      title: fileName.replace(/\.[^/.]+$/, ""),
      bucketPath: storageUri,
      storagePath: filePath,
      downloadURL,
      thumbnail: contentType.startsWith("image/") ? downloadURL : null,
      type: contentType.startsWith("video/") ? "Video" : "Image",
      mimeType: contentType,
      uploadDate: event.data.timeCreated || now.toISOString(),
      processedAt: now.toISOString(),
      status: aiAnalysis.status,
      authenticityScore: aiAnalysis.authenticityScore,
      semanticTags: aiAnalysis.semanticTags,
      contentDescription: aiAnalysis.contentDescription,
      deepfakeReason: aiAnalysis.deepfakeReason,
      analysisProvider: "vertex-ai",
      analysisModel: VERTEX_MODEL,
      analysisReusedFromAssetId: reusableAnalysis?.reusedFromAssetId || null,
      provenance,
      synthId,
      synthIdSignature: synthId.status === "verified" ?
        `verified:${assetFingerprint.slice(0, 16)}` :
        null,
      auditTrail: [
        {
          step: "Uploaded to Google Cloud Storage",
          timestamp: event.data.timeCreated || now.toISOString(),
          status: "success",
        },
        {
          step: `Vertex AI ${VERTEX_MODEL} analysis completed`,
          timestamp: now.toISOString(),
          status: "success",
          details: `Authenticity score ${aiAnalysis.authenticityScore}/100`,
        },
        {
          step: `Upload provenance status: ${provenance.status}`,
          timestamp: now.toISOString(),
          status: provenance.status === "verified" ? "success" : "warning",
          details: provenance.note,
        },
        {
          step: `SynthID status: ${synthId.status}`,
          timestamp: now.toISOString(),
          status: synthId.status === "verified" ? "success" :
            synthId.status === "manual_verification_required" ? "warning" :
            "success",
          details: synthId.note,
        },
      ],
    };

    await db.collection("mediaLibrary")
      .doc(assetFingerprint.slice(0, 32))
      .set(metadata, {merge: true});

    console.log(`[PIPELINE COMPLETE] ${storageUri} -> ${aiAnalysis.status}`);
  } catch (error) {
    console.error(`[PIPELINE ERROR] ${storageUri}`, error);

    await db.collection("mediaLibrary")
      .doc(assetFingerprint.slice(0, 32))
      .set({
        assetFingerprint,
        filename: fileName,
        title: fileName.replace(/\.[^/.]+$/, ""),
        bucketPath: storageUri,
        storagePath: filePath,
        type: contentType.startsWith("video/") ? "Video" : "Image",
        mimeType: contentType,
        uploadDate: event.data.timeCreated || new Date().toISOString(),
        processedAt: new Date().toISOString(),
        status: "Needs Review",
        authenticityScore: 0,
        analysisProvider: "vertex-ai",
        analysisModel: VERTEX_MODEL,
        provenance: {
          status: "manual_review_required",
          verificationMethod: "cloud-storage-object-integrity",
          verificationId: null,
          note: "Upload provenance could not be verified because backend analysis failed before metadata verification completed.",
        },
        synthId: buildSynthIdResult(contentType),
        auditTrail: [{
          step: "Backend analysis failed",
          timestamp: new Date().toISOString(),
          status: "failed",
          details: error.message,
        }],
      }, {merge: true});
  }
});
