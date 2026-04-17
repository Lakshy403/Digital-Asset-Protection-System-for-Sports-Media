import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield, Sparkles } from 'lucide-react';

const footerLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'How It Works', href: '#how-it-works' },
];

export default function FooterSection() {
  return (
    <footer className="mx-auto mt-14 w-full max-w-6xl pb-10 landing-perspective" data-reveal>
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-6 py-7 shadow-[0_24px_90px_rgba(6,10,30,0.72)] backdrop-blur-2xl landing-panel-3d lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,rgba(59,130,246,0.12),transparent_24%),radial-gradient(circle_at_84%_22%,rgba(129,140,248,0.10),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.12),rgba(2,6,23,0.32))]" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-[0_0_24px_rgba(59,130,246,0.34)]">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-100">DAPS</p>
                <p className="text-sm text-slate-400">Digital Asset Protection System for Sports Media</p>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
              Built as a cloud-native web platform to help sports organizations upload media, verify ownership,
              detect unauthorized usage, monitor propagation, and review real-time analytics and alerts.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-300 backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              GCP-ready media intelligence
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Explore</p>
              <div className="mt-4 flex flex-col gap-3">
                {footerLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                  >
                    {item.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Get Started</p>
              <div className="mt-4 flex flex-col gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5"
                >
                  Create account
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:bg-white/[0.08]"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-3 border-t border-white/8 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 DAPS. Digital Asset Protection for sports media integrity.</span>
          <span>Fingerprinting · tamper intelligence · propagation mapping · analytics</span>
        </div>
      </div>
    </footer>
  );
}
