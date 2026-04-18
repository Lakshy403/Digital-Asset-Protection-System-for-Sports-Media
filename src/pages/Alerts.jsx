import { useEffect, useMemo, useState } from 'react';
import { Bell, AlertTriangle, Info, Clock, Loader2 } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db, functions } from '../firebase';

function createAlertFromViolation(violation) {
  return {
    id: `violation-${violation.id}`,
    type: violation.status === 'Removed' ? 'info' : 'critical',
    title: violation.status === 'Removed' ? 'Violation Closed' : 'Open Violation Detected',
    message: violation.summary || `Potential unauthorized distribution detected for ${violation.title || 'an asset'}.`,
    timestamp: violation.createdAt || null,
    dateLabel: violation.createdAt ? new Date(violation.createdAt).toLocaleDateString() : 'Unknown date',
  };
}

function createAlertFromScan(scan, index) {
  return {
    id: `scan-${index}-${scan.completedAt || scan.startedAt || 'unknown'}`,
    type: scan.status === 'failed' ? 'warning' : 'info',
    title: scan.status === 'failed' ? 'Security Scan Failed' : 'Security Scan Completed',
    message: scan.summary || 'A backend security scan updated its status.',
    timestamp: scan.completedAt || scan.startedAt || null,
    dateLabel: scan.completedAt || scan.startedAt ? new Date(scan.completedAt || scan.startedAt).toLocaleDateString() : 'Unknown date',
  };
}

export default function Alerts() {
  const [violations, setViolations] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) {
      return undefined;
    }

    const violationsQuery = query(collection(db, 'violations'));
    const scansQuery = query(collection(db, 'securityScans'));

    const unsubscribeViolations = onSnapshot(violationsQuery, (snapshot) => {
      setViolations(snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })));
      setLoading(false);
    }, (error) => {
      console.error('Error loading alert violations:', error);
      setLoading(false);
    });

    const unsubscribeScans = onSnapshot(scansQuery, (snapshot) => {
      setScans(snapshot.docs.map((item) => item.data()));
    });

    return () => {
      unsubscribeViolations();
      unsubscribeScans();
    };
  }, []);

  const alertsData = useMemo(() => {
    const violationAlerts = violations.map(createAlertFromViolation);
    const scanAlerts = scans.map(createAlertFromScan);

    return [...violationAlerts, ...scanAlerts]
      .sort((left, right) => new Date(right.timestamp || 0) - new Date(left.timestamp || 0))
      .slice(0, 20);
  }, [violations, scans]);

  const handleMarkAllAsRead = async () => {
    if (!functions) {
      return;
    }

    const removableViolations = violations.filter((item) => item.status !== 'Removed');
    const updateViolationStatus = httpsCallable(functions, 'updateViolationStatus');
    await Promise.all(removableViolations.map((violation) => updateViolationStatus({
      violationId: violation.id,
      status: 'Removed',
    })));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Alerts & Notifications</h1>
          <p className="text-sm text-[var(--text-secondary)]">Recent live activity from violation records and security scans.</p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--background)] transition-colors"
        >
          Mark open violations as removed
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-[var(--text-secondary)]">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
          Loading live alerts...
        </div>
      ) : (
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
                    {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown time'}
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{alert.message}</p>
                <p className="text-xs text-[var(--text-secondary)]/50 mt-3">{alert.dateLabel}</p>
              </div>
            </div>
          ))}
          {alertsData.length === 0 && (
            <div className="p-8 border border-[var(--border)] bg-[var(--surface)] rounded-xl text-center text-[var(--text-secondary)]">
              No live alerts yet. Run a security scan or upload media to generate activity.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
