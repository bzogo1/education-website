import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollUpButton from '@/components/ScrollUpButton';
import { getBlogPosts } from '@/lib/blog';
import BlogIcon from '@/components/BlogIcon';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest insights, trends, and updates from the Tailcast team.',
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function BlogPage() {
  const posts = getBlogPosts();
  const featuredPost = posts[0];
  const sidebarPosts = posts.slice(1, 5);
  const gridPosts = posts.slice(1);

  return (
    <>
      <Navbar />
      <section className="bg-bgDark2 pt-32 pb-20 lg:pt-36">
        <div className="content-container">
          <div className="fade-in">
            {/* Featured + sidebar */}
            <div className="mb-16 flex flex-col gap-8 lg:flex-row">
              {/* Featured post (left) */}
              <a href={`/blog/${featuredPost.slug}`} className="group lg:w-3/5">
                <article className="card flex h-full flex-col overflow-hidden rounded-3xl transition lg:min-h-full">
                  <div className="p-4 lg:flex-grow">
                    <div className="bg-bgDark1Lighter flex aspect-[16/9] items-center justify-center rounded-2xl lg:aspect-auto lg:h-full">
                      <BlogIcon
                        icon={featuredPost.icon}
                        className="text-secondaryColor/30 h-32 w-32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        viewBox="0 0 24 24"
                      />
                    </div>
                  </div>
                  <div className="px-6 pt-2 pb-3 sm:px-8 sm:pt-3 sm:pb-4">
                    <div className="text-secondaryText mb-1 text-sm">
                      {formatDate(featuredPost.date)}
                    </div>
                    <h2 className="text-primaryText text-xl font-bold transition group-hover:text-[#c8c9f8] sm:text-2xl">
                      {featuredPost.title}
                    </h2>
                    <p className="text-secondaryText mt-2 hidden text-sm leading-relaxed sm:block">
                      {featuredPost.subtitle}
                    </p>
                  </div>
                </article>
              </a>

              {/* Sidebar posts (right) */}
              <div className="flex flex-col gap-4 lg:w-2/5">
                {sidebarPosts.map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group card flex items-center gap-4 p-4 transition"
                  >
                    <div className="bg-bgDark1Lighter flex h-20 w-20 shrink-0 items-center justify-center rounded-xl">
                      <BlogIcon
                        icon={post.icon}
                        className="text-secondaryColor/40 h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        viewBox="0 0 24 24"
                      />
                    </div>
                    <div>
                      <h3 className="text-primaryText leading-snug font-bold transition group-hover:text-[#c8c9f8]">
                        {post.title}
                      </h3>
                      <div className="text-secondaryText mt-1 text-sm">{formatDate(post.date)}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* All posts grid */}
            <h2 className="text-primaryText mb-8 text-2xl font-bold">All articles</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <a key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article className="card flex h-full flex-col overflow-hidden rounded-3xl transition">
                    <div className="p-4">
                      <div className="bg-bgDark1Lighter flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl">
                        <BlogIcon
                          icon={post.icon}
                          className="text-secondaryColor/30 h-16 w-16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="0.75"
                          viewBox="0 0 24 24"
                        />
                      </div>
                    </div>
                    <div className="flex grow flex-col px-6 pt-2 pb-8">
                      <div className="text-secondaryText mb-3 text-sm">{formatDate(post.date)}</div>
                      <h2 className="text-primaryText mb-3 text-xl font-bold transition group-hover:text-[#c8c9f8]">
                        {post.title}
                      </h2>
                      <p className="text-secondaryText text-sm leading-relaxed">{post.subtitle}</p>
                    </div>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <ScrollUpButton />
    </>
  );
}
