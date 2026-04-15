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
              <p className="text-sm font-medium text-[var(--text-secondary)]">Total Media Uploaded</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">1,248</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
              <FileVideo className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-500 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            12% from last month
          </div>
        </div>

        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Violations Detected</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">342</h3>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-500 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            8% from last month
          </div>
        </div>

        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Active Monitoring</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">98.5%</h3>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
              <UploadCloud className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-[var(--text-secondary)]">
            Across 15 platforms
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
    </div>
  );
}
