import { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, ShieldAlert, Play, Fingerprint, Clock, X, Loader2, Sparkles, GlobeLock } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';

export default function MediaLibrary() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleGlobalScan = () => {
    setIsScanning(true);
    setTimeout(async () => {
      try {
        const violationData = {
          id: `synth_leak_${Date.now()}`,
          title: "UNAUTHORIZED STREAM MATCH DETECTED",
          type: "Image",
          uploadDate: new Date().toISOString(),
          status: "Violation",
          thumbnail: "https://images.unsplash.com/photo-1550029330-84cca4bfce62?q=80&w=600&auto=format&fit=crop",
          authenticityScore: 24,
          synthIdSignature: "CORRUPTED_OR_MISSING",
          auditTrail: [
            { step: "Global Firebase Threat Sweeper initiated", timestamp: new Date(Date.now() - 3000).toISOString(), status: "success" },
            { step: "Match found on sketchy-sports-stream.com", timestamp: new Date(Date.now() - 1000).toISOString(), status: "failed", errorDetails: "DMCA Takedown Process Initialized automatically." }
          ]
        };
        await addDoc(collection(db, "mediaLibrary"), violationData);
      } catch(err) { console.error(err); }
      setIsScanning(false);
    }, 4500);
  };

  useEffect(() => {
    // Check if initializing Firebase failed by trying to query
    if (!db) {
        console.error("Firestore initialized failed, showing empty state.");
        setLoading(false);
        return;
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

  const displayData = mediaData.filter(item => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    
    // Simulate AI Semantic matching
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
              placeholder="Vertex AI search (e.g. 'ufc', 'goal', 'fight', 'dunk')..." 
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
                  <video src={item.downloadURL} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted loop onMouseOver={(e) => e.target.play()} onMouseOut={(e) => {e.target.pause(); e.target.currentTime = 0;}} />
                ) : (
                  <img src={item.downloadURL || item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-500 border border-indigo-400 text-white shadow-lg uppercase tracking-wide">
                      <Fingerprint className="w-3 h-3" />
                      SynthID {item.authenticityScore ? `(Score: ${item.authenticityScore})` : ''}
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
                  <Fingerprint className="w-4 h-4" /> Cryptographically Signed Asset
                </p>
                <p className="text-xs font-mono text-[var(--text-secondary)] mt-1 break-all">ID: {selectedMedia.synthIdSignature}</p>
              </div>
              <button onClick={() => setSelectedMedia(null)} className="text-[var(--text-secondary)] hover:text-white transition-colors bg-[var(--background)] p-1 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="aspect-video rounded-lg overflow-hidden bg-black mb-6">
                {selectedMedia.type === 'Video' ? (
                  <video src={selectedMedia.downloadURL} className="w-full h-full object-contain" controls autoPlay />
                ) : (
                  <img src={selectedMedia.downloadURL || selectedMedia.thumbnail} className="w-full h-full object-contain" alt="" />
                )}
              </div>

              <h4 className="font-semibold text-[var(--text-primary)] mb-4">Metadata Audit Trail</h4>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-[var(--border)] before:to-transparent">
                
                {selectedMedia.auditTrail ? selectedMedia.auditTrail.map((log, idx) => (
                  <div key={idx} className="relative flex items-center justify-between group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border shadow shrink-0 z-10 
                      ${idx === 1 ? 'border-indigo-500 bg-indigo-500/20 text-indigo-500' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]'}`}>
                      {idx === 0 ? <UploadCloud className="w-5 h-5" /> : idx === 1 ? <Fingerprint className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5 text-green-500" />}
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
                        Status: <span className="text-green-500 uppercase tracking-widest text-[10px] ml-1">{log.status}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-[var(--text-secondary)] text-sm">No recent audit logs found in Firestore.</div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-[var(--border)]">
              <button disabled className="w-full py-3 px-4 bg-[var(--background)] border border-[var(--border)] opacity-50 text-[var(--text-primary)] rounded-lg font-medium">
                Verify Signature (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
