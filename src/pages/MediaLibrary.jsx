import { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert, Play, Fingerprint, Clock, X, Loader2, Sparkles, GlobeLock, UploadCloud, Tag, Star, Trash2 } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function MediaLibrary() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleGlobalScan = () => {
    if (!functions) {
      setScanStatus({
        type: 'error',
        text: 'Cloud Functions is not available in this session.',
      });
      return;
    }

    setIsScanning(true);
    setScanStatus({
      type: 'info',
      text: 'Starting backend security scan...',
    });

    const startSecurityScan = httpsCallable(functions, 'startSecurityScan');
    startSecurityScan()
      .then(({ data }) => {
        setScanStatus({
          type: 'success',
          text: `${data.summary} Assets scanned: ${data.totalAssetsScanned}. Matches found: ${data.matchesFound}.`,
        });
      })
      .catch((err) => {
        console.error(err);
        setScanStatus({
          type: 'error',
          text: err.message || 'Security scan failed to start.',
        });
      })
      .finally(() => {
        setIsScanning(false);
      });
  };

  const handleDeleteMedia = async () => {
    if (!functions || !selectedMedia || isDeleting) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${selectedMedia.title}" from Cloud Storage and Firestore? This cannot be undone.`
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    setScanStatus({
      type: 'info',
      text: `Deleting ${selectedMedia.title}...`,
    });

    try {
      const deleteMediaAsset = httpsCallable(functions, 'deleteMediaAsset');
      const { data } = await deleteMediaAsset({
        mediaId: selectedMedia.id,
      });

      setSelectedMedia(null);
      setScanStatus({
        type: 'success',
        text: `Deleted ${selectedMedia.title}. Removed ${data.deletedViolations} linked violation record(s).`,
      });
    } catch (err) {
      console.error(err);
      setScanStatus({
        type: 'error',
        text: err.message || 'Failed to delete this media asset.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!scanStatus) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setScanStatus(null);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [scanStatus]);

  useEffect(() => {
    // Check if initializing Firebase failed by trying to query
    if (!db) {
      console.error("Firestore initialized failed, showing empty state.");
      return undefined;
    }

    const q = query(collection(db, "mediaLibrary"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const media = [];
      snapshot.forEach((doc) => {
        media.push({ id: doc.id, ...doc.data() });
      });
      // Sort by uploadDate descending client-side since we didn't deploy indexes
      media.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      setMediaData(media);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching media library: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fallbackFilter = (items, rawQuery) => items.filter((item) => {
    if (!rawQuery) return true;
    const s = rawQuery.toLowerCase();
    
    // Lightweight client-side keyword matching for common sports intents
    if (s.includes('player getting knocked out') || s.includes('violent foul') || s.includes('fight') || s.includes('knockout') || s.includes('crash')) {
      return item.title.toLowerCase().includes('ufc') || item.title.toLowerCase().includes('knockout') || item.title.toLowerCase().includes('foul') || item.title.toLowerCase().includes('crash');
    }
    if (s.includes('goal') || s.includes('soccer') || s.includes('messi') || s.includes('football')) {
      return item.title.toLowerCase().includes('uefa') || item.title.toLowerCase().includes('goal') || item.title.toLowerCase().includes('football') || item.title.toLowerCase().includes('highlight');
    }
    if (s.includes('dunk') || s.includes('basketball') || s.includes('nba')) {
      return item.title.toLowerCase().includes('nba') || item.title.toLowerCase().includes('dunk');
    }
    
    // Fallback keyword search
    return item.title.toLowerCase().includes(s);
  });

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      setSearchResults(null);
      setIsSearching(false);
      return undefined;
    }

    if (!functions) {
      setSearchResults(fallbackFilter(mediaData, trimmedQuery));
      setIsSearching(false);
      return undefined;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setIsSearching(true);

      try {
        const searchLibraryAssets = httpsCallable(functions, 'searchLibraryAssets');
        const { data } = await searchLibraryAssets({ query: trimmedQuery });
        if (cancelled) {
          return;
        }

        const rankedIds = Array.isArray(data.matches) ? data.matches.map((match) => match.id) : [];
        const mediaMap = new Map(mediaData.map((item) => [item.id, item]));
        const rankedItems = rankedIds
          .map((id) => mediaMap.get(id))
          .filter(Boolean);

        setSearchResults(rankedItems);
      } catch (error) {
        console.error('Vertex AI library search failed', error);
        if (!cancelled) {
          setSearchResults(fallbackFilter(mediaData, trimmedQuery));
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [functions, mediaData, searchQuery]);

  const displayData = searchQuery.trim() ? (searchResults || []) : mediaData;

  const getSynthStatusProfile = (item) => {
    const synthStatus = item?.synthId?.status;

    if (synthStatus === 'verified') {
      return {
        label: 'SynthID verified',
        actionText: 'SynthID Verified',
        helpText: item?.synthId?.note || 'This asset matched a supported SynthID watermark verification flow.',
      };
    }

    if (synthStatus === 'manual_verification_required') {
      return {
        label: 'Manual SynthID check',
        actionText: 'Manual SynthID Review Required',
        helpText: item?.synthId?.note || 'This image was eligible for provenance review, but the current Node pipeline does not run automatic SynthID verification.',
      };
    }

    if (synthStatus === 'unsupported_image_format') {
      return {
        label: 'SynthID unsupported format',
        actionText: 'SynthID Unsupported Format',
        helpText: item?.synthId?.note || 'This image format is not wired into the current SynthID review flow.',
      };
    }

    if (synthStatus === 'not_applicable' || synthStatus === 'not_supported') {
      return {
        label: 'SynthID not applicable',
        actionText: 'SynthID Not Applicable',
        helpText: item?.synthId?.note || 'SynthID verification is only relevant for supported image assets.',
      };
    }

    return {
      label: 'Provenance',
      actionText: 'Provenance Review',
      helpText: item?.synthId?.note || 'No SynthID verification state was recorded for this asset.',
    };
  };

  const getVerificationLabel = (item) => {
    const provenanceStatus = item?.provenance?.status;

    if (provenanceStatus === 'verified') {
      return 'Provenance verified';
    }

    if (provenanceStatus === 'manual_review_required') {
      return 'Provenance review';
    }

    return getSynthStatusProfile(item).label;
  };

  const getVerificationActionText = (item) => {
    const provenanceStatus = item?.provenance?.status;

    if (provenanceStatus === 'verified') {
      return 'Upload Provenance Verified';
    }

    if (provenanceStatus === 'manual_review_required') {
      return 'Upload Provenance Review Required';
    }

    return getSynthStatusProfile(item).actionText;
  };

  const getVerificationHelpText = (item) => {
    const provenanceStatus = item?.provenance?.status;
    const provenanceNote = item?.provenance?.note;

    if (provenanceStatus === 'verified') {
      return provenanceNote || 'This upload was verified against Cloud Storage object integrity metadata.';
    }

    if (provenanceStatus === 'manual_review_required') {
      return provenanceNote || 'This upload needs manual provenance review because the storage integrity signature could not be confirmed automatically.';
    }

    return getSynthStatusProfile(item).helpText;
  };

  const getAuditStatusTone = (status) => {
    if (status === 'failed') {
      return 'border-red-500 bg-red-500/20 text-red-400';
    }

    if (status === 'warning') {
      return 'border-amber-500 bg-amber-500/20 text-amber-300';
    }

    if (status === 'pending') {
      return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
    }

    return 'border-green-500/50 bg-green-500/10 text-green-500';
  };

  const getAuditStatusTextTone = (status) => {
    if (status === 'failed') {
      return 'text-red-400';
    }

    if (status === 'warning') {
      return 'text-amber-300';
    }

    if (status === 'pending') {
      return 'text-amber-400';
    }

    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Media Library</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage and monitor all your uploaded digital assets.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-pulse" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Vertex AI semantic search (e.g. 'ufc', 'goal', 'fight', 'dunk')..." 
              className="w-full pl-9 pr-3 py-2 border border-indigo-500/30 rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 text-sm shadow-[0_0_15px_rgba(99,102,241,0.15)] placeholder:text-indigo-500/50"
            />
          </div>
          <button 
            onClick={handleGlobalScan} 
            disabled={isScanning} 
            className="flex items-center gap-2 px-4 py-2 border border-red-500/30 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.15)] disabled:opacity-50"
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <GlobeLock className="w-4 h-4" />}
            <span className="hidden sm:inline">{isScanning ? "Scanning Web..." : "Run Security Scan"}</span>
          </button>
        </div>
      </div>
      {scanStatus && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            scanStatus.type === 'error'
              ? 'border-red-500/30 bg-red-500/10 text-red-300'
              : scanStatus.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200'
          }`}
        >
          {scanStatus.text}
        </div>
      )}
      {searchQuery.trim() && (
        <div className="text-xs text-[var(--text-secondary)]">
          {isSearching
            ? 'Searching the library with Vertex AI...'
            : `Vertex AI search returned ${displayData.length} match${displayData.length === 1 ? '' : 'es'}.`}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-[var(--text-secondary)]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
          Loading secure media...
        </div>
      ) : mediaData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)] border-2 border-dashed border-[var(--border)] rounded-xl bg-[var(--surface)]">
          <ShieldAlert className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium text-[var(--text-primary)]">No verified media found</p>
          <p className="text-sm mt-1">Upload assets to securely view them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {displayData.map((item) => (
            <div 
              key={item.id} 
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="relative h-48 bg-gray-800">
                {item.type === 'Video' ? (
                  <video
                    src={item.downloadURL || item.downloadUrl || item.bucketPath}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    muted loop
                    onMouseOver={(e) => e.target.play()}
                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                ) : (
                  <img
                    src={item.downloadURL || item.downloadUrl || item.thumbnail || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop'}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop'; }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-500 border border-indigo-400 text-white shadow-lg uppercase tracking-wide">
                      <Fingerprint className="w-3 h-3" />
                      {getVerificationLabel(item)}
                      {item.authenticityScore ? ` (${item.authenticityScore})` : ''}
                    </span>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <h3 className="font-semibold text-[var(--text-primary)] truncate" title={item.title}>
                  {item.title}
                </h3>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {new Date(item.uploadDate).toLocaleDateString()}
                    </span>
                    {item.status === 'Protected' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                        <ShieldCheck className="w-3 h-3" />
                        Protected
                      </span>
                    ) : item.status === 'Violation' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                        <ShieldAlert className="w-3 h-3 animate-pulse" />
                        Violation
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                        Safe
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}

      {selectedMedia && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[60] transition-all">
          <div className="w-full max-w-md bg-[var(--surface)] h-full border-l border-[var(--border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{selectedMedia.title}</h3>
                <p className="text-sm text-indigo-400 mt-1 flex items-center gap-1">
                  <Fingerprint className="w-4 h-4" /> Vertex AI provenance record
                </p>
                <p className="text-xs font-mono text-[var(--text-secondary)] mt-1 break-all">
                  ID: {selectedMedia.assetFingerprint || selectedMedia.synthIdSignature || selectedMedia.id}
                </p>
              </div>
              <button onClick={() => setSelectedMedia(null)} className="text-[var(--text-secondary)] hover:text-white transition-colors bg-[var(--background)] p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="aspect-video rounded-lg overflow-hidden bg-black mb-6 border border-[var(--border)]">
                {selectedMedia.type === 'Video' ? (
                  <video
                    src={selectedMedia.downloadURL || selectedMedia.downloadUrl}
                    className="w-full h-full object-contain"
                    controls autoPlay
                  />
                ) : (
                  <img
                    src={selectedMedia.downloadURL || selectedMedia.downloadUrl || selectedMedia.thumbnail || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop'}
                    className="w-full h-full object-contain"
                    alt={selectedMedia.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop'; }}
                  />
                )}
              </div>

              {/* AI Analysis Summary */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[var(--background)] rounded-lg p-3 border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Authenticity Score</p>
                  <p className={`text-2xl font-bold ${selectedMedia.authenticityScore >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedMedia.authenticityScore ?? 'N/A'}<span className="text-sm font-normal text-[var(--text-secondary)]">/100</span>
                  </p>
                </div>
                <div className="bg-[var(--background)] rounded-lg p-3 border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Protection Status</p>
                  <p className={`text-sm font-bold mt-1 ${selectedMedia.status === 'Protected' ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedMedia.status === 'Protected' ? '🛡️ Protected' : '⚠️ Violation'}
                  </p>
                </div>
              </div>

              {/* Content Description */}
              {selectedMedia.contentDescription && (
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 mb-6">
                  <p className="text-xs text-indigo-400 font-semibold mb-1 flex items-center gap-1"><Star className="w-3 h-3" /> Gemini AI Analysis</p>
                  <p className="text-sm text-[var(--text-primary)]">{selectedMedia.contentDescription}</p>
                </div>
              )}

              {/* Semantic Tags */}
              {selectedMedia.semanticTags && selectedMedia.semanticTags.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-[var(--text-secondary)] font-semibold mb-2 flex items-center gap-1"><Tag className="w-3 h-3" /> AI Semantic Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedia.semanticTags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <h4 className="font-semibold text-[var(--text-primary)] mb-4">Metadata Audit Trail</h4>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-[var(--border)] before:to-transparent">
                
                {selectedMedia.auditTrail ? selectedMedia.auditTrail.map((log, idx) => (
                  <div key={idx} className="relative flex items-center justify-between group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border shadow shrink-0 z-10 ${getAuditStatusTone(log.status)}`}>
                      {idx === 0 ? <UploadCloud className="w-5 h-5" /> : idx === 1 ? <Fingerprint className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div className="w-[calc(100%-3rem)] p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-[var(--text-primary)] text-sm">{log.step}</div>
                        <time className="font-medium text-[10px] text-[var(--text-secondary)] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                        </time>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {log.signature && <div>ID: <span className="font-mono text-[10px] bg-white/5 p-1 rounded text-indigo-300">{log.signature}</span></div>}
                        {log.details && <div className="mt-1">{log.details}</div>}
                        Status: <span className={`uppercase tracking-widest text-[10px] ml-1 ${getAuditStatusTextTone(log.status)}`}>{log.status}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-[var(--text-secondary)] text-sm">No recent audit logs found in Firestore.</div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)]">
              <div className="space-y-3">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {getVerificationActionText(selectedMedia)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {getVerificationHelpText(selectedMedia)}
                  </p>
                </div>
                <button
                  onClick={handleDeleteMedia}
                  disabled={isDeleting || !functions}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isDeleting ? 'Deleting Media...' : 'Delete Media'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
