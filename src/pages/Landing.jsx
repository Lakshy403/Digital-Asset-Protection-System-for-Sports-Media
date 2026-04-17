import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FooterSection from '../components/landing/FooterSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import {
  ArrowRight,
  Bell,
  ChevronRight,
  FileVideo,
  Lock,
  Play,
  Shield,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';

const signalBars = [38, 52, 48, 66, 58, 84, 72, 91, 76, 64, 70, 87];

const featureCards = [
  {
    icon: FileVideo,
    title: 'Ingest protected media',
    description: 'Upload sports images and videos with metadata, owner context, and timestamped asset records.',
  },
  {
    icon: Shield,
    title: 'Verify ownership at scale',
    description: 'Attach multi-layer fingerprint signatures for ownership verification and structural matching.',
  },
  {
    icon: Bell,
    title: 'Trigger real-time alerts',
    description: 'Move from suspicious match to dashboard alert, analyst review, and enforcement workflow.',
  },
];

export default function Landing() {
  const platformStatsRef = useRef(null);
  const [animatedStats, setAnimatedStats] = useState({
    uploads: 0,
    violations: 0,
    severity: 0,
  });

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-reveal-delay') || '0';
            entry.target.style.setProperty('--reveal-delay', delay);
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = platformStatsRef.current;
    if (!node) return undefined;

    let started = false;
    let rafId = 0;

    const targets = {
      uploads: 1284,
      violations: 214,
      severity: 92,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const duration = 1600;

            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);

              setAnimatedStats({
                uploads: Math.floor(targets.uploads * eased),
                violations: Math.floor(targets.violations * eased),
                severity: Math.floor(targets.severity * eased),
              });

              if (progress < 1) {
                rafId = requestAnimationFrame(tick);
              }
            };

            rafId = requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070311] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(79,70,229,0.26),transparent_28%),radial-gradient(circle_at_18%_34%,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_82%_26%,rgba(59,130,246,0.18),transparent_24%),linear-gradient(180deg,#11071f_0%,#090414_50%,#05020b_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:92px_92px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
        <div className="absolute left-1/2 top-16 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[130px] landing-float" />
        <div className="absolute left-[-8%] top-[18%] h-[26rem] w-[34rem] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.16),transparent)] blur-3xl opacity-70 landing-pan" />
        <div className="absolute right-[-10%] top-[24%] h-[20rem] w-[30rem] -rotate-12 bg-[linear-gradient(90deg,transparent,rgba(129,140,248,0.18),transparent)] blur-3xl opacity-60 landing-pan-reverse" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.16),transparent_58%)]" />
        <div className="absolute inset-x-[12%] top-[12%] h-[28rem] rounded-[999px] border border-white/6 landing-orbit-shell" />
        <div className="absolute left-[14%] top-[22%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.85)] landing-orbit-dot" />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute left-0 top-28 h-px w-[26%] overflow-hidden bg-gradient-to-r from-transparent via-white/12 to-transparent">
          <div className="h-full w-24 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent landing-line-flow-right" />
        </div>
        <div className="absolute right-0 top-28 h-px w-[26%] overflow-hidden bg-gradient-to-l from-transparent via-white/12 to-transparent">
          <div className="h-full w-24 bg-gradient-to-l from-transparent via-indigo-300/80 to-transparent landing-line-flow-left" />
        </div>
        <div className="absolute left-[11%] top-28 h-34 w-34 rounded-tl-[3rem] border-l border-t border-white/8" />
        <div className="absolute right-[11%] top-28 h-34 w-34 rounded-tr-[3rem] border-r border-t border-white/8" />
        <div className="absolute left-0 bottom-24 h-40 w-40 overflow-hidden rounded-br-[3rem] border-r border-b border-white/8">
          <div className="absolute bottom-6 right-0 h-16 w-px bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent landing-line-flow-down" />
          <div className="absolute bottom-0 right-6 h-px w-16 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent landing-line-flow-right" />
        </div>
        <div className="absolute right-0 bottom-28 h-40 w-40 overflow-hidden rounded-bl-[3rem] border-l border-b border-white/8">
          <div className="absolute bottom-6 left-0 h-16 w-px bg-gradient-to-b from-transparent via-indigo-300/70 to-transparent landing-line-flow-down" />
          <div className="absolute bottom-0 left-6 h-px w-16 bg-gradient-to-l from-transparent via-indigo-300/70 to-transparent landing-line-flow-left" />
        </div>
      </div>

      <nav
        className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7"
        data-reveal
      >
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-[0_0_24px_rgba(59,130,246,0.36)]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">DAPS</p>
            <p className="text-xs text-slate-400">for Sports Media</p>
          </div>
        </div>

        <div className="hidden items-center gap-8 rounded-full border border-white/8 bg-white/[0.03] px-7 py-4 text-sm text-slate-300 backdrop-blur-xl lg:flex">
          <a href="#platform" className="transition hover:text-white">
            Platform
          </a>
          <a href="#problem" className="transition hover:text-white">
            Problem
          </a>
          <a href="#solution" className="transition hover:text-white">
            Solution
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            Tech
          </a>
          <a href="#signals" className="transition hover:text-white">
            Signals
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:bg-white/[0.12]"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] transition hover:scale-[1.02] sm:inline-flex"
          >
            Get started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-18 pt-10">
        <section className="mx-auto flex max-w-5xl flex-col items-center text-center landing-perspective">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-200 backdrop-blur-xl shadow-[0_8px_30px_rgba(17,24,39,0.35)]"
            data-reveal
          >
            <Zap className="h-3.5 w-3.5 text-blue-300" />
            End-to-end sports media protection
          </div>

          <div
            className="mt-7 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 shadow-[0_0_30px_rgba(255,255,255,0.08)] backdrop-blur-xl landing-hero-badge"
            data-reveal
            data-reveal-delay="1"
          >
            <Waves className="h-5 w-5" />
          </div>

          <h1
            className="mt-7 max-w-4xl text-4xl font-semibold leading-[1] tracking-tight text-white sm:text-5xl lg:text-[4.8rem]"
            data-reveal
            data-reveal-delay="2"
          >
            Protect the integrity
            <br />
            of digital sports media
            <br />
            assets
          </h1>

          <p
            className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
            data-reveal
            data-reveal-delay="3"
          >
            A web-based platform for sports organizations to upload media, generate AI-powered
            fingerprints, detect unauthorized use, track propagation, and receive real-time analytics.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row" data-reveal data-reveal-delay="4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-7 py-4 text-base font-semibold text-white shadow-[0_14px_40px_rgba(59,130,246,0.38)] transition hover:-translate-y-0.5"
            >
              Start protection
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-base font-medium text-slate-100 backdrop-blur-xl transition hover:bg-white/[0.1]"
            >
              <Play className="h-4 w-4" />
              Live platform preview
            </Link>
          </div>

          <div
            className="mt-8 flex items-center justify-center"
            data-reveal
            data-reveal-delay="4"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-blue-300/30 bg-[linear-gradient(180deg,rgba(96,165,250,0.42),rgba(37,99,235,0.28))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_40px_rgba(59,130,246,0.28)] backdrop-blur-xl sm:h-18 sm:w-18 lg:h-20 lg:w-20 landing-hero-badge">
              <div className="h-[72%] w-[72%] rounded-[1rem] border border-white/20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),rgba(255,255,255,0.02)_65%)]" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3" data-reveal data-reveal-delay="5">
            <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl landing-chip-3d">
              Ownership verification
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl landing-chip-3d">
              AI duplicate detection
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl landing-chip-3d">
              Real-time alerts and analytics
            </div>
          </div>
        </section>

        <section
          id="platform"
          className="mx-auto mt-14 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_30px_120px_rgba(8,15,40,0.72)] backdrop-blur-2xl landing-panel-3d landing-perspective"
          data-reveal
          ref={platformStatsRef}
        >
          <div className="border-b border-white/8 bg-white/[0.04] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-300/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                  DAPS Command Console
                </span>
              </div>
              <div className="text-xs text-slate-500">Live rights telemetry</div>
            </div>
          </div>

          <div className="grid gap-0 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="relative border-b border-white/8 p-6 xl:border-b-0 xl:border-r">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.14),transparent_40%)]" />

              <div className="relative">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Analytics dashboard
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                      Violations, uploads, and spread trends
                    </h2>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Near real-time
                  </div>
                </div>

                <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_16rem]">
                    <div className="rounded-[1.75rem] border border-white/10 bg-[#0f1023]/80 p-5 landing-tilt-card">
                    <div className="flex h-56 items-end gap-2">
                      {signalBars.map((bar, index) => (
                        <div key={index} className="flex flex-1 flex-col justify-end">
                          <div
                            className="rounded-t-[0.9rem] bg-[linear-gradient(180deg,rgba(147,197,253,0.95),rgba(79,70,229,0.88))] shadow-[0_0_22px_rgba(96,165,250,0.28)]"
                            style={{ height: `${bar}%`, minHeight: '2rem' }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
                      <span>Violation detection trend</span>
                      <span>Updated within seconds</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl landing-tilt-card">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Total uploads
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        {animatedStats.uploads.toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm text-slate-400">Protected assets in cloud storage</p>
                    </div>

                    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl landing-tilt-card">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Violations detected
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        {animatedStats.violations.toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm text-slate-400">Flagged matches requiring review</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {featureCards.map(({ icon: Icon, title, description }) => (
                    <article
                      key={title}
                      className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] p-4 text-left backdrop-blur-xl landing-tilt-card"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-200">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-slate-100">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div id="signals" className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl landing-tilt-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                      Alert system
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      Unauthorized use detected
                    </p>
                  </div>
                  <div className="rounded-2xl border border-blue-300/20 bg-blue-400/10 p-3 text-blue-200">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 flex items-end justify-between rounded-[1.4rem] border border-white/8 bg-[#111327]/80 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Alert severity
                    </p>
                    <p className="mt-2 text-4xl font-semibold text-white">{animatedStats.severity}%</p>
                  </div>
                  <div className="rounded-full bg-rose-400/10 px-3 py-1 text-xs text-rose-300">
                    Critical
                  </div>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl landing-tilt-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                      Propagation map
                    </p>
                    <p className="mt-2 text-base text-slate-200">Track where content appears over time</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                    24/7
                  </div>
                </div>
                <div className="mt-5 rounded-[1.4rem] border border-white/8 bg-[#101224]/85 p-4">
                  <div className="relative h-44 overflow-hidden rounded-[1.1rem] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.95))]">
                    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/25" />
                    <div className="absolute left-[18%] top-[24%] h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_16px_rgba(96,165,250,0.8)] landing-pulse" />
                    <div className="absolute right-[16%] top-[28%] h-3 w-3 rounded-full bg-violet-300 shadow-[0_0_16px_rgba(196,181,253,0.8)] landing-pulse-delayed" />
                    <div className="absolute bottom-[20%] left-[24%] h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.8)] landing-pulse" />
                    <div className="absolute bottom-[18%] right-[22%] h-3 w-3 rounded-full bg-indigo-300 shadow-[0_0_16px_rgba(165,180,252,0.8)] landing-pulse-delayed" />
                    <div className="absolute left-[21%] top-[27%] h-px w-[32%] rotate-[20deg] bg-gradient-to-r from-blue-300/80 to-transparent landing-scan" />
                    <div className="absolute right-[20%] top-[30%] h-px w-[28%] -rotate-[20deg] bg-gradient-to-l from-violet-300/80 to-transparent landing-scan" />
                    <div className="absolute bottom-[23%] left-[28%] h-px w-[23%] -rotate-[32deg] bg-gradient-to-r from-cyan-300/80 to-transparent landing-scan" />
                    <div className="absolute bottom-[22%] right-[26%] h-px w-[20%] rotate-[32deg] bg-gradient-to-l from-indigo-300/80 to-transparent landing-scan" />
                  </div>
                </div>
              </div>

              <div
                id="response"
                className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl landing-tilt-card"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Processing workflow
                </p>
                <div className="mt-5 space-y-3">
                  {['Upload to cloud storage', 'Run AI verification', 'Generate dashboard alerts'].map((step) => (
                    <div
                      key={step}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#111327]/70 px-4 py-3"
                    >
                      <span className="text-sm text-slate-200">{step}</span>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-300">
                  <Lock className="h-4 w-4" />
                  Audit logging and access control enabled
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FooterSection />
      </main>
    </div>
  );
}
