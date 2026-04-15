import { Bell, AlertTriangle, Info, Clock } from 'lucide-react';

const alertsData = [
  { id: 1, type: 'critical', title: 'High-profile Violation Detected', message: 'Formula 1 Lap 1 Crash found on YouTube with 10k+ views.', time: '10 mins ago', date: 'Today' },
  { id: 2, type: 'warning', title: 'API Rate Limit Warning', message: 'TikTok matching API approaching rate limits (85% used).', time: '1 hour ago', date: 'Today' },
  { id: 3, type: 'info', title: 'Takedown Successful', message: 'Twitter takedown request #9122 completed successfully.', time: '3 hours ago', date: 'Today' },
  { id: 4, type: 'critical', title: 'New Match Threshold Met', message: 'NBA Finals Highlights segment found across 5 new domains.', time: 'Yesterday', date: '14 Apr 2026' },
  { id: 5, type: 'info', title: 'System Update', message: 'Matching engine updated to v2.4 seamlessly.', time: 'Yesterday', date: '14 Apr 2026' },
];

export default function Alerts() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Alerts & Notifications</h1>
          <p className="text-sm text-[var(--text-secondary)]">Stay updated on system activities and critical violations.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--background)] transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {alertsData.map((alert) => (
          <div key={alert.id} className="flex gap-4 p-4 border border-[var(--border)] bg-[var(--surface)] rounded-xl hover:shadow-md transition-shadow">
            <div className="shrink-0 mt-1">
              {alert.type === 'critical' && <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><Bell className="w-5 h-5" /></div>}
              {alert.type === 'warning' && <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500"><AlertTriangle className="w-5 h-5" /></div>}
              {alert.type === 'info' && <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><Info className="w-5 h-5" /></div>}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-[var(--text-primary)]">{alert.title}</h3>
                <div className="flex items-center text-xs text-[var(--text-secondary)] gap-1">
                  <Clock className="w-3 h-3" />
                  {alert.time}
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{alert.message}</p>
              <p className="text-xs text-[var(--text-secondary)]/50 mt-3">{alert.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
