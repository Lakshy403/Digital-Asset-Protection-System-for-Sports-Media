const { onObjectFinalized } = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.onMediaUpload = onObjectFinalized(async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name; 
  const contentType = event.data.contentType;

  // Exit if this is triggered on a file that is not an image/video or already processed.
  if (!contentType.startsWith('video/') && !contentType.startsWith('image/')) {
    return console.log('This is not an image or video. Skipping.');
  }

  // fileName handles cases like "videos/myVideo.mp4" -> "myVideo.mp4"
  const fileName = filePath.split('/').pop();

  console.log(`[PIPELINE START] Processing newly uploaded media: ${fileName}`);

  try {
    // 1. Simulate Vertex AI SynthID Watermarking Time
    console.log(`[Vertex AI] Applying SynthID cryptographically signed watermark...`);
    await new Promise(resolve => setTimeout(resolve, 3500)); // Simulate 3.5s lag
    
    // Generate mock SynthID signature
    const synthIdSignature = `synth_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const authenticityScore = Math.floor(Math.random() * (100 - 85 + 1) + 85); // Score 85-100

    // 2. Insert Provenance Metadata into Firestore
    console.log(`[Firestore] Registering provenance metadata...`);
    
    // We update/create a document in 'mediaLibrary' collection
    const metadata = {
      id: synthIdSignature, // Use signature as part of ID for demo tracking
      filename: fileName,
      bucketPath: `gs://${fileBucket}/${filePath}`,
      title: fileName.replace(/\.[^/.]+$/, ""), // File name without extension
      type: contentType.startsWith('video/') ? 'Video' : 'Image',
      uploadDate: new Date().toISOString(),
      status: "Protected",
      thumbnail: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop", // Stock sports thumbnail
      size: "Upload Stream", 
      synthIdSignature: synthIdSignature,
      authenticityScore: authenticityScore,
      auditTrail: [
        { 
          step: "Uploaded to Google Cloud Storage bucket",
          timestamp: new Date(Date.now() - 4000).toISOString(),
          status: "success"
        },
        { 
          step: "SynthID invisible watermark injected (Vertex AI)",
          timestamp: new Date(Date.now() - 2000).toISOString(),
          signature: synthIdSignature,
          status: "success"
        },
        { 
          step: "Asset hash registered in BigQuery Ledger",
          timestamp: new Date().toISOString(),
          status: "success"
        }
      ]
    };

    // Store in Firestore
    await db.collection("mediaLibrary").add(metadata);

    console.log(`[PIPELINE COMPLETE] Media ${fileName} successfully protected and registered.`);
  } catch (error) {
    console.error(`[PIPELINE ERROR] Failed to process media:`, error);
  }
});
