import { AlertTriangle, Globe, ShieldAlert, TimerReset } from 'lucide-react';

const problemCards = [
  {
    icon: Globe,
    eyebrow: 'Fragmented visibility',
    title: 'Unauthorized sports media usage spreads across platforms before organizations can see it.',
    description:
      'Owned images and videos are reposted, trimmed, mirrored, and redistributed across channels without one unified monitoring layer.',
  },
  {
    icon: TimerReset,
    eyebrow: 'Slow response',
    title: 'Manual review is too slow for real-time protection and violation response.',
    description:
      'By the time analysts collect evidence, high-value sports content may already be spreading through fan pages, edits, and aggregator accounts.',
  },
  {
    icon: ShieldAlert,
    eyebrow: 'Missing verification',
    title: 'Ownership proof, tamper evidence, and spread history are often disconnected.',
    description:
      'Teams bounce between dashboards, reports, screenshots, and inboxes instead of working from one trusted dashboard with timestamped metadata.',
  },
];

const problemStats = [
  { value: 'Too late', label: 'for unauthorized use detection' },
  { value: 'Too scattered', label: 'for ownership verification evidence' },
  { value: 'Too manual', label: 'for real-time analytics and alerts' },
];

export default function ProblemSection() {
  return (
    <section className="mx-auto mt-14 w-full max-w-6xl landing-perspective" id="problem" data-reveal>
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] px-6 py-8 shadow-[0_28px_100px_rgba(6,10,30,0.72)] backdrop-blur-2xl landing-panel-3d lg:px-8 lg:py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(96,165,250,0.12),transparent_26%),radial-gradient(circle_at_82%_30%,rgba(244,63,94,0.10),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.18),rgba(2,6,23,0.32))]" />
          <div className="absolute left-[-6rem] top-8 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute right-[-4rem] bottom-6 h-36 w-36 rounded-full bg-rose-400/10 blur-3xl" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-200 backdrop-blur-xl">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-300" />
              The problem
            </div>

            <h2 className="mt-6 max-w-lg text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Digital sports media protection breaks down when uploads, proof, detection, and tracking live in separate places.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Sports organizations need a web platform that can verify ownership, detect manipulated duplicates,
              monitor propagation, and surface alerts in one place. Without that, response stays delayed and fragmented.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {problemStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl landing-tilt-card"
                >
                  <div className="text-lg font-semibold text-white">{item.value}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {problemCards.map(({ icon: Icon, eyebrow, title, description }, index) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl transition duration-300 hover:border-white/16 hover:bg-white/[0.08] landing-tilt-card"
              >
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/14 to-transparent" />
                <div className="absolute right-4 top-4 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-600">
                  0{index + 1}
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-100 shadow-[0_0_22px_rgba(148,163,184,0.08)]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                      {eyebrow}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold leading-8 text-white">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
