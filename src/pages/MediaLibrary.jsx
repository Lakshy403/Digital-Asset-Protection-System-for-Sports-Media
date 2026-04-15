import { Search, Filter, ShieldCheck, ShieldAlert, Play } from 'lucide-react';

const mediaData = [
  { id: 1, title: 'UEFA CL Final Highlights', date: '2026-04-12', status: 'Safe', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: 'Formula 1 Lap 1 Crash', date: '2026-04-10', status: 'Violation', duration: '03:20', thumbnail: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=400&q=80' },
  { id: 3, title: 'Wimbledon Final Set', date: '2026-04-09', status: 'Safe', duration: '45:10', thumbnail: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=400&q=80' },
  { id: 4, title: 'Super Bowl Interception', date: '2026-04-08', status: 'Safe', duration: '01:15', thumbnail: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=400&q=80' },
  { id: 5, title: 'NBA Top 10 Dunks', date: '2026-04-05', status: 'Violation', duration: '08:30', thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80' },
  { id: 6, title: 'UFC Main Event Knockout', date: '2026-04-01', status: 'Violation', duration: '02:45', thumbnail: 'https://images.unsplash.com/photo-1542856204-0010166ed130?auto=format&fit=crop&w=400&q=80' }
];

export default function MediaLibrary() {
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
          <div key={item.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-lg transition-all group">
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
              <div className="flex items-center justify-between mt-auto">
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
    </div>
  );
}
