import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  date: Date;
  image: string;
  icon: string;
  author: BlogAuthor;
  readTime: string;
  tags: string[];
  content: string;
}

const BLOG_DIR = path.resolve(process.cwd(), 'src', 'content', 'blog');

/** Maps frontmatter asset paths like `../../assets/images/blog1.png` to public `/images/blog1.png`. */
function toPublicImagePath(p: string): string {
  return `/images/${path.basename(p)}`;
}

function parsePost(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const slug = path.basename(filePath, path.extname(filePath));

  return {
    slug,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    date: data.date instanceof Date ? data.date : new Date(data.date),
    image: toPublicImagePath(data.image),
    icon: typeof data.icon === 'string' ? data.icon : '',
    author: {
      name: data.author?.name ?? '',
      role: data.author?.role ?? '',
      avatar: data.author?.avatar ? toPublicImagePath(data.author.avatar) : '',
    },
    readTime: data.readTime,
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const filePath = path.resolve(BLOG_DIR, f);
      if (filePath !== BLOG_DIR && !filePath.startsWith(BLOG_DIR + path.sep)) {
        throw new Error(`Refusing to read blog post outside content directory: ${f}`);
      }
      return parsePost(filePath);
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}
