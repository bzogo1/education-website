import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollUpButton from '@/components/ScrollUpButton';
import { positions } from '@/content/positions';
import ApplyModal from './ApplyModal';

export const dynamicParams = false;

export function generateStaticParams() {
  return positions.map((pos) => ({ slug: pos.slug }));
}

type Position = (typeof positions)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const position = positions.find((p) => p.slug === slug);
  if (!position) return {};
  return {
    title: `${position.title} - Explore`,
    description: position.description,
  };
}

export default async function ExplorePositionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const position: Position | undefined = positions.find((p) => p.slug === slug);
  if (!position) notFound();

  return (
    <>
      <Navbar />
      <section className="bg-bgDark2 pt-36 pb-20">
        <div className="content-container">
          <div className="fade-in">
            {/* Back link */}
            <a
              href="/explore"
              className="text-secondaryText hover:text-primaryText mb-10 inline-flex items-center gap-2 transition"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Back to Explore
            </a>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Main content */}
              <div className="space-y-12 lg:col-span-2">
                {/* Header */}
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="badge-primary">{position.department}</span>
                    <span className="badge-neutral">{position.location}</span>
                    <span className="badge-neutral">{position.type}</span>
                  </div>
                  <h1 className="text-primaryText mt-6 mb-10 text-4xl font-bold lg:text-5xl">
                    {position.title}
                  </h1>
                  <p className="text-secondaryText text-xl leading-relaxed">{position.about}</p>
                </div>
                {/* Responsibilities */}
                <div>
                  <h2 className="text-primaryText mb-6 text-2xl font-bold">What you'll do</h2>
                  <ul className="space-y-4">
                    {position.responsibilities.map((item) => (
                      <li key={item} className="flex gap-3">
                        <svg
                          className="text-primaryColor mt-0.5 h-5 w-5 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-secondaryText leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-primaryText mb-6 text-2xl font-bold">
                    What we're looking for
                  </h2>
                  <ul className="space-y-4">
                    {position.requirements.map((item) => (
                      <li key={item} className="flex gap-3">
                        <svg
                          className="text-primaryColor mt-0.5 h-5 w-5 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-secondaryText leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="card sticky top-28 rounded-3xl p-8">
                  <h3 className="text-primaryText mb-6 text-xl font-bold">Apply for this role</h3>
                  <p className="text-secondaryText mb-8 leading-relaxed">
                    Interested in this position? Send us your resume and a short note about why you'd
                    be a great fit.
                  </p>
                  <button id="open-apply-modal" className="contained-button w-full py-3 text-lg">
                    Apply now
                  </button>
                  <div className="border-mainBorder mt-8 space-y-4 border-t pt-6">
                    <div className="flex justify-between">
                      <span className="text-secondaryText text-sm">Department</span>
                      <span className="text-primaryText text-sm font-medium">
                        {position.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondaryText text-sm">Location</span>
                      <span className="text-primaryText text-sm font-medium">
                        {position.location}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondaryText text-sm">Type</span>
                      <span className="text-primaryText text-sm font-medium">{position.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollUpButton />

      <ApplyModal title={position.title} />
    </>
  );
}
