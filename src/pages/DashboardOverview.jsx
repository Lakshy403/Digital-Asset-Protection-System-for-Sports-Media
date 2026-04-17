import { UploadCloud, FileVideo, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', violations: 4 },
  { name: 'Tue', violations: 3 },
  { name: 'Wed', violations: 7 },
  { name: 'Thu', violations: 5 },
  { name: 'Fri', violations: 12 },
  { name: 'Sat', violations: 8 },
  { name: 'Sun', violations: 10 },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard Overview</h1>
          <p className="text-sm text-[var(--text-secondary)]">Welcome back! Here's what's happening with your digital assets.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Total Assets Protected</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">1,248</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
              <FileVideo className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-400 font-medium bg-blue-500/10 px-2.5 py-1 rounded-md w-max">
            Synced via Cloud Storage
          </div>
        </div>

        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Real-time Piracy Hits</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">342</h3>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-400 font-medium bg-red-500/10 px-2.5 py-1 rounded-md w-max">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Simulating BigQuery streams
          </div>
        </div>

        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Authenticity Score</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">98.5%</h3>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
              <UploadCloud className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-400 font-medium bg-green-500/10 px-2.5 py-1 rounded-md w-max">
            Global avg. (Vertex AI checks)
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Violation Trends (Last 7 Days)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Area type="monotone" dataKey="violations" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViolations)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Global Distribution Map Placeholder */}
      <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Global Distribution Points</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">Real-time content delivery via Google Cloud Media CDN Edge locations.</p>
        
        <div className="relative w-full h-80 bg-[#1e293b] rounded-xl overflow-hidden border border-[var(--border)]">
          {/* Faux map background dots */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          {/* Faux glowing edge nodes */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_4px_rgba(59,130,246,0.5)] animate-pulse"></div>
          <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_4px_rgba(99,102,241,0.5)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_4px_rgba(6,182,212,0.5)] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_4px_rgba(99,102,241,0.5)] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_4px_rgba(59,130,246,0.5)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium">
              Live Edge Network Status: Healthy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
