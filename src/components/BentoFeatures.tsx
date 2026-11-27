export default function BentoFeatures() {
  return (
    <section className="bg-bgDark2 mb-16 flex w-full justify-center pt-16 lg:mb-32">
      <div className="content-container">
        <div className="fade-in">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Top left - Real-time pipeline (2 cols) */}
            <div className="card group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl p-8 lg:col-span-2">
              <div className="relative mb-8 flex flex-1 items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                  <svg className="h-48 w-48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                  </svg>
                </div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="bg-primaryColor/10 border-primaryColor/20 flex h-14 w-14 items-center justify-center rounded-2xl border">
                    <svg
                      className="text-primaryColor h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="bg-primaryColor/15 h-2 w-24 rounded-full" />
                    <div className="bg-primaryColor/10 h-2 w-16 rounded-full" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-primaryText mb-2 text-xl font-bold">Real-time event pipeline</h3>
                <p className="text-secondaryText text-sm leading-relaxed">
                  Ingest millions of events per second with sub-100ms latency. See what&apos;s
                  happening right now, not what happened yesterday.
                </p>
              </div>
            </div>

            {/* Top right - Workflow automation (3 cols) */}
            <div className="card relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl p-8 lg:col-span-3">
              <div className="mb-8 flex flex-1 flex-col items-center justify-center gap-3">
                <div className="bg-bgDark3/80 border-mainBorderDarker flex translate-x-4 items-center gap-3 rounded-full border px-5 py-2.5">
                  <div className="bg-primaryColor/15 flex h-8 w-8 items-center justify-center rounded-full">
                    <svg
                      className="text-secondaryColor h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <span className="text-secondaryText text-xs font-semibold tracking-wider uppercase">
                    Custom dashboards
                  </span>
                </div>
                <div className="bg-bgDark3/80 border-mainBorderDarker flex -translate-x-6 items-center gap-3 rounded-full border px-5 py-2.5">
                  <div className="bg-primaryColor/15 flex h-8 w-8 items-center justify-center rounded-full">
                    <svg
                      className="text-secondaryColor h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <span className="text-secondaryText text-xs font-semibold tracking-wider uppercase">
                    Funnel analysis
                  </span>
                </div>
                <div className="bg-bgDark3/80 border-mainBorderDarker flex translate-x-2 items-center gap-3 rounded-full border px-5 py-2.5">
                  <div className="bg-primaryColor/15 flex h-8 w-8 items-center justify-center rounded-full">
                    <svg
                      className="text-secondaryColor h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                  </div>
                  <span className="text-secondaryText text-xs font-semibold tracking-wider uppercase">
                    Scheduled reports
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-primaryText mb-2 text-xl font-bold">Insights on autopilot</h3>
                <p className="text-secondaryText text-sm leading-relaxed">
                  Dashboards that build themselves, reports that deliver on schedule, and funnels
                  that highlight where users drop off - without writing a single query.
                </p>
              </div>
            </div>

            {/* Bottom left - Integrations (3 cols) */}
            <div className="card relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl p-8 lg:col-span-3">
              <div className="mb-8 flex flex-1 items-center justify-center gap-4">
                <div className="bg-bgDark3/60 border-mainBorderDarker flex items-center gap-3 rounded-xl border px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4A154B]/20">
                    <span className="text-sm font-bold text-[#E01E5A]">#</span>
                  </div>
                  <div>
                    <div className="text-primaryText text-xs font-semibold">Slack</div>
                    <div className="text-secondaryText text-[10px]">Connected</div>
                  </div>
                </div>
                <div className="bg-bgDark3/60 border-mainBorderDarker flex items-center gap-3 rounded-xl border px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF4A00]/10">
                    <svg
                      className="h-4 w-4 text-[#FF4A00]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-primaryText text-xs font-semibold">Zapier</div>
                    <div className="text-secondaryText text-[10px]">Connected</div>
                  </div>
                </div>
                <div className="bg-bgDark3/60 border-mainBorderDarker hidden items-center gap-3 rounded-xl border px-4 py-3 sm:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#52BD94]/10">
                    <svg
                      className="h-4 w-4 text-[#52BD94]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="16,18 22,12 16,6" />
                      <polyline points="8,6 2,12 8,18" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-primaryText text-xs font-semibold">REST API</div>
                    <div className="text-secondaryText text-[10px]">Active</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-primaryText mb-2 text-xl font-bold">Connects to your stack</h3>
                <p className="text-secondaryText text-sm leading-relaxed">
                  REST API, webhooks, Slack, Zapier, Segment, and more. Tailcast fits into your
                  workflow instead of replacing it.
                </p>
              </div>
            </div>

            {/* Bottom right - AI (2 cols) */}
            <div className="card relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-3xl p-8 lg:col-span-2">
              <div className="relative mb-8 flex flex-1 items-center justify-center">
                <div
                  className="pointer-events-none absolute h-32 w-32 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                  }}
                />
                <div className="bg-bgDark3 border-mainBorderDarker relative z-10 flex h-20 w-20 items-center justify-center rounded-full border">
                  <svg
                    className="text-secondaryColor h-9 w-9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </div>
                <div className="text-secondaryText/40 absolute bottom-2 text-[10px] tracking-widest uppercase">
                  Tailcast AI
                </div>
              </div>
              <div>
                <h3 className="text-primaryText mb-2 text-xl font-bold">AI-powered predictions</h3>
                <p className="text-secondaryText text-sm leading-relaxed">
                  Anomaly detection, churn forecasting, and smart suggestions - all running in the
                  background so you can focus on building.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
