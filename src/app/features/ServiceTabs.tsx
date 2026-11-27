'use client';

import { useState } from 'react';

const serviceCategories = [
  {
    id: 'tracking',
    label: 'Build',
    title: 'Capture every interaction',
    description:
      "Our lightweight SDK captures clicks, page views, custom events, and server-side actions with zero performance overhead. Auto-capture mode means you never miss an event - even ones you didn't know mattered yet.",
    features: [
      'Auto-capture mode',
      'Server-side & client-side SDKs',
      'Event replay & debugging',
      'Zero sampling - 100% of your data',
    ],
    icon: `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`,
  },
  {
    id: 'visualization',
    label: 'Customize',
    title: 'Dashboards that tell a story',
    description:
      'Build custom dashboards in minutes with drag-and-drop widgets. Choose from 20+ chart types, set dynamic filters, and share views with your team. Every dashboard updates in real time - no refresh needed.',
    features: [
      '20+ chart types',
      'Drag-and-drop builder',
      'Real-time updates',
      'Shareable public links',
    ],
    icon: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>`,
  },
  {
    id: 'intelligence',
    label: 'Explore',
    title: 'AI that works while you sleep',
    description:
      'Automated anomaly detection catches issues before your users report them. Trend forecasting helps you plan ahead. Natural-language queries let anyone on your team ask questions and get real answers.',
    features: [
      'Anomaly detection & alerts',
      'Trend forecasting',
      'Natural-language queries',
      'Automated weekly reports',
    ],
    icon: `<path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>`,
  },
  {
    id: 'integrations',
    label: 'Share',
    title: 'Connects to your entire stack',
    description:
      'Native integrations with 50+ tools - from data warehouses to messaging apps. REST API and webhooks for everything else. Most teams are fully connected within a single sprint.',
    features: [
      '50+ native integrations',
      'REST API & webhooks',
      'Reverse ETL',
      'Custom connector SDK',
    ],
    icon: `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>`,
  },
];

export default function ServiceTabs() {
  const [activeId, setActiveId] = useState(serviceCategories[0].id);

  return (
    <section className="pt-36 pb-24 lg:pt-44">
      <div className="content-container">
        <div className="services-fade">
          <div className="mb-10 text-center">
            <span className="block-subtitle mb-6 block">Our features</span>
            <h2 className="text-primaryText text-3xl font-bold tracking-tight lg:text-4xl">
              Everything your data team needs
            </h2>
          </div>

          {/* Tab buttons */}
          {/* Desktop tabs (4) */}
          <div className="mb-14 hidden justify-center sm:flex">
            <div
              className="bg-bgDark1/80 border-mainBorderFaintest inline-flex gap-1 rounded-2xl border p-1.5"
              role="tablist"
              aria-label="Feature categories"
            >
              {serviceCategories.map((cat) => {
                const active = cat.id === activeId;
                return (
                  <button
                    key={cat.id}
                    className={`tab-button relative cursor-pointer rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'bg-bgDark3 text-primaryText shadow-lg shadow-black/20'
                        : 'text-secondaryText hover:text-primaryText'
                    }`}
                    role="tab"
                    aria-selected={active ? 'true' : 'false'}
                    aria-controls={`service-panel-${cat.id}`}
                    data-tab={cat.id}
                    onClick={() => setActiveId(cat.id)}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg
                        className={`h-4 w-4 ${active ? 'text-secondaryColor' : 'text-secondaryText/50'} tab-icon transition-colors duration-300`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        dangerouslySetInnerHTML={{ __html: cat.icon }}
                      />
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Mobile tabs (2 rows of 2) */}
          <div
            className="mb-14 grid grid-cols-2 gap-2 sm:hidden"
            role="tablist"
            aria-label="Feature categories"
          >
            {serviceCategories.map((cat) => {
              const active = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  className={`tab-button cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? 'bg-bgDark3 text-primaryText border-transparent'
                      : 'bg-bgDark1/80 text-secondaryText hover:text-primaryText border-mainBorderFaintest'
                  }`}
                  role="tab"
                  aria-selected={active ? 'true' : 'false'}
                  aria-controls={`service-panel-${cat.id}`}
                  data-tab={cat.id}
                  onClick={() => setActiveId(cat.id)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className={`h-4 w-4 ${active ? 'text-secondaryColor' : 'text-secondaryText/50'} tab-icon transition-colors duration-300`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      dangerouslySetInnerHTML={{ __html: cat.icon }}
                    />
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab panels */}
          {serviceCategories.map((cat) => {
            const active = cat.id === activeId;
            return (
              <div
                key={cat.id}
                className={`tab-panel${active ? '' : ' hidden'}`}
                role="tabpanel"
                id={`service-panel-${cat.id}`}
                data-panel={cat.id}
              >
                <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                  <div className="lg:w-1/2">
                    <div className="mb-6 flex items-center gap-4">
                      <div
                        className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                        }}
                      >
                        <svg
                          className="text-primaryColor h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          dangerouslySetInnerHTML={{ __html: cat.icon }}
                        />
                      </div>
                      <h3 className="text-primaryText text-2xl font-bold">{cat.title}</h3>
                    </div>
                    <p className="text-secondaryText mb-8 leading-relaxed">{cat.description}</p>
                    <ul className="space-y-3">
                      {cat.features.map((f) => (
                        <li key={f} className="text-secondaryText flex items-center gap-3 text-sm">
                          <svg
                            className="text-primaryColor h-5 w-5 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 lg:mt-0 lg:w-1/2">
                    <div className="flex aspect-[4/3] items-center justify-center rounded-3xl p-12 lg:p-16">
                      <svg
                        className="text-secondaryColor/15 h-32 w-32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        viewBox="0 0 24 24"
                        dangerouslySetInnerHTML={{ __html: cat.icon }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
