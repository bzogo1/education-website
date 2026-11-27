export default function AboutHero() {
  return (
    <section className="bg-bgDark2 w-full pt-16 pb-16 lg:pt-24 lg:pb-24">
      <div className="content-container">
        <div className="fade-in">
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
            <div className="lg:w-1/2">
              <span className="block-subtitle mb-6 block">Our story</span>
              <h2 className="text-primaryText mb-8 text-4xl leading-[1.1] font-bold tracking-tight md:text-5xl lg:text-6xl">
                Built for clarity over complexity
              </h2>
              <p className="text-secondaryText text-lg leading-relaxed">
                Tailcast was born from experience with analytics tools that bury insights under
                layers of complexity. We set out to build something different - a platform that&apos;s
                powerful enough for engineers yet intuitive enough for the entire team.
              </p>
            </div>
            <div className="flex flex-col gap-14 lg:w-1/2 lg:pt-14">
              <div className="relative pl-8">
                <div className="from-primaryColor to-primaryColor/0 absolute top-0 left-0 h-full w-[3px] rounded-full bg-gradient-to-b" />
                <div className="stat-pulse bg-primaryColor absolute top-0 -left-1 h-[11px] w-[11px] rounded-full" />
                <div className="from-primaryText to-secondaryText bg-gradient-to-r bg-clip-text text-5xl leading-none font-bold text-transparent md:text-6xl">
                  10,000+
                </div>
                <div className="text-secondaryText mt-3 text-base">
                  Teams ship faster with Tailcast every day
                </div>
              </div>
              <div className="relative pl-8">
                <div className="from-secondaryColor to-secondaryColor/0 absolute top-0 left-0 h-full w-[3px] rounded-full bg-gradient-to-b" />
                <div
                  className="stat-pulse bg-secondaryColor absolute top-0 -left-1 h-[11px] w-[11px] rounded-full"
                  style={{ animationDelay: '1s' }}
                />
                <div className="from-primaryText to-secondaryText bg-gradient-to-r bg-clip-text text-5xl leading-none font-bold text-transparent md:text-6xl">
                  2 billion+
                </div>
                <div className="text-secondaryText mt-3 text-base">
                  Events processed every month, sub-100ms latency
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .stat-pulse {
          animation: statPulse 2.5s ease-in-out infinite;
        }

        @keyframes statPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 currentColor;
            opacity: 1;
          }
          50% {
            box-shadow: 0 0 12px 4px currentColor;
            opacity: 0.7;
          }
        }
      `}</style>
    </section>
  );
}
