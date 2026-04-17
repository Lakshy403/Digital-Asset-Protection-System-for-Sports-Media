import { ArrowRight, FileUp, Fingerprint, Radar, ShieldCheck } from 'lucide-react';

const steps = [
  {
    icon: FileUp,
    label: 'Step 01',
    title: 'Upload media',
    description: 'Upload sports images or videos through the web interface with owner, timestamp, and context metadata.',
  },
  {
    icon: Fingerprint,
    label: 'Step 02',
    title: 'AI fingerprints it',
    description: 'Generate perceptual hashes, feature descriptors, and AI embeddings for resilient ownership verification.',
  },
  {
    icon: Radar,
    label: 'Step 03',
    title: 'Detect and track misuse',
    description: 'Flag suspicious matches, track propagation, and push results to the analytics dashboard and alert layer.',
  },
];

const pipeline = ['Upload', 'AI Fingerprint', 'Detection', 'Dashboard'];

export default function SolutionSection() {
  return (
    <section className="mx-auto mt-14 w-full max-w-6xl landing-perspective" id="solution" data-reveal>
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] px-6 py-8 shadow-[0_28px_110px_rgba(6,10,30,0.72)] backdrop-blur-2xl landing-panel-3d lg:px-8 lg:py-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.14),transparent_24%),radial-gradient(circle_at_82%_25%,rgba(99,102,241,0.12),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.12),rgba(2,6,23,0.36))]" />
          <div className="absolute left-[-4rem] bottom-8 h-36 w-36 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute right-[-4rem] top-8 h-36 w-36 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-200 backdrop-blur-xl">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
              The solution
            </div>

            <h2 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Understand the core idea in five seconds.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              DAPS turns digital asset protection into a simple flow: upload media, generate fingerprints,
              detect unauthorized or manipulated usage, and review live results in one dashboard.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map(({ icon: Icon, label, title, description }) => (
              <article
                key={title}
                className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5 backdrop-blur-xl landing-tilt-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-100">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                  {label}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,32,0.88),rgba(8,10,24,0.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] landing-tilt-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Animated pipeline</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Upload → AI Fingerprint → Detection → Dashboard</h3>
              </div>
              <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300 md:block">
                Live flow
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5 landing-tilt-card">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
                  {pipeline.map((item, index) => (
                    <div key={item} className="contents">
                      <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.05] px-4 py-4 text-center backdrop-blur-xl">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">0{index + 1}</div>
                        <div className="mt-2 text-sm font-semibold text-white">{item}</div>
                      </div>
                      {index < pipeline.length - 1 ? (
                        <div className="hidden md:flex md:items-center md:justify-center">
                          <div className="relative flex h-px w-16 items-center bg-gradient-to-r from-blue-400/70 to-indigo-400/30">
                            <span className="absolute right-0 h-2.5 w-2.5 rounded-full bg-blue-300 landing-pipeline-dot" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-5 landing-tilt-card">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">What happens</p>
                <div className="mt-4 space-y-3">
                  {[
                    'Media is stored and validated in the cloud.',
                    'AI builds fingerprint signatures and embeddings.',
                    'Unauthorized or modified matches are detected.',
                    'Dashboard alerts and analytics are updated instantly.',
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
      </div>
    </section>
  );
}
