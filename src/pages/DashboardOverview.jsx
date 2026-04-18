import { useEffect, useMemo, useState } from 'react';
import { UploadCloud, FileVideo, ShieldAlert, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildSevenDayViolationTrend(violations) {
  const today = new Date();
  const buckets = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - offset);

    buckets.push({
      dateKey: date.toISOString().slice(0, 10),
      name: DAY_LABELS[date.getDay()],
      violations: 0,
    });
  }

  const bucketMap = new Map(buckets.map((item) => [item.dateKey, item]));

  violations.forEach((violation) => {
    const createdAt = violation?.createdAt ? new Date(violation.createdAt) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) {
      return;
    }

    const key = createdAt.toISOString().slice(0, 10);
    const bucket = bucketMap.get(key);
    if (bucket) {
      bucket.violations += 1;
    }
  });

  return buckets.map((item) => ({
    name: item.name,
    violations: item.violations,
  }));
}

export default function DashboardOverview() {
  const [mediaAssets, setMediaAssets] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) {
      return undefined;
    }

    const mediaQuery = query(collection(db, 'mediaLibrary'));
    const violationsQuery = query(collection(db, 'violations'));

    const unsubscribeMedia = onSnapshot(mediaQuery, (snapshot) => {
      setMediaAssets(snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })));
      setLoading(false);
    }, (error) => {
      console.error('Error loading media library overview data:', error);
      setLoading(false);
    });

    const unsubscribeViolations = onSnapshot(violationsQuery, (snapshot) => {
      setViolations(snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })));
    });

    return () => {
      unsubscribeMedia();
      unsubscribeViolations();
    };
  }, []);

  const metrics = useMemo(() => {
    const totalAssets = mediaAssets.length;
    const openViolations = violations.filter((item) => item.status !== 'Removed').length;

    const scores = mediaAssets
      .map((item) => Number(item.authenticityScore))
      .filter((value) => Number.isFinite(value));
    const averageAuthenticity = scores.length ?
      (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1) :
      '0.0';

    const protectedCount = mediaAssets.filter((item) => item.status === 'Protected').length;
    const syncedLabel = totalAssets ?
      `${protectedCount} currently marked Protected` :
      'Waiting for uploads';

    return {
      totalAssets,
      openViolations,
      averageAuthenticity,
      syncedLabel,
    };
  }, [mediaAssets, violations]);

  const trendData = useMemo(() => buildSevenDayViolationTrend(violations), [violations]);

  const regionSummary = useMemo(() => {
    const totalMatches = violations.reduce((sum, item) => {
      const evidence = Array.isArray(item.evidence) ? item.evidence : [];
      return sum + evidence.reduce((evidenceSum, entry) => {
        const matches = entry?.matches;
        if (Array.isArray(matches)) {
          return evidenceSum + matches.length;
        }
        if (Array.isArray(matches?.pages)) {
          return evidenceSum + matches.pages.length;
        }
        return evidenceSum;
      }, 0);
    }, 0);

    return totalMatches;
  }, [violations]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard Overview</h1>
          <p className="text-sm text-[var(--text-secondary)]">Live summary from media uploads, provenance checks, and backend security scans.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-[var(--text-secondary)]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
          Loading live dashboard data...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Total Assets In Library</p>
                  <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">{metrics.totalAssets.toLocaleString()}</h3>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                  <FileVideo className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-400 font-medium bg-blue-500/10 px-2.5 py-1 rounded-md w-max">
                {metrics.syncedLabel}
              </div>
            </div>

            <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Open Violation Cases</p>
                  <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">{metrics.openViolations.toLocaleString()}</h3>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                  <ShieldAlert className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-red-400 font-medium bg-red-500/10 px-2.5 py-1 rounded-md w-max">
                Backed by Firestore violation records
              </div>
            </div>

            <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Avg. Authenticity Score</p>
                  <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">{metrics.averageAuthenticity}%</h3>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                  <UploadCloud className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-400 font-medium bg-green-500/10 px-2.5 py-1 rounded-md w-max">
                Computed from stored Vertex AI analyses
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Violation Trends (Last 7 Days)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis allowDecimals={false} stroke="var(--text-secondary)" />
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

          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">External Match Activity</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">This is a live summary of external evidence gathered by security scans, not a simulated CDN map.</p>

            <div className="relative w-full h-80 bg-[#1e293b] rounded-xl overflow-hidden border border-[var(--border)]">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_4px_rgba(59,130,246,0.5)] animate-pulse" />
              <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_4px_rgba(99,102,241,0.5)] animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_4px_rgba(6,182,212,0.5)] animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_4px_rgba(99,102,241,0.5)] animate-pulse" style={{ animationDelay: '1.5s' }} />
              <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_4px_rgba(59,130,246,0.5)] animate-pulse" style={{ animationDelay: '0.2s' }} />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium">
                  External evidence points recorded: {regionSummary}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
