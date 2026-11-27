import type { Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollUpButton from '@/components/ScrollUpButton';
import ServiceTabs from './ServiceTabs';
import testimonial1 from '@/assets/images/testimonial1.png';
import testimonial2 from '@/assets/images/testimonial2.png';
import testimonial3 from '@/assets/images/testimonial3.png';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Explore Tailcast features - real-time analytics, custom dashboards, AI-powered insights, and more.',
};

const comparisonFeatures = [
  {
    name: 'Real-time event streaming',
    description: 'Sub-100ms latency on all queries',
    mixpanel: false,
    amplitude: false,
    ga4: false,
  },
  {
    name: 'Unlimited event volume',
    description: 'No caps, no overage fees',
    mixpanel: false,
    amplitude: false,
    ga4: false,
  },
  {
    name: 'AI-powered insights',
    description: 'Anomaly detection & forecasting',
    mixpanel: true,
    amplitude: true,
    ga4: false,
  },
  {
    name: 'Natural-language queries',
    description: 'Ask in plain English, get answers',
    mixpanel: false,
    amplitude: false,
    ga4: false,
  },
  {
    name: 'Custom dashboards',
    description: 'Drag-and-drop builder',
    mixpanel: true,
    amplitude: true,
    ga4: false,
  },
  {
    name: 'REST API & webhooks',
    description: 'Full programmatic access',
    mixpanel: true,
    amplitude: true,
    ga4: true,
  },
  {
    name: 'Team collaboration',
    description: 'Shared views, annotations, roles',
    mixpanel: true,
    amplitude: true,
    ga4: false,
  },
  {
    name: 'Zero data sampling',
    description: '100% of events, always',
    mixpanel: false,
    amplitude: false,
    ga4: false,
  },
  {
    name: 'SOC 2 + GDPR',
    description: 'Enterprise-grade by default',
    mixpanel: true,
    amplitude: true,
    ga4: true,
  },
  {
    name: 'No per-seat pricing',
    description: 'Whole team, one price',
    mixpanel: false,
    amplitude: false,
    ga4: true,
  },
];

const process = [
  {
    step: '01',
    title: 'Connect your data',
    description:
      'Install our lightweight SDK or use the REST API. Most teams are sending events within 15 minutes.',
  },
  {
    step: '02',
    title: 'Build your views',
    description:
      'Use pre-built templates or create custom dashboards. Drag and drop metrics, set filters, choose visualizations.',
  },
  {
    step: '03',
    title: 'Get insights automatically',
    description:
      'Our AI surfaces anomalies and trends before you notice them. Set alerts that actually matter.',
  },
  {
    step: '04',
    title: 'Scale with confidence',
    description:
      'From startup to enterprise - same platform, same speed. No re-architecture needed as your data grows.',
  },
];

const testimonials: { name: string; title: string; content: string; image: StaticImageData }[] = [
  {
    name: 'Marcus Rivera',
    title: 'CTO at StreamLine',
    content:
      'We cut our reporting time by 80%. Real-time dashboards replaced our weekly spreadsheet ritual.',
    image: testimonial1,
  },
  {
    name: 'Elena Lopes',
    title: 'Lead Engineer at Vertex AI',
    content:
      'The API is beautifully designed. We integrated Tailcast into our CI/CD pipeline in under an hour.',
    image: testimonial2,
  },
  {
    name: 'James Thornton',
    title: 'Product Manager at NexaFlow',
    content: 'AI alerts caught a conversion drop at 2 AM. We fixed it before the morning standup.',
    image: testimonial3,
  },
  {
    name: 'Sofia Kim',
    title: 'Head of Growth at Prism',
    content:
      'Onboarding was seamless. Our non-technical team members were creating their own dashboards within the first week.',
    image: testimonial1,
  },
  {
    name: 'David Chen',
    title: 'VP Engineering at Monolink',
    content:
      'We migrated from Mixpanel in a weekend. The data import tool handled 3 years of events without a hiccup.',
    image: testimonial2,
  },
  {
    name: 'Anna Petrova',
    title: 'Data Lead at Cosmo Health',
    content:
      'Natural-language queries changed everything. Our PMs no longer wait for the data team to pull reports.',
    image: testimonial3,
  },
];

function ComparisonCell({ value }: { value: boolean }) {
  if (value) {
    return (
      <>
        <svg
          className="text-secondaryText/40 h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span className="sr-only">Yes</span>
      </>
    );
  }
  return (
    <>
      <svg
        className="h-5 w-5 text-[rgb(255_255_255/0.1)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
      </svg>
      <span className="sr-only">No</span>
    </>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <Navbar />

      {/* 1. Tabbed Features */}
      <ServiceTabs />

      {/* 2. How it works */}
      <section className="py-12 lg:py-24">
        <div className="content-container">
          <div className="fade-in">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {process.map((item, i) => (
                <div key={item.step} className="group relative">
                  {i < process.length - 1 && (
                    <div className="bg-mainBorderDarker absolute top-10 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-3.5rem)] lg:block" />
                  )}
                  <div className="text-center">
                    <div
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <span className="text-secondaryColor text-2xl font-bold">{item.step}</span>
                    </div>
                    <h3 className="text-primaryText mb-3 text-lg font-bold">{item.title}</h3>
                    <p className="text-secondaryText text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Comparison Table */}
      <section className="py-24">
        <div className="content-container">
          <div className="fade-in">
            <div className="mb-16 text-center">
              <span className="block-subtitle mb-6 block">Comparison</span>
              <h2 className="text-primaryText text-3xl font-bold tracking-tight lg:text-4xl">
                Why teams switch to Tailcast
              </h2>
            </div>
            <div className="bg-bgDark3/40 border-mainBorderFaintest overflow-hidden rounded-3xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-mainBorderDarker border-b">
                    <th className="text-secondaryText w-1/2 p-3 text-left font-medium sm:p-5 lg:p-6">
                      Feature
                    </th>
                    <th className="p-3 text-center sm:p-5 lg:p-6">
                      <span className="text-secondaryColor text-base font-bold">Tailcast</span>
                    </th>
                    <th className="p-3 text-center sm:p-5 lg:p-6">
                      <span className="text-secondaryText font-medium">Datawise</span>
                    </th>
                    <th className="hidden p-3 text-center sm:table-cell sm:p-5 lg:p-6">
                      <span className="text-secondaryText font-medium">Metrifly</span>
                    </th>
                    <th className="hidden p-3 text-center sm:p-5 md:table-cell lg:p-6">
                      <span className="text-secondaryText font-medium">Chartbolt</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((f, i) => (
                    <tr
                      key={f.name}
                      className={
                        i < comparisonFeatures.length - 1
                          ? 'border-mainBorderFaintest border-b'
                          : ''
                      }
                    >
                      <td className="p-3 sm:p-5 lg:p-6">
                        <div className="text-primaryText text-[0.95rem] font-medium">{f.name}</div>
                        <div className="text-secondaryText mt-0.5 hidden text-sm lg:block">
                          {f.description}
                        </div>
                      </td>
                      <td className="bg-secondaryColor/[0.03] p-3 text-center sm:p-5 lg:p-6">
                        <div className="flex justify-center">
                          <div className="bg-secondaryColor/15 flex h-7 w-7 items-center justify-center rounded-lg">
                            <svg
                              className="text-secondaryColor h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span className="sr-only">Yes</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-center sm:p-5 lg:p-6">
                        <div className="flex justify-center">
                          <ComparisonCell value={f.mixpanel} />
                        </div>
                      </td>
                      <td className="hidden p-3 text-center sm:table-cell sm:p-5 lg:p-6">
                        <div className="flex justify-center">
                          <ComparisonCell value={f.amplitude} />
                        </div>
                      </td>
                      <td className="hidden p-3 text-center sm:p-5 md:table-cell lg:p-6">
                        <div className="flex justify-center">
                          <ComparisonCell value={f.ga4} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="py-24">
        <div className="content-container">
          <div className="fade-in">
            <div className="mb-16 text-center">
              <span className="block-subtitle mb-6 block">Testimonials</span>
              <h2 className="text-primaryText text-3xl font-bold tracking-tight lg:text-4xl">
                Trusted by data-driven teams
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="card flex flex-col rounded-3xl p-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="fill-quoteIconColor mb-4 w-6"
                  >
                    <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z" />
                  </svg>
                  <p className="text-secondaryText mb-6 flex-grow text-sm leading-relaxed">
                    &quot;{t.content}&quot;
                  </p>
                  <div className="border-mainBorderFaintest flex items-center gap-3 border-t pt-5">
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                      loading="eager"
                      decoding="sync"
                    />
                    <div>
                      <div className="text-primaryText text-sm font-medium">{t.name}</div>
                      <div className="text-secondaryText text-xs">{t.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-10 pb-32">
        <div className="content-container">
          <div className="fade-in">
            <div className="card flex flex-col items-center gap-10 rounded-3xl p-12 lg:flex-row lg:gap-16 lg:p-16">
              <div className="lg:w-2/3">
                <h2 className="text-primaryText mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
                  Your data is already telling a story.
                </h2>
                <p className="text-secondaryText leading-relaxed">
                  Most teams set up their first dashboard in under 5 minutes. No credit card
                  required.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-48 lg:ml-auto">
                <button
                  data-open-modal
                  className="contained-button cursor-pointer py-3 text-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)]"
                >
                  Start free trial
                </button>
                <button
                  data-open-modal
                  className="outlined-button cursor-pointer py-3 text-center text-sm"
                >
                  Book a demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollUpButton />

      <style>{`
        .services-fade {
          opacity: 0;
          transform: translateY(12px);
          animation: servicesFadeIn 0.8s ease forwards;
        }

        @keyframes servicesFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
