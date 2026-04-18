import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Loader2 } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

const COLORS = ['#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ec4899', '#ef4444'];

function monthKeyFromDate(dateLike) {
  const date = new Date(dateLike || 0);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function monthLabel(dateLike) {
  const date = new Date(dateLike || 0);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleString([], { month: 'short' });
}

function buildMonthlyTrend(mediaAssets, violations) {
  const buckets = new Map();

  mediaAssets.forEach((asset) => {
    const key = monthKeyFromDate(asset?.uploadDate);
    if (!key) {
      return;
    }

    if (!buckets.has(key)) {
      buckets.set(key, {
        month: monthLabel(asset.uploadDate),
        uploads: 0,
        violations: 0,
        takedowns: 0,
      });
    }

    buckets.get(key).uploads += 1;
  });

  violations.forEach((violation) => {
    const key = monthKeyFromDate(violation?.createdAt);
    if (!key) {
      return;
    }

    if (!buckets.has(key)) {
      buckets.set(key, {
        month: monthLabel(violation.createdAt),
        uploads: 0,
        violations: 0,
        takedowns: 0,
      });
    }

    const bucket = buckets.get(key);
    bucket.violations += 1;
    if (violation?.status === 'Removed') {
      bucket.takedowns += 1;
    }
  });

  return [...buckets.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .slice(-6)
    .map(([, value]) => value);
}

function buildPlatformDistribution(violations) {
  const counts = new Map();

  violations.forEach((violation) => {
    const evidence = Array.isArray(violation.evidence) ? violation.evidence : [];

    evidence.forEach((entry) => {
      const provider = entry?.provider || 'unknown';
      const matches = entry?.matches;

      if (provider === 'youtube_search' && Array.isArray(matches)) {
        counts.set('YouTube', (counts.get('YouTube') || 0) + matches.length);
        return;
      }

      if (provider === 'vision_web_detection') {
        const pageCount = Array.isArray(matches?.pages) ? matches.pages.length : 0;
        const imageCount = Array.isArray(matches?.fullMatchingImages) ? matches.fullMatchingImages.length : 0;
        counts.set('Web', (counts.get('Web') || 0) + pageCount + imageCount);
        return;
      }

      counts.set(provider.replace(/_/g, ' '), (counts.get(provider.replace(/_/g, ' ')) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);
}

function buildAssetTypeDistribution(mediaAssets) {
  const counts = new Map();

  mediaAssets.forEach((asset) => {
    const key = asset?.type || 'Unknown';
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return [...counts.entries()].map(([name, value]) => ({ name, value }));
}

function buildConfidenceSeries(mediaAssets) {
  return mediaAssets
    .filter((asset) => Number.isFinite(Number(asset?.authenticityScore)))
    .sort((left, right) => new Date(left.uploadDate || 0) - new Date(right.uploadDate || 0))
    .slice(-8)
    .map((asset, index) => ({
      label: asset?.title ? asset.title.slice(0, 14) : `Asset ${index + 1}`,
      score: Number(asset.authenticityScore),
    }));
}

export default function Analytics() {
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
      console.error('Error loading analytics media data:', error);
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

  const trendData = useMemo(() => buildMonthlyTrend(mediaAssets, violations), [mediaAssets, violations]);
  const platformData = useMemo(() => buildPlatformDistribution(violations), [violations]);
  const regionData = useMemo(() => buildAssetTypeDistribution(mediaAssets), [mediaAssets]);
  const confidenceData = useMemo(() => buildConfidenceSeries(mediaAssets), [mediaAssets]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Live trends derived from uploaded assets and backend security scans.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-[var(--text-secondary)]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
          Loading live analytics...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] lg:col-span-2">
            <h3 className="font-semibold text-[var(--text-primary)] mb-6">Uploads, Violations, and Takedowns</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis allowDecimals={false} stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Legend />
                  <Bar dataKey="uploads" fill="#3b82f6" name="Uploads" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="violations" fill="#ef4444" name="Violations Found" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="takedowns" fill="#10b981" name="Marked Removed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text-primary)] mb-6">Evidence Source Mix</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <h3 className="font-semibold text-[var(--text-primary)] mb-6">Asset Type Distribution</h3>
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
                      <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
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

          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] lg:col-span-2">
            <h3 className="font-semibold text-[var(--text-primary)] mb-6">Recent Authenticity Scores</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={confidenceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--text-secondary)" />
                  <YAxis domain={[0, 100]} stroke="var(--text-secondary)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0.5rem' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Authenticity %" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
