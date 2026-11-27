import Link from 'next/link';
import { getBlogPosts } from '@/lib/blog';

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function Blog() {
  const posts = getBlogPosts();
  const featuredPost = posts[0];
  const sidebarPosts = posts.slice(1, 4);
  const allPosts = posts.slice(0, 4);

  if (!featuredPost) return null;

  return (
    <section className="bg-bgDark2 relative mt-20 flex w-full justify-center">
      <div className="absolute -top-16" id="blog"></div>
      <div className="content-container bg-bgDark2 pt-4 pb-0">
        <div className="fade-in">
          <div className="mb-20">
            <div className="mx-auto mb-16 max-w-2xl text-center lg:mr-0 lg:ml-0 lg:text-left">
              <span className="block-subtitle">Our Blog</span>
              <h2 className="font-heading text-primaryText mt-6 mb-6 text-4xl font-bold lg:text-5xl">
                Latest Insights
              </h2>
              <p className="text-secondaryText mb-6">
                Stay updated with the latest trends and insights in our industry.
              </p>
            </div>

            {/* Desktop layout (lg+): featured + sidebar */}
            <div className="hidden h-auto flex-row gap-8 lg:flex lg:h-[28rem] xl:h-[32rem]">
              {/* Featured post (left) */}
              <Link href={`/blog/${featuredPost.slug}`} className="group h-full lg:w-3/5">
                <article className="card flex h-full flex-col overflow-hidden rounded-3xl transition">
                  <div className="flex-grow p-4 pb-0">
                    <div className="bg-bgDark1Lighter flex h-full items-center justify-center rounded-2xl">
                      <svg
                        className="text-secondaryColor/30 h-32 w-32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: featuredPost.icon }}
                      />
                    </div>
                  </div>
                  <div className="px-8 pt-5 pb-5">
                    <div className="text-secondaryText mb-1 text-sm">
                      {formatDate(featuredPost.date)}
                    </div>
                    <h3 className="text-primaryText text-2xl font-bold transition group-hover:text-[#c8c9f8]">
                      {featuredPost.title}
                    </h3>
                    <p className="text-secondaryText mt-2 text-sm leading-relaxed">
                      {featuredPost.subtitle}
                    </p>
                  </div>
                </article>
              </Link>

              {/* Sidebar posts (right) */}
              <div className="flex h-full flex-col gap-5 lg:w-2/5">
                {sidebarPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group card flex flex-1 items-center gap-4 p-4 transition"
                  >
                    <div className="bg-bgDark1Lighter flex aspect-square shrink-0 items-center justify-center self-stretch rounded-xl">
                      <svg
                        className="text-secondaryColor/40 h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: post.icon }}
                      />
                    </div>
                    <div>
                      <h3 className="text-primaryText blog-sidebar-title leading-snug font-bold transition group-hover:text-[#c8c9f8]">
                        {post.title}
                      </h3>
                      <div className="text-secondaryText mt-3 text-sm">{formatDate(post.date)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile/Tablet layout (< lg): 4 equal cards */}
            <div className="xs:grid-cols-2 grid grid-cols-1 gap-6 lg:hidden">
              {allPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article className="card flex h-full flex-col overflow-hidden rounded-2xl transition">
                    <div className="p-3 pb-0">
                      <div className="bg-bgDark1Lighter xs:aspect-auto xs:h-40 flex aspect-[16/9] items-center justify-center rounded-xl">
                        <svg
                          className="text-secondaryColor/30 h-16 w-16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.8"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: post.icon }}
                        />
                      </div>
                    </div>
                    <div className="px-5 pt-4 pb-4">
                      <div className="text-secondaryText mb-1 text-sm">{formatDate(post.date)}</div>
                      <h3 className="text-primaryText text-lg leading-snug font-bold transition group-hover:text-[#c8c9f8]">
                        {post.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
