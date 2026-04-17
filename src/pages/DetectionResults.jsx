import { ExternalLink, ShieldAlert, CheckCircle, BarChart, AlertTriangle, Fingerprint } from 'lucide-react';

const resultsData = [
  { id: 101, sourceVideo: 'Formula 1 Lap 1 Crash', matchUrl: 'youtube.com/watch?v=dummy1', platform: 'YouTube', confidence: 98, date: '2026-04-14', status: 'Pending Takedown' },
  { id: 102, sourceVideo: 'Formula 1 Lap 1 Crash', matchUrl: 'twitter.com/user/status/dummy2', platform: 'Twitter', confidence: 95, date: '2026-04-14', status: 'Removed' },
  { id: 103, sourceVideo: 'NBA Top 10 Dunks', matchUrl: 'tiktok.com/@sportsfan/video/dummy3', platform: 'TikTok', confidence: 87, date: '2026-04-13', status: 'Reviewing' },
  { id: 104, sourceVideo: 'NBA Top 10 Dunks', matchUrl: 'facebook.com/watch/?v=dummy4', platform: 'Facebook', confidence: 92, date: '2026-04-13', status: 'Pending Takedown' },
  { id: 105, sourceVideo: 'UFC Main Event Knockout', matchUrl: 'instagram.com/p/dummy5', platform: 'Instagram', confidence: 99, date: '2026-04-12', status: 'Removed' },
];

export default function DetectionResults() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Detection Results</h1>
          <p className="text-sm text-[var(--text-secondary)]">Review AI-matched potential copyright violations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Active Infringements</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">142</p>
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Successfully Removed</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">856</p>
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center">
            <BarChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Avg. Match Confidence</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">94.2%</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Source Media</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Match URL</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Platform</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Confidence</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {resultsData.map((result) => (
                <tr key={result.id} className="hover:bg-[var(--background)]/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">
                    <div className="flex flex-col gap-1">
                      <span>{result.sourceVideo}</span>
                      <span className="flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded w-max border border-indigo-500/20">
                        <Fingerprint className="w-3 h-3" /> SynthID Verified
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)] flex items-center gap-2">
                    {result.matchUrl}
                    <ExternalLink className="w-3 h-3 text-indigo-400 cursor-pointer hover:text-indigo-500" />
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{result.platform}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[var(--background)] rounded-full">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                      </div>
                      <span className="text-[var(--text-secondary)]">{result.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {result.status === 'Removed' ? (
                      <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">Removed</span>
                    ) : result.status === 'Reviewing' ? (
                      <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Reviewing
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">Pending Takedown</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button className="text-indigo-500 hover:text-indigo-400 font-medium text-sm">
                      Issue Takedown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
