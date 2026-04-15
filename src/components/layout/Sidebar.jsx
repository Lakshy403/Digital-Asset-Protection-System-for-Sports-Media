import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, Library, ShieldAlert, Bell, BarChart2, Settings, Shield } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Media', path: '/dashboard/upload', icon: Upload },
  { name: 'Media Library', path: '/dashboard/library', icon: Library },
  { name: 'Detection Results', path: '/dashboard/results', icon: ShieldAlert },
  { name: 'Alerts', path: '/dashboard/alerts', icon: Bell },
  { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart2 },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-[var(--sidebar)] border-r border-[var(--border)]">
      <div className="flex items-center justify-center h-16 border-b border-[var(--border)] shrink-0">
        <Link to="/" className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
          <Shield className="w-8 h-8" />
          <span>DAPS</span>
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  'flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-primary)]'
                )}
              >
                <Icon
                  className={clsx(
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                    isActive ? 'text-indigo-400' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 mt-auto border-t border-[var(--border)]">
          <Link
            to="/dashboard/settings"
            className={clsx(
              'flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group',
              location.pathname === '/dashboard/settings'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-primary)]'
            )}
          >
            <Settings className={clsx(
              "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
              location.pathname === '/dashboard/settings' ? 'text-indigo-400' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
            )} />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
