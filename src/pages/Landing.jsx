import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Zap, ChevronRight, UploadCloud, BarChart2 } from 'lucide-react';

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
          End-to-End Digital Asset <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Protection & Integrity
          </span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mb-12">
          The ultimate system designed for sports broadcasters. Detect copyright violations, watermark content, and secure distribution via Google Cloud.
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

        {/* Features Grid - The Three Pillars */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12">The Three Pillars of Integrity</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Verification (SynthID)</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Inject imperceptible digital watermarks and cryptographic signatures to guarantee asset origin and authenticity.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Distribution (Media CDN)</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Securely stream and distribute your protected assets globally with low latency using Google Cloud Media CDN.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Monitoring (BigQuery)</h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Analyze violation events, track engagement, and aggregate piracy metrics using real-time BigQuery streams.
              </p>
            </div>
          </div>
        </div>

        {/* System Architecture Section */}
        <div className="mt-32 w-full max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-12">System Architecture</h2>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Box 1 */}
              <div className="flex-1 bg-[var(--background)] p-6 rounded-xl border border-[var(--border)] text-center relative z-10 w-full">
                <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">Ingest</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Cloud Storage & Vertex AI</p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block w-8 h-0.5 bg-indigo-500/30 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-dashed border-4 border-transparent border-l-indigo-500/30"></div>
              </div>

              {/* Box 2 */}
              <div className="flex-1 bg-indigo-500/5 p-6 rounded-xl border border-indigo-500/20 text-center relative z-10 w-full">
                <div className="w-12 h-12 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-indigo-400">SynthID Verification</h4>
                <p className="text-xs text-indigo-400/70 mt-1">Watermarking & Metadata</p>
              </div>

              {/* Arrow */}
              <div className="hidden md:block w-8 h-0.5 bg-indigo-500/30 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-dashed border-4 border-transparent border-l-indigo-500/30"></div>
              </div>

              {/* Box 3 */}
              <div className="flex-1 bg-[var(--background)] p-6 rounded-xl border border-[var(--border)] text-center relative z-10 w-full">
                <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500 mb-3">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">Distribution & Analytics</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Media CDN & BigQuery</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
