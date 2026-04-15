import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Zap, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col pointer-events-auto">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-500 font-bold text-2xl">
          <Shield className="w-8 h-8" />
          <span>DAPS</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Log in
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
          <span>Phase 1 Prototype Live</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight max-w-4xl leading-tight mb-8">
          Protect Your Sports Media <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            With Advanced AI
          </span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mb-12">
          The ultimate digital asset protection system designed for sports broadcasters and media agencies. Detect copyright violations, monitor usage, and secure your content seamlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link to="/register" className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-indigo-500/25">
            Start Securing Media
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link to="/dashboard" className="flex items-center justify-center w-full px-8 py-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--background)] rounded-xl font-semibold transition-all">
            View Dashboard
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Continuous Monitoring</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              24/7 scanning of social platforms and video-sharing sites for unauthorized usage of your sports clips.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">AI-Powered Detection</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              High-accuracy video fingerprinting and matching algorithms to identify modified or cropped content.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Instant Take-Downs</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Automate DMCA notices and enforcement actions directly from your secure dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
