import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollUpButton from '@/components/ScrollUpButton';
import Article from '@/components/Article';
import { getBlogPosts, getBlogPost } from '@/lib/blog';

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      publishedTime: post.date.toISOString(),
      authors: [post.author.name],
      tags: post.tags,
    },
  };
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const allPosts = getBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleData = {
    title: post.title,
    subtitle: post.description,
    date: formatDate(post.date),
    image: post.image,
    author: {
      name: post.author.name,
      role: post.author.role,
      avatar: post.author.avatar,
    },
    readTime: post.readTime,
    tags: post.tags,
  };

  return (
    <>
      <Navbar />
      <Article articleData={articleData}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </Article>

      {/* Related posts */}
      <section className="bg-bgDark2 pb-20">
        <div className="content-container">
          <h2 className="text-primaryText mb-8 text-2xl font-bold">See also</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <a key={related.slug} href={`/blog/${related.slug}`} className="group">
                <article className="card flex h-full flex-col overflow-hidden rounded-3xl transition">
                  <div className="p-4">
                    <div className="bg-bgDark1Lighter flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl">
                      <svg
                        className="text-secondaryColor/30 h-16 w-16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.75"
                        viewBox="0 0 24 24"
                        dangerouslySetInnerHTML={{ __html: related.icon }}
                      />
                    </div>
                  </div>
                  <div className="flex grow flex-col px-6 pt-2 pb-8">
                    <div className="text-secondaryText mb-3 text-sm">
                      {formatDate(related.date)}
                    </div>
                    <h2 className="text-primaryText mb-3 text-xl font-bold transition group-hover:text-[#c8c9f8]">
                      {related.title}
                    </h2>
                    <p className="text-secondaryText text-sm leading-relaxed">{related.subtitle}</p>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollUpButton />
    </>
  );
}
