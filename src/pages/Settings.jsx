import { useEffect, useState } from 'react';
import { Bell, Key, Moon, Shield, User, Zap } from 'lucide-react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const defaultPreferences = {
  criticalAlerts: true,
  weeklySummaryReports: true,
  autoTakedown: false,
  darkMode: true,
};

function formatDate(value) {
  if (!value) {
    return 'Unavailable';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getProviderLabel(currentUser) {
  const providerId = currentUser?.providerData?.[0]?.providerId;

  switch (providerId) {
    case 'password':
      return 'Email and password';
    case 'google.com':
      return 'Google';
    default:
      return providerId || 'Unknown';
  }
}

function ToggleRow({ title, description, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="font-medium text-[var(--text-primary)]">{title}</p>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
      <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className="w-11 h-6 bg-[var(--background)] border border-[var(--border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
      </label>
    </div>
  );
}

export default function Settings() {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [savedPreferences, setSavedPreferences] = useState(defaultPreferences);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setDisplayName(currentUser?.displayName || '');
  }, [currentUser]);

  useEffect(() => {
    if (!db || !currentUser?.uid) {
      setPreferences(defaultPreferences);
      setSavedPreferences(defaultPreferences);
      setIsLoadingSettings(false);
      return undefined;
    }

    const settingsRef = doc(db, 'userSettings', currentUser.uid);
    const unsubscribe = onSnapshot(
      settingsRef,
      (snapshot) => {
        const data = snapshot.data();
        const nextPreferences = {
          criticalAlerts: data?.criticalAlerts ?? defaultPreferences.criticalAlerts,
          weeklySummaryReports: data?.weeklySummaryReports ?? defaultPreferences.weeklySummaryReports,
          autoTakedown: data?.autoTakedown ?? defaultPreferences.autoTakedown,
          darkMode: data?.darkMode ?? defaultPreferences.darkMode,
        };

        setPreferences(nextPreferences);
        setSavedPreferences(nextPreferences);
        setIsLoadingSettings(false);
      },
      () => {
        setError('Unable to load settings from Firestore right now.');
        setIsLoadingSettings(false);
      },
    );

    return unsubscribe;
  }, [currentUser?.uid]);

  const handleToggle = (key) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const handleCancel = () => {
    setDisplayName(currentUser?.displayName || '');
    setPreferences(savedPreferences);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError('You need to be signed in to save settings.');
      return;
    }

    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const trimmedDisplayName = displayName.trim();

      if (trimmedDisplayName !== (currentUser.displayName || '')) {
        await updateProfile(currentUser, {
          displayName: trimmedDisplayName,
        });
      }

      if (!db) {
        throw new Error('Firestore is not initialized.');
      }

      await setDoc(
        doc(db, 'userSettings', currentUser.uid),
        {
          ...preferences,
          email: currentUser.email || null,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setSavedPreferences(preferences);
      setSuccess('Settings saved successfully.');
    } catch (saveError) {
      setError(saveError?.message || 'Unable to save settings right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)]">Manage your account preferences with live Firebase-backed data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Account Created</p>
          <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{formatDate(currentUser?.metadata?.creationTime)}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Last Sign In</p>
          <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{formatDate(currentUser?.metadata?.lastSignInTime)}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Auth Provider</p>
          <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{getProviderLabel(currentUser)}</p>
        </div>
      </div>

      {(error || success) ? (
        <div className={`rounded-xl border px-4 py-3 text-sm ${error ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-green-500/30 bg-green-500/10 text-green-300'}`}>
          {error || success}
        </div>
      ) : null}

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            Profile Information
          </h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] rounded-lg text-[var(--text-primary)] focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                placeholder="Set your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email Address</label>
              <input
                type="email"
                value={currentUser?.email || ''}
                className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] rounded-lg text-[var(--text-primary)] opacity-70"
                disabled
              />
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Email changes require re-authentication, so this field is shown as read-only.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-indigo-500" />
            Notifications
          </h3>
          <div className="space-y-4">
            <ToggleRow
              title="Critical Violation Alerts"
              description="Receive immediate alerts for high-confidence matches."
              checked={preferences.criticalAlerts}
              onChange={() => handleToggle('criticalAlerts')}
              disabled={isLoadingSettings}
            />
            <ToggleRow
              title="Weekly Summary Reports"
              description="Keep a digest of reporting and takedown activity in your saved preferences."
              checked={preferences.weeklySummaryReports}
              onChange={() => handleToggle('weeklySummaryReports')}
              disabled={isLoadingSettings}
            />
          </div>
        </div>

        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-indigo-500" />
            Enforcement & Takedowns
          </h3>
          <div className="space-y-4">
            <ToggleRow
              title="Auto-Takedown via Cloud Functions"
              description="Store your preferred default for automatic enforcement on very high confidence matches."
              checked={preferences.autoTakedown}
              onChange={() => handleToggle('autoTakedown')}
              disabled={isLoadingSettings}
            />
          </div>
        </div>

        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-indigo-500" />
            API & Security
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">User ID</p>
              <p className="mt-2 break-all text-sm font-medium text-[var(--text-primary)]">{currentUser?.uid || 'Unavailable'}</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">Email Verification</p>
              <p className={`mt-2 text-sm font-medium ${currentUser?.emailVerified ? 'text-green-400' : 'text-yellow-300'}`}>
                {currentUser?.emailVerified ? 'Verified' : 'Not verified'}
              </p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">Firebase Project</p>
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">guardian-sport-ai</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--text-secondary)]">Settings Sync</p>
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                {db ? 'Firestore active' : 'Firestore unavailable'}
              </p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-4">
            Security values on this screen are drawn from the signed-in Firebase user session and your Firestore-backed preferences document.
          </p>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <Moon className="w-5 h-5 text-indigo-500" />
            Appearance
          </h3>
          <ToggleRow
            title="Dark Mode"
            description="Dark mode is still the required app theme, so this reflects the locked live setting."
            checked={preferences.darkMode}
            onChange={() => {}}
            disabled
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-[var(--border)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isLoadingSettings}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-500 mt-0.5" />
          <div>
            <p className="font-medium text-[var(--text-primary)]">Live backend data</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              This page now reads real account metadata from Firebase Authentication and stores preferences in Firestore under <code className="text-[var(--text-primary)]">userSettings/{currentUser?.uid || 'uid'}</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
