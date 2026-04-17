import { User, Bell, Shield, Moon, Zap, Key } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)]">Manage your account preferences and notification settings.</p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            Profile Information
          </h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Display Name</label>
              <input type="text" defaultValue="Admin User" className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] rounded-lg text-[var(--text-primary)] focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Email Address</label>
              <input type="email" defaultValue="admin@daps.io" className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] rounded-lg text-[var(--text-primary)] focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-indigo-500" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Critical Violation Alerts</p>
                <p className="text-sm text-[var(--text-secondary)]">Receive immediate email for high-confidence matches.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Weekly Summary Reports</p>
                <p className="text-sm text-[var(--text-secondary)]">Get a digest of reporting and takedown activities.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-indigo-500" />
            Enforcement & Takedowns
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Auto-Takedown via Cloud Functions</p>
                <p className="text-sm text-[var(--text-secondary)]">Automatically issue DMCA notices for 99%+ confidence matches.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--background)] border border-[var(--border)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-indigo-500" />
            API & Security
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Firebase App Check Token (Stat-Feed Protection)</label>
              <div className="flex gap-2">
                <input type="password" defaultValue="************************" className="w-full px-4 py-2 border border-[var(--border)] bg-[var(--background)] rounded-lg text-[var(--text-primary)] focus:ring-1 focus:ring-indigo-500 focus:outline-none" disabled />
                <button className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--background)] transition-colors">Regenerate</button>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2">Active. Protects scoring endpoints from unauthorized access.</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-6">
            <Moon className="w-5 h-5 text-indigo-500" />
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--text-primary)]">Dark Mode</p>
              <p className="text-sm text-[var(--text-secondary)]">Toggle application theme (Note: dark mode is required & locked right now).</p>
            </div>
            <label className="relative inline-flex items-center cursor-not-allowed opacity-50">
              <input type="checkbox" className="sr-only peer" disabled checked />
              <div className="w-11 h-6 bg-indigo-600 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 mt-6">
        <button className="px-6 py-2 border border-[var(--border)] rounded-lg text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );
}
