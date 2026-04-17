import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const platformData = [
  { name: 'YouTube', value: 450 },
  { name: 'Twitter', value: 300 },
  { name: 'TikTok', value: 200 },
  { name: 'Facebook', value: 150 },
  { name: 'Instagram', value: 100 },
];
const COLORS = ['#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ec4899'];

const trendData = [
  { month: 'Jan', takedowns: 120, violations: 150 },
  { month: 'Feb', takedowns: 132, violations: 180 },
  { month: 'Mar', takedowns: 201, violations: 210 },
  { month: 'Apr', takedowns: 278, violations: 300 },
  { month: 'May', takedowns: 189, violations: 200 },
  { month: 'Jun', takedowns: 239, violations: 250 },
];

const regionData = [
  { name: 'North America', value: 45 },
  { name: 'Europe', value: 30 },
  { name: 'Asia Pacific', value: 15 },
  { name: 'Latin America', value: 10 },
];

const confidenceData = [
  { time: '00:00', score: 98 },
  { time: '04:00', score: 96 },
  { time: '08:00', score: 92 },
  { time: '12:00', score: 99 },
  { time: '16:00', score: 95 },
  { time: '20:00', score: 88 },
  { time: '24:00', score: 97 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Deep dive into violation trends and enforcement metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] lg:col-span-2">
          <h3 className="font-semibold text-[var(--text-primary)] mb-6">Piracy Takedowns vs. Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend />
                <Bar dataKey="violations" fill="#ef4444" name="Violations Found" radius={[4, 4, 0, 0]} />
                <Bar dataKey="takedowns" fill="#10b981" name="Successful Takedowns" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text-primary)] mb-6">Content Reach by Region</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text-primary)] mb-6">AI Confidence Levels (Vertex AI)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={confidenceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-secondary)" />
                <YAxis domain={[70, 100]} stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Confidence %" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
