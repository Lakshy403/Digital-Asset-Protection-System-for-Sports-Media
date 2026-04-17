import { useState } from 'react';
import { Search, Filter, ShieldCheck, ShieldAlert, Play, Fingerprint, Clock, X } from 'lucide-react';

const mediaData = [
  { id: 1, title: 'UEFA CL Final Highlights', date: '2026-04-12', status: 'Safe', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: 'Formula 1 Lap 1 Crash', date: '2026-04-10', status: 'Violation', duration: '03:20', thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=400&q=80' },
  { id: 3, title: 'Wimbledon Final Set', date: '2026-04-09', status: 'Safe', duration: '45:10', thumbnail: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=400&q=80' },
  { id: 4, title: 'Super Bowl Interception', date: '2026-04-08', status: 'Safe', duration: '01:15', thumbnail: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80' },
  { id: 5, title: 'NBA Top 10 Dunks', date: '2026-04-05', status: 'Violation', duration: '08:30', thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80' },
  { id: 6, title: 'UFC Main Event Knockout', date: '2026-04-01', status: 'Violation', duration: '02:45', thumbnail: 'https://images.unsplash.com/photo-1542856204-0010166ed130?auto=format&fit=crop&w=400&q=80' }
];

export default function MediaLibrary() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Media Library</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage and monitor all your uploaded digital assets.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search media..." 
              className="w-full pl-9 pr-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--background)] transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaData.map((item) => (
          <div 
            key={item.id} 
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
            onClick={() => setSelectedMedia(item)}
          >
            <div className="relative h-48 bg-gray-800">
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors">
                  <Play className="w-5 h-5 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                {item.duration}
              </div>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <h3 className="font-semibold text-[var(--text-primary)] truncate" title={item.title}>
                {item.title}
              </h3>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                    <Fingerprint className="w-3 h-3" />
                    SynthID Verified
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--text-secondary)]">Uploaded: {item.date}</span>
                  {item.status === 'Safe' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                      <ShieldCheck className="w-3 h-3" />
                      Safe
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500">
                      <ShieldAlert className="w-3 h-3" />
                      Violation
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedMedia && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50 transition-all">
            <div className="w-full max-w-md bg-[var(--surface)] h-full border-l border-[var(--border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{selectedMedia.title}</h3>
                  <p className="text-sm text-indigo-400 mt-1 flex items-center gap-1">
                    <Fingerprint className="w-4 h-4" /> Cryptographically Signed Asset
                  </p>
                </div>
                <button onClick={() => setSelectedMedia(null)} className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <div className="aspect-video rounded-lg overflow-hidden bg-black mb-6">
                  <img src={selectedMedia.thumbnail} className="w-full h-full object-cover" alt="" />
                </div>

                <h4 className="font-semibold text-[var(--text-primary)] mb-4">Metadata Audit Trail</h4>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border)] before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-500 bg-indigo-500/20 text-indigo-500 shadow shrink-0">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-[var(--text-primary)] text-sm">SynthID Injected</div>
                        <time className="font-medium text-xs text-[var(--text-secondary)] flex items-center gap-1"><Clock className="w-3 h-3" /> 12:00 PM</time>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">Invisible watermark applied successfully via Vertex AI. ID: <span className="font-mono text-[10px] bg-white/5 p-1 rounded text-indigo-300">#SY-99482X</span></div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] shadow shrink-0">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-[var(--text-primary)] text-sm">Deepfake Scan</div>
                        <time className="font-medium text-xs text-[var(--text-secondary)] flex items-center gap-1"><Clock className="w-3 h-3" /> 12:01 PM</time>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">Clean. No generative AI artifacts detected.</div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] shadow shrink-0">
                      <Search className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-[var(--text-primary)] text-sm">BigQuery Logged</div>
                        <time className="font-medium text-xs text-[var(--text-secondary)] flex items-center gap-1"><Clock className="w-3 h-3" /> 12:02 PM</time>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">Metadata registered to global ledger. Ready for Media CDN distribution.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[var(--border)]">
                <button className="w-full py-3 px-4 bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-primary)] rounded-lg font-medium transition-colors">
                  Download Encrypted Package
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
