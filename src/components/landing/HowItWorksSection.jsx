import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Fingerprint, Network, Radar, ScanSearch, ShieldAlert } from 'lucide-react';

const techLayers = [
  {
    icon: Fingerprint,
    title: 'Multi-layer fingerprinting',
    description:
      'Each asset receives perceptual hashes, feature descriptors, video frame signatures, and metadata-backed ownership records.',
  },
  {
    icon: Radar,
    title: 'AI embeddings',
    description:
      'Embedding-based similarity search identifies duplicate and near-duplicate content even after semantic or visual modification.',
  },
  {
    icon: ShieldAlert,
    title: 'Tamper analysis',
    description:
      'The tamper intelligence engine scores crop, meme overlays, resizing, contrast shifts, compression, and anomaly signals.',
  },
  {
    icon: ScanSearch,
    title: 'Reverse search',
    description:
      'Once a suspicious match appears, reverse search finds related uploads, potential sources, and redistributed variants.',
  },
];

const spreadNodes = [
  { name: 'Source Upload', cls: 'left-[10%] top-[42%]' },
  { name: 'Meme Edit', cls: 'left-[36%] top-[18%]' },
  { name: 'Fan Page', cls: 'left-[38%] top-[68%]' },
  { name: 'Aggregator', cls: 'right-[18%] top-[26%]' },
  { name: 'Repost Cluster', cls: 'right-[14%] bottom-[18%]' },
];

export default function HowItWorksSection() {
  const tamperRef = useRef(null);
  const [tamperStats, setTamperStats] = useState({
    score: 0,
    crop: 0,
    meme: 0,
    compression: 0,
  });

  useEffect(() => {
    const node = tamperRef.current;
    if (!node) return undefined;

    let started = false;
    let rafId = 0;

    const targets = {
      score: 78,
      crop: 31,
      meme: 24,
      compression: 23,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            const start = performance.now();
            const duration = 1500;

            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);

              setTamperStats({
                score: Math.floor(targets.score * eased),
                crop: Math.floor(targets.crop * eased),
                meme: Math.floor(targets.meme * eased),
                compression: Math.floor(targets.compression * eased),
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
    <section className="mx-auto mt-14 w-full max-w-6xl landing-perspective" id="how-it-works" data-reveal>
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] px-6 py-8 shadow-[0_28px_110px_rgba(6,10,30,0.75)] backdrop-blur-2xl landing-panel-3d lg:px-8 lg:py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(59,130,246,0.14),transparent_22%),radial-gradient(circle_at_84%_22%,rgba(168,85,247,0.12),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.14),rgba(2,6,23,0.38))]" />
          <div className="absolute left-[-5rem] top-8 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-[-4rem] bottom-8 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-200 backdrop-blur-xl">
              <Network className="h-3.5 w-3.5 text-blue-300" />
              How it works
            </div>

            <h2 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Deep technical signals that reflect the actual system design.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              The stack combines multi-layer fingerprinting, AI embeddings, tamper intelligence,
              reverse search, and propagation mapping to protect sports media in near real time.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {techLayers.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl landing-tilt-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
            <div
              className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl landing-tilt-card"
              ref={tamperRef}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Tamper analysis</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Tamper score</h3>
                </div>
                <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
                  High modification
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-[#101425]/85 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-5xl font-semibold text-white">{tamperStats.score}%</div>
                    <div className="mt-2 text-sm text-slate-400">
                      Tamper Score: {tamperStats.score}% (Meme + Crop detected)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                    Confidence high
                  </div>
                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(250,204,21,0.95),rgba(249,115,22,0.95),rgba(244,63,94,0.95))] shadow-[0_0_24px_rgba(249,115,22,0.35)] transition-[width] duration-700"
                    style={{ width: `${tamperStats.score}%` }}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Crop', `${tamperStats.crop}%`],
                    ['Meme overlay', `${tamperStats.meme}%`],
                    ['Compression shift', `${tamperStats.compression}%`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3"
                    >
                      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
                      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl landing-tilt-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Propagation tracking</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Graph of content spreading</h3>
                </div>
                <div className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                  Reverse search active
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-[#101425]/85 p-4">
                <div className="relative h-72 overflow-hidden rounded-[1.2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.16),transparent_44%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))]">
                  <div className="absolute left-[16%] top-[49%] h-px w-[23%] rotate-[-20deg] bg-gradient-to-r from-cyan-300/90 to-transparent landing-scan" />
                  <div className="absolute left-[18%] top-[48%] h-px w-[22%] rotate-[22deg] bg-gradient-to-r from-blue-300/90 to-transparent landing-scan" />
                  <div className="absolute left-[41%] top-[26%] h-px w-[27%] rotate-[8deg] bg-gradient-to-r from-violet-300/90 to-transparent landing-scan" />
                  <div className="absolute left-[42%] top-[65%] h-px w-[26%] rotate-[-10deg] bg-gradient-to-r from-indigo-300/90 to-transparent landing-scan" />

                  {spreadNodes.map((node, index) => (
                    <div key={node.name} className={`absolute ${node.cls}`}>
                      <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-slate-200 backdrop-blur-xl shadow-[0_0_18px_rgba(59,130,246,0.14)]">
                        {node.name}
                      </div>
                      <div
                        className={`mx-auto mt-2 h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_16px_rgba(96,165,250,0.8)] ${
                          index % 2 === 0 ? 'landing-pulse' : 'landing-pulse-delayed'
                        }`}
                      />
                    </div>
                  ))}

                  <div className="absolute left-[43%] top-[44%]">
                    <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200 backdrop-blur-xl">
                      Origin asset
                    </div>
                    <div className="mx-auto mt-2 h-4 w-4 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.9)] landing-pulse" />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  'Fingerprint match triggers reverse search across detected sources.',
                  'Related reposts are clustered using similarity and tamper signals.',
                  'Propagation graph helps prioritize alerts, reports, and enforcement order.',
                ].map((line) => (
                  <div
                    key={line}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#111327]/70 px-4 py-3"
                  >
                    <span className="text-sm text-slate-200">{line}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
