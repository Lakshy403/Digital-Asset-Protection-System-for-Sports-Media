import { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  BarChart,
  AlertTriangle,
  Fingerprint,
  Loader2,
  GlobeLock,
  RefreshCw,
} from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import {
  collection,
  onSnapshot,
  query,
} from 'firebase/firestore';

function formatPlatformFromUrl(url = '') {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'YouTube';
    }
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return 'X';
    }
    if (hostname.includes('facebook.com')) {
      return 'Facebook';
    }
    if (hostname.includes('instagram.com')) {
      return 'Instagram';
    }
    if (hostname.includes('tiktok.com')) {
      return 'TikTok';
    }
    if (hostname.includes('googleusercontent.com')) {
      return 'Google CDN';
    }

    return hostname;
  } catch {
    return 'External Web';
  }
}

function buildRowsFromViolation(violation) {
  const evidence = Array.isArray(violation.evidence) ? violation.evidence : [];

  const rows = evidence.flatMap((entry, evidenceIndex) => {
    const provider = entry?.provider || 'unknown';
    const confidence = Math.round((entry?.confidence || 0) * 100);
    const summary = entry?.summary || violation.summary || 'Potential external match detected.';
    const matches = entry?.matches;

    if (provider === 'youtube_search' && Array.isArray(matches)) {
      return matches.map((match, matchIndex) => ({
        id: `${violation.id}-yt-${evidenceIndex}-${matchIndex}`,
        violationId: violation.id,
        sourceTitle: violation.title || 'Untitled asset',
        sourceType: violation.type || 'Asset',
        sourceAssetId: violation.sourceAssetId || null,
        sourceAssetFingerprint: violation.sourceAssetFingerprint || null,
        sourceThumbnail: violation.thumbnail || null,
        confidence,
        summary,
        platform: 'YouTube',
        matchUrl: match?.url || '',
        matchLabel: match?.title || match?.url || 'YouTube match',
        provider,
        providerSummary: entry?.summary || '',
        createdAt: violation.createdAt || null,
        status: violation.status || 'Open',
        synthLabel: violation.sourceAssetFingerprint ? 'Provenance tracked' : 'No fingerprint',
      }));
    }

    if (provider === 'vision_web_detection') {
      const pages = Array.isArray(matches?.pages) ? matches.pages : [];
      const fullMatchingImages = Array.isArray(matches?.fullMatchingImages) ?
        matches.fullMatchingImages :
        [];

      const pageRows = pages.map((page, matchIndex) => ({
        id: `${violation.id}-page-${evidenceIndex}-${matchIndex}`,
        violationId: violation.id,
        sourceTitle: violation.title || 'Untitled asset',
        sourceType: violation.type || 'Asset',
        sourceAssetId: violation.sourceAssetId || null,
        sourceAssetFingerprint: violation.sourceAssetFingerprint || null,
        sourceThumbnail: violation.thumbnail || null,
        confidence,
        summary,
        platform: formatPlatformFromUrl(page?.url),
        matchUrl: page?.url || '',
        matchLabel: page?.pageTitle || page?.url || 'Web page match',
        provider,
        providerSummary: entry?.summary || '',
        createdAt: violation.createdAt || null,
        status: violation.status || 'Open',
        synthLabel: violation.sourceAssetFingerprint ? 'Provenance tracked' : 'No fingerprint',
      }));

      const imageRows = fullMatchingImages.map((url, matchIndex) => ({
        id: `${violation.id}-img-${evidenceIndex}-${matchIndex}`,
        violationId: violation.id,
        sourceTitle: violation.title || 'Untitled asset',
        sourceType: violation.type || 'Asset',
        sourceAssetId: violation.sourceAssetId || null,
        sourceAssetFingerprint: violation.sourceAssetFingerprint || null,
        sourceThumbnail: violation.thumbnail || null,
        confidence,
        summary,
        platform: formatPlatformFromUrl(url),
        matchUrl: url || '',
        matchLabel: url || 'Full image match',
        provider,
        providerSummary: entry?.summary || '',
        createdAt: violation.createdAt || null,
        status: violation.status || 'Open',
        synthLabel: violation.sourceAssetFingerprint ? 'Provenance tracked' : 'No fingerprint',
      }));

      return [...pageRows, ...imageRows];
    }

    return [{
      id: `${violation.id}-summary-${evidenceIndex}`,
      violationId: violation.id,
      sourceTitle: violation.title || 'Untitled asset',
      sourceType: violation.type || 'Asset',
      sourceAssetId: violation.sourceAssetId || null,
      sourceAssetFingerprint: violation.sourceAssetFingerprint || null,
      sourceThumbnail: violation.thumbnail || null,
      confidence,
      summary,
      platform: provider.replace(/_/g, ' '),
      matchUrl: '',
      matchLabel: summary,
      provider,
      providerSummary: entry?.summary || '',
      createdAt: violation.createdAt || null,
      status: violation.status || 'Open',
      synthLabel: violation.sourceAssetFingerprint ? 'Provenance tracked' : 'No fingerprint',
    }];
  });

  if (rows.length > 0) {
    return rows;
  }

  return [{
    id: `${violation.id}-fallback`,
    violationId: violation.id,
    sourceTitle: violation.title || 'Untitled asset',
    sourceType: violation.type || 'Asset',
    sourceAssetId: violation.sourceAssetId || null,
    sourceAssetFingerprint: violation.sourceAssetFingerprint || null,
    sourceThumbnail: violation.thumbnail || null,
    confidence: Math.round((violation.confidence || 0) * 100),
    summary: violation.summary || 'Potential unauthorized distribution detected.',
    platform: 'Pending evidence',
    matchUrl: '',
    matchLabel: violation.summary || 'Awaiting linked evidence details',
    provider: 'violation_summary',
    providerSummary: violation.summary || '',
    createdAt: violation.createdAt || null,
    status: violation.status || 'Open',
    synthLabel: violation.sourceAssetFingerprint ? 'Provenance tracked' : 'No fingerprint',
  }];
}

function formatRelativeStatus(status) {
  if (status === 'Removed') {
    return {
      label: 'Removed',
      className: 'bg-green-500/10 text-green-500',
    };
  }

  if (status === 'Reviewing') {
    return {
      label: 'Reviewing',
      className: 'bg-yellow-500/10 text-yellow-500',
    };
  }

  return {
    label: 'Open',
    className: 'bg-red-500/10 text-red-500',
  };
}

export default function DetectionResults() {
  const [violations, setViolations] = useState([]);
  const [latestScan, setLatestScan] = useState(null);
  const [loading, setLoading] = useState(Boolean(db));
  const [statusMessage, setStatusMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!statusMessage) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setStatusMessage(null);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [statusMessage]);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return undefined;
    }

    const violationsQuery = query(collection(db, 'violations'));
    const scansQuery = query(collection(db, 'securityScans'));

    const unsubscribeViolations = onSnapshot(violationsQuery, (snapshot) => {
      const docs = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      docs.sort((left, right) => {
        const leftDate = new Date(left.createdAt || 0).getTime();
        const rightDate = new Date(right.createdAt || 0).getTime();
        return rightDate - leftDate;
      });

      setViolations(docs);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching violations:', error);
      setStatusMessage({
        type: 'error',
        text: error.message || 'Failed to load violation results.',
      });
      setLoading(false);
    });

    const unsubscribeScans = onSnapshot(scansQuery, (snapshot) => {
      const scans = snapshot.docs.map((item) => item.data());
      scans.sort((left, right) => {
        const leftDate = new Date(left.completedAt || left.startedAt || 0).getTime();
        const rightDate = new Date(right.completedAt || right.startedAt || 0).getTime();
        return rightDate - leftDate;
      });
      setLatestScan(scans[0] || null);
    });

    return () => {
      unsubscribeViolations();
      unsubscribeScans();
    };
  }, []);

  const rows = useMemo(() => violations.flatMap((violation) => buildRowsFromViolation(violation)), [violations]);

  const metrics = useMemo(() => {
    const activeCount = violations.filter((item) => item.status !== 'Removed').length;
    const removedCount = violations.filter((item) => item.status === 'Removed').length;
    const confidenceAverage = rows.length ?
      Math.round(rows.reduce((sum, row) => sum + (row.confidence || 0), 0) / rows.length) :
      0;

    return {
      activeCount,
      removedCount,
      confidenceAverage,
    };
  }, [rows, violations]);

  const handleRunSecurityScan = async () => {
    if (!functions) {
      setStatusMessage({
        type: 'error',
        text: 'Cloud Functions is not available in this session.',
      });
      return;
    }

    setIsScanning(true);
    setStatusMessage({
      type: 'info',
      text: 'Starting backend security scan...',
    });

    try {
      const startSecurityScan = httpsCallable(functions, 'startSecurityScan');
      const { data } = await startSecurityScan();
      setStatusMessage({
        type: 'success',
        text: `${data.summary} Assets scanned: ${data.totalAssetsScanned}. Matches found: ${data.matchesFound}.`,
      });
    } catch (error) {
      console.error(error);
      setStatusMessage({
        type: 'error',
        text: error.message || 'Security scan failed to start.',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleResetSecurityData = async () => {
    if (!functions) {
      setStatusMessage({
        type: 'error',
        text: 'Cloud Functions is not available in this session.',
      });
      return;
    }

    const shouldReset = window.confirm(
      'Reset all stored security scans and linked violation results?'
    );

    if (!shouldReset) {
      return;
    }

    setIsResetting(true);
    setStatusMessage({
      type: 'info',
      text: 'Resetting security scan history...',
    });

    try {
      const resetSecurityData = httpsCallable(functions, 'resetSecurityData');
      const { data } = await resetSecurityData();
      setStatusMessage({
        type: 'success',
        text: `Reset complete. Deleted ${data.deletedViolations} violation(s), ${data.deletedScans} scan(s), and reset ${data.resetAssets} asset record(s).`,
      });
    } catch (error) {
      console.error('Failed to reset security data', error);
      setStatusMessage({
        type: 'error',
        text: error?.message === 'internal'
          ? 'Backend returned an internal error while resetting scan data. Deploy the latest Cloud Functions code and check the function logs.'
          : (error?.message || 'Failed to reset security data.'),
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleViolationStatusUpdate = async (violationId, nextStatus) => {
    if (!functions || updatingId) {
      return;
    }

    setUpdatingId(violationId);
    try {
      const updateViolationStatus = httpsCallable(functions, 'updateViolationStatus');
      await updateViolationStatus({
        violationId,
        status: nextStatus,
      });
      setStatusMessage({
        type: 'success',
        text: `Violation ${violationId.slice(0, 8)} updated to ${nextStatus}.`,
      });
    } catch (error) {
      console.error('Failed to update violation status', error);
      setStatusMessage({
        type: 'error',
        text: error?.message === 'internal'
          ? 'Backend returned an internal error while updating the violation. Deploy the latest Cloud Functions code and check the function logs.'
          : (error?.message || 'Failed to update the violation status.'),
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Detection Results</h1>
          <p className="text-sm text-[var(--text-secondary)]">Review backend-matched copyright risk signals and linked evidence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSecurityData}
            disabled={isResetting}
            className="inline-flex items-center gap-2 px-4 py-2 border border-amber-500/30 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all text-sm font-bold disabled:opacity-50"
          >
            {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isResetting ? 'Resetting...' : 'Reset All'}
          </button>
          <button
            onClick={handleRunSecurityScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/30 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.15)] disabled:opacity-50"
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <GlobeLock className="w-4 h-4" />}
            {isScanning ? 'Scanning Web...' : 'Run Security Scan'}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            statusMessage.type === 'error'
              ? 'border-red-500/30 bg-red-500/10 text-red-300'
              : statusMessage.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Open Backend Violations</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{metrics.activeCount}</p>
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Marked Removed</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{metrics.removedCount}</p>
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center">
            <BarChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Avg. Evidence Confidence</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{metrics.confidenceAverage}%</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          Latest Security Scan
        </div>
        {latestScan ? (
          <>
            <p className="text-sm text-[var(--text-secondary)]">{latestScan.summary || 'Scan finished with no summary.'}</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Status: {latestScan.status || 'unknown'} | Assets scanned: {latestScan.totalAssetsScanned || 0} | Matches found: {latestScan.matchesFound || 0}
            </p>
          </>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">No backend security scan has completed yet.</p>
        )}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[var(--text-secondary)]">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-3" />
            Loading backend violation results...
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--text-secondary)]">
            <CheckCircle className="w-10 h-10 mb-3 text-green-500/80" />
            <p className="text-lg font-medium text-[var(--text-primary)]">No live violations found</p>
            <p className="text-sm mt-1">Run a backend security scan to populate this page with real evidence.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Source Media</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Matched Evidence</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Platform</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Confidence</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {rows.map((result) => {
                  const statusPill = formatRelativeStatus(result.status);
                  const isUpdating = updatingId === result.violationId;

                  return (
                    <tr key={result.id} className="hover:bg-[var(--background)]/50 transition-colors align-top">
                      <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-[var(--background)] border border-[var(--border)] shrink-0">
                            {result.sourceThumbnail ? (
                              <img
                                src={result.sourceThumbnail}
                                alt={result.sourceTitle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                                <ShieldAlert className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span>{result.sourceTitle}</span>
                            <span className="text-xs text-[var(--text-secondary)]">{result.sourceType}</span>
                            <span className="flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded w-max border border-indigo-500/20">
                              <Fingerprint className="w-3 h-3" /> {result.synthLabel}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                        <div className="flex flex-col gap-2">
                          {result.matchUrl ? (
                            <a
                              href={result.matchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-start gap-2 text-indigo-400 hover:text-indigo-300 break-all"
                            >
                              <span>{result.matchLabel}</span>
                              <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-[var(--text-primary)]">{result.matchLabel}</span>
                          )}
                          <span className="text-xs">{result.summary}</span>
                          {result.createdAt && (
                            <span className="text-[10px] text-[var(--text-secondary)]">
                              Detected on {new Date(result.createdAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{result.platform}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[var(--background)] rounded-full">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${result.confidence}%` }}
                            />
                          </div>
                          <span className="text-[var(--text-secondary)]">{result.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {result.status === 'Reviewing' ? (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusPill.className}`}>
                            <AlertTriangle className="w-3 h-3" /> {statusPill.label}
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusPill.className}`}>
                            {statusPill.label}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex flex-col items-end gap-2">
                          {result.matchUrl && (
                            <a
                              href={result.matchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-500 hover:text-indigo-400 font-medium text-sm"
                            >
                              Open Match
                            </a>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViolationStatusUpdate(result.violationId, 'Reviewing')}
                              disabled={isUpdating || result.status === 'Reviewing'}
                              className="text-yellow-400 hover:text-yellow-300 text-xs font-medium disabled:opacity-40"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleViolationStatusUpdate(result.violationId, 'Removed')}
                              disabled={isUpdating || result.status === 'Removed'}
                              className="text-green-500 hover:text-green-400 text-xs font-medium disabled:opacity-40"
                            >
                              Mark Removed
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
