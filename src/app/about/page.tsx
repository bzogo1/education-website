import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollUpButton from '@/components/ScrollUpButton';
import BentoFeatures from '@/components/BentoFeatures';
import Team from '@/components/Team';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Tailcast is an open source dark-themed landing page template built with Next.js and Tailwind CSS.',
};

interface Milestone {
  side: 'left' | 'right';
  date: string;
  title: string;
  description: string;
  glow?: boolean;
}

const milestones: Milestone[] = [
  {
    side: 'left',
    date: 'Q1 2022',
    title: 'First prototype',
    description: 'Built a working event pipeline. Three teams asked for access the same day.',
  },
  {
    side: 'right',
    date: 'Q3 2022',
    title: 'Public beta',
    description: '500 teams signed up in the first month without any marketing.',
  },
  {
    side: 'left',
    date: 'Q1 2023',
    title: 'Series A',
    description: 'Raised $12M to scale infrastructure. Crossed 2,000 active teams.',
  },
  {
    side: 'right',
    date: 'Q4 2023',
    title: 'API-first launch',
    description: 'REST API, webhooks, Slack and Zapier integrations. Usage doubled in 8 weeks.',
  },
  {
    side: 'left',
    date: 'Today',
    title: '10,000+ teams',
    description: '2B+ events per month. Building AI-powered insights and predictive analytics.',
    glow: true,
  },
];

function TimelineEntry({ milestone }: { milestone: Milestone }) {
  const text = (
    <>
      <div className="text-secondaryColor mb-1 text-sm font-bold">{milestone.date}</div>
      <h3 className="text-primaryText mb-1 text-lg font-bold">{milestone.title}</h3>
      <p className="text-secondaryText text-sm leading-relaxed">{milestone.description}</p>
    </>
  );

  return (
    <div className="relative pl-10 lg:flex lg:items-start lg:pl-0">
      {milestone.side === 'left' ? (
        <div className="hidden lg:flex lg:w-1/2 lg:justify-end lg:pr-12">
          <div className="max-w-xs text-right">{text}</div>
        </div>
      ) : (
        <div className="hidden lg:block lg:w-1/2" />
      )}
      <div
        className={`border-secondaryColor bg-bgDark2 absolute top-1 left-0 z-10 h-[1.375rem] w-[1.375rem] rounded-full border-2 lg:left-1/2 lg:-translate-x-1/2${
          milestone.glow ? 'shadow-[0_0_8px_rgba(145,198,255,0.3)]' : ''
        }`}
      />
      {milestone.side === 'left' ? (
        <div className="lg:hidden lg:w-1/2 lg:pl-12">{text}</div>
      ) : (
        <div className="lg:w-1/2 lg:pl-12">{text}</div>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-44">
        <div
          className="pointer-events-none absolute top-1/4 left-1/2 h-[37.5rem] w-[62.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)',
          }}
        />
        <div className="content-container relative z-10">
          <div className="about-hero-fade">
            <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
              <div className="lg:w-[55%]">
                <span className="block-subtitle mb-6 block">Our story</span>
                <h1 className="text-primaryText mb-8 text-4xl leading-[1.1] font-bold tracking-tight md:text-5xl lg:text-6xl">
                  Built for clarity over complexity
                </h1>
                <p className="text-secondaryText text-lg leading-relaxed">
                  Tailcast was born from experience with analytics tools that bury insights under
                  layers of complexity. We set out to build something different - a platform
                  that&apos;s powerful enough for engineers yet intuitive enough for the entire
                  team.
                </p>
              </div>
              <div className="flex flex-col gap-14 lg:w-1/2 lg:pt-14 lg:pl-16 xl:pl-24">
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
      </section>

      <BentoFeatures />

      {/* Timeline */}
      <section className="pt-8 pb-32">
        <div className="content-container">
          <div className="fade-in">
            <div className="mb-16 text-center">
              <span className="block-subtitle mb-6 block">Our journey</span>
              <h2 className="text-primaryText text-3xl font-bold tracking-tight lg:text-4xl">
                Milestones that shaped Tailcast
              </h2>
            </div>
            <div className="relative mx-auto max-w-4xl">
              <div className="bg-mainBorderDarker absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 lg:block" />
              <div className="bg-mainBorderDarker absolute top-3 bottom-3 left-[0.6875rem] w-px lg:hidden" />

              <div className="space-y-12 lg:space-y-16">
                {milestones.map((milestone) => (
                  <TimelineEntry key={milestone.date + milestone.title} milestone={milestone} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="pb-24">
        <div className="content-container">
          <div className="fade-in">
            <div className="card rounded-3xl p-10 lg:p-14">
              <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                <div className="lg:w-1/2">
                  <span className="block-subtitle mb-6 block">Security</span>
                  <h2 className="text-primaryText mb-6 text-3xl font-bold tracking-tight">
                    Enterprise-grade security, built in
                  </h2>
                  <p className="text-secondaryText mb-8 leading-relaxed">
                    Your data is encrypted at rest and in transit. We&apos;re SOC 2 Type II
                    certified and GDPR compliant. Role-based access, SSO, and audit logs come
                    standard - not as enterprise add-ons.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="badge-neutral font-semibold">SOC 2 Type II</span>
                    <span className="badge-neutral font-semibold">GDPR</span>
                    <span className="badge-neutral font-semibold">SSO / SAML</span>
                    <span className="badge-neutral font-semibold">Encryption</span>
                    <span className="badge-neutral font-semibold">Audit Logs</span>
                  </div>
                </div>
                <div className="flex justify-center lg:w-1/2">
                  <div className="bg-primaryColor/5 border-primaryColor/10 flex h-40 w-40 items-center justify-center rounded-full border">
                    <div className="bg-primaryColor/10 border-primaryColor/15 flex h-28 w-28 items-center justify-center rounded-full border">
                      <svg
                        className="text-primaryColor h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Team />

      <Footer />
      <ScrollUpButton />

      <style>{`
        .about-hero-fade {
          opacity: 0;
          transform: translateY(12px);
          animation: aboutHeroIn 0.8s ease forwards;
        }

        @keyframes aboutHeroIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
