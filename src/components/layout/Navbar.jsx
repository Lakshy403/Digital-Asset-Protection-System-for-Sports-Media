import { Bell, Search, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--surface)] border-b border-[var(--border)] shrink-0">
      <div className="flex items-center flex-1">
        <div className="hidden sm:flex items-center gap-2 text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider">Vertex AI Cloud Active</span>
        </div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--background)]">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--surface)]"></span>
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)] cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-[var(--text-primary)] hidden md:block">
            Admin User
          </span>
        </div>
      </div>
    </header>
  );
}
