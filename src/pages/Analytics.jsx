import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Deep dive into violation trends and enforcement metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Line Chart */}
        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text-primary)] mb-6">Violations vs Takedowns Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="violations" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Violations Found" />
                <Line type="monotone" dataKey="takedowns" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Successful Takedowns" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold text-[var(--text-primary)] mb-6">Violations by Platform</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
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
      </div>
    </div>
  );
}
