import { makeBlock, makePage } from './blocks';
import { newId, uniqueSlug } from './project';
import type { BlockType, SiteBlock, SitePage, SiteProject } from './types';

export interface SiteTemplate {
  id: string;
  name: string;
  description: string;
  category: 'STEM' | 'Humanities' | 'Arts' | 'Business' | 'Athletics' | 'General';
  accent: string;
  dark?: boolean;
  featured?: boolean;
  build: () => SiteProject;
}

function block(type: BlockType, props: Record<string, unknown> = {}): SiteBlock {
  const base = makeBlock(type);
  return { ...base, props: { ...base.props, ...props } };
}

function page(name: string, slug: string, blocks: SiteBlock[]): SitePage {
  return { ...makePage(name, slug), blocks };
}

function project(input: {
  title: string;
  description: string;
  accent: string;
  dark?: boolean;
  serif?: boolean;
  slug?: string;
  pages: SitePage[];
}): SiteProject {
  const now = new Date().toISOString();
  return {
    id: newId('p'),
    title: input.title,
    description: input.description,
    slug: uniqueSlug(input.slug ?? slugish(input.title), []),
    source: 'template',
    createdAt: now,
    updatedAt: now,
    accent: input.accent,
    theme: { mode: input.dark ? 'dark' : 'light', font: input.serif ? 'serif' : 'sans' },
    pages: input.pages,
  };
}

function slugish(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'portfolio'
  );
}

const contactLinks = [
  { label: 'Email', href: 'mailto:hello@example.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
];

export const SITE_TEMPLATES: SiteTemplate[] = [
  {
    id: 'research',
    name: 'Research & STEM',
    description:
      'For lab work, olympiads, and computational projects. Numbers up front, evidence everywhere.',
    category: 'STEM',
    accent: '#1d4ed8',
    featured: true,
    build: () =>
      project({
        title: 'Maya Chen — Research Portfolio',
        description: 'Computational biology research, awards, and projects by Maya Chen.',
        accent: '#1d4ed8',
        slug: 'research',
        pages: [
          page('Home', 'home', [
            block('navbar', {
              logoText: 'Maya Chen',
              links: [
                { label: 'Home', href: 'home' },
                { label: 'Research', href: 'research' },
              ],
              ctaLabel: 'Email',
              ctaHref: 'mailto:maya@example.com',
            }),
            block('hero', {
              eyebrow: 'Class of 2027 · Computational biology',
              title: 'I study how proteins fold — and how to explain it to a classroom.',
              subtitle:
                'Seventeen-year-old researcher and builder. I split my time between a university wet lab, a tutoring program I founded, and the occasional very long run.',
              ctaText: 'Explore my research',
              ctaHref: 'research',
              secondaryText: 'Read my story',
              secondaryHref: '#about',
              align: 'split',
            }),
            block('stats', {
              items: [
                { value: '3.98', label: 'Unweighted GPA' },
                { value: '1480', label: 'SAT' },
                { value: '7', label: 'AP courses' },
                { value: '2', label: 'Research projects' },
              ],
            }),
            block('about', {
              eyebrow: 'About me',
              heading: 'Curiosity with a lab notebook',
              body: 'I came to science through a broken microscope and a patient teacher. Since then I have spent two summers in a computational biology lab, where I write the scripts that make messy sequencing data legible.\n\nAt school I run a free tutoring program for 40 students a week, because the thing I like most about knowing something is getting to hand it to someone else.',
              facts: [
                { label: 'School', value: 'Lincoln High School' },
                { label: 'Graduating', value: 'Class of 2027' },
                { label: 'Focus', value: 'Computational biology' },
                { label: 'Location', value: 'Portland, OR' },
              ],
            }),
            block('projects', {
              heading: 'Selected work',
              intro: 'Research and tools that shipped, with the details that matter.',
              items: [
                {
                  title: 'Protein folding visualizer',
                  description:
                    'Turns PDB files into interactive 3D models that teachers can project in class. Used by four biology teachers and about 120 students.',
                  tags: 'Python, Three.js, Education',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Sequencing pipeline',
                  description:
                    'A reproducible pipeline that cut a two-day analysis down to about four hours in the lab, with tests and documentation.',
                  tags: 'Python, Snakemake, Research',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Peer tutoring platform',
                  description:
                    'Matching, reminders, and session notes for a volunteer program that now serves 40 students each week.',
                  tags: 'Next.js, Postgres, Community',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('education', {
              heading: 'Education',
              intro: 'Coursework and programs that shaped my focus.',
              items: [
                {
                  school: 'Lincoln High School',
                  degree: 'STEM honors track',
                  period: '2023 — 2027',
                  detail:
                    'GPA 3.98 / 4.0 · 7 AP courses including Biology, Chemistry, and Computer Science A · National Honor Society',
                },
                {
                  school: 'Northwest Science Academy',
                  degree: 'Summer research program',
                  period: 'Summer 2026',
                  detail:
                    'Selected as one of 24 students; eight weeks of full-time computational biology research.',
                },
              ],
            }),
            block('experience', {
              heading: 'Experience',
              intro: '',
              items: [
                {
                  role: 'Research assistant',
                  org: 'University computational biology lab',
                  period: '2025 — present',
                  detail:
                    'Maintain the lab’s analysis pipeline, run weekly quality checks, and present findings at lab meeting.',
                },
                {
                  role: 'Founder & coordinator',
                  org: 'Peer tutoring collective',
                  period: '2025 — present',
                  detail:
                    'Recruited 18 volunteer tutors and built the scheduling and reminder system the program runs on.',
                },
              ],
            }),
            block('skills', {
              heading: 'Skills & tools',
              groups: [
                { name: 'Languages', items: 'Python, TypeScript, R, SQL' },
                { name: 'Lab', items: 'PCR, gel electrophoresis, microscopy, data analysis' },
                { name: 'Tools', items: 'Git, Linux, Snakemake, LaTeX, Figma' },
              ],
            }),
            block('achievements', {
              heading: 'Awards & honors',
              items: [
                {
                  title: 'National Merit Commended Scholar',
                  issuer: 'National Merit Scholarship Program',
                  year: '2026',
                  detail: '',
                },
                {
                  title: 'First place, regional science fair',
                  issuer: 'Northwest Science Expo',
                  year: '2025',
                  detail: 'Computational biology category, 180 entrants.',
                },
                {
                  title: 'Research scholarship finalist',
                  issuer: 'State STEM Foundation',
                  year: '2025',
                  detail: 'One of 12 finalists statewide.',
                },
              ],
            }),
            block('testimonials', {
              heading: 'Recommendations',
              items: [
                {
                  quote:
                    'One of the most self-directed students I have taught. She asks the question the rest of the class misses, then goes and answers it.',
                  author: 'Dr. Elena Ruiz',
                  role: 'AP Biology teacher',
                },
                {
                  quote:
                    'She treats every analysis like someone will depend on it — because in our lab, someone does.',
                  author: 'Priya Raman',
                  role: 'Lab supervisor',
                },
              ],
            }),
            block('cta', {
              title: 'Want the full research summary?',
              subtitle:
                'I am happy to send abstracts, transcripts, or a longer write-up of either project.',
              buttonText: 'Email me',
              buttonHref: 'mailto:maya@example.com',
            }),
            block('contact', {
              heading: 'Get in touch',
              subtitle: 'Best by email. I answer within a day during the school year.',
              email: 'maya@example.com',
              location: 'Portland, OR',
              links: contactLinks,
            }),
            block('footer', {
              text: '© 2026 Maya Chen. Built for the Class of 2027.',
              links: contactLinks,
            }),
          ]),
          page('Research', 'research', [
            block('navbar', {
              logoText: 'Maya Chen',
              links: [
                { label: 'Home', href: 'home' },
                { label: 'Research', href: 'research' },
              ],
              ctaLabel: 'Email',
              ctaHref: 'mailto:maya@example.com',
            }),
            block('text', {
              eyebrow: 'Research',
              heading: 'Making protein data legible',
              body: 'Most of my work sits between biology and software: taking data that is technically public and making it usable by the people who need it.\n\nBelow are the two projects I have presented atscience fairs, plus the write-ups I can share.',
            }),
            block('projects', {
              heading: 'Research projects',
              intro: '',
              items: [
                {
                  title: 'Protein folding visualizer',
                  description:
                    'A browser tool built with Three.js that renders PDB structures with labeled domains and a guided tour for first-year biology students.',
                  tags: 'Structural biology, WebGL',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Variant calling pipeline',
                  description:
                    'Reproducible Snakemake pipeline with containerized steps, automated QC reports, and a small test dataset for onboarding.',
                  tags: 'Bioinformatics, Reproducibility',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('achievements', {
              heading: 'Presentations',
              items: [
                {
                  title: 'Poster: folding visualizer in classrooms',
                  issuer: 'Northwest Science Expo',
                  year: '2026',
                  detail: '',
                },
                {
                  title: 'Lightning talk: reproducible pipelines for small labs',
                  issuer: 'State student research symposium',
                  year: '2025',
                  detail: '',
                },
              ],
            }),
            block('cta', {
              title: 'Ask me about the methods',
              subtitle: 'I have full write-ups, figures, and code for both projects.',
              buttonText: 'Request materials',
              buttonHref: 'mailto:maya@example.com',
            }),
            block('footer', { text: '© 2026 Maya Chen.', links: contactLinks }),
          ]),
        ],
      }),
  },
  {
    id: 'humanities',
    name: 'Humanities & Writing',
    description:
      'Essays, debate, and journalism. A serif, editorial layout that lets the writing lead.',
    category: 'Humanities',
    accent: '#9a6b2f',
    featured: true,
    build: () =>
      project({
        title: 'Amara Osei — Writing Portfolio',
        description: 'Essays, journalism, and debate work by Amara Osei.',
        accent: '#9a6b2f',
        slug: 'writing',
        serif: true,
        pages: [
          page('Home', 'home', [
            block('navbar', {
              logoText: 'Amara Osei',
              links: [
                { label: 'Home', href: 'home' },
                { label: 'Writing', href: 'writing' },
              ],
              ctaLabel: 'Contact',
              ctaHref: '#contact',
            }),
            block('hero', {
              eyebrow: 'Class of 2027 · Politics, philosophy & journalism',
              title: 'I write to find out what I actually think.',
              subtitle:
                'Editor of the school paper, varsity debater, and a student of the small argument that changes a conversation.',
              ctaText: 'Read my work',
              ctaHref: 'writing',
              secondaryText: 'About me',
              secondaryHref: '#about',
              align: 'center',
            }),
            block('about', {
              eyebrow: 'About',
              heading: 'Essays first, opinions second',
              body: 'My favorite writing starts with a question I cannot answer quickly: why a policy feels fair to the people it hurts, or what a school owes the students it cannot reach.\n\nI edit the student paper, coach novice debaters, and spend an unreasonable amount of time in the public library archives.',
              facts: [
                { label: 'School', value: 'Riverside Academy' },
                { label: 'Graduating', value: 'Class of 2027' },
                { label: 'Focus', value: 'Politics & philosophy' },
                { label: 'Location', value: 'Atlanta, GA' },
              ],
            }),
            block('projects', {
              heading: 'Selected writing',
              intro: 'Longer pieces, published in the school paper and local outlets.',
              items: [
                {
                  title: 'The quiet cost of school security',
                  description:
                    'An investigation into how metal detectors changed the way students describe their own school. Three months of interviews.',
                  tags: 'Investigative, 2,400 words',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Who gets to be gifted?',
                  description:
                    'A data story on the demographics of advanced programs at our district’s five high schools.',
                  tags: 'Data journalism, Editorial',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Against the five-paragraph essay',
                  description:
                    'A defense of teaching writing as thinking, not formatting. Published in the state student journal.',
                  tags: 'Essay, Education',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('experience', {
              heading: 'Experience',
              items: [
                {
                  role: 'Editor-in-chief',
                  org: 'The Riverside Review',
                  period: '2025 — present',
                  detail:
                    'Lead a staff of 14, edit every issue, and run a fact-checking process that cut corrections in half.',
                },
                {
                  role: 'Novice debate coach',
                  org: 'Riverside Debate Society',
                  period: '2024 — present',
                  detail:
                    'Design practice drills and mentor first-year debaters through their first tournaments.',
                },
                {
                  role: 'Editorial intern',
                  org: 'Atlanta Community Press',
                  period: 'Summer 2026',
                  detail:
                    'Wrote and fact-checked local government coverage alongside a two-person desk.',
                },
              ],
            }),
            block('skills', {
              heading: 'Skills',
              groups: [
                {
                  name: 'Writing',
                  items: 'Investigative reporting, editorial, persuasive essays, copy editing',
                },
                { name: 'Research', items: 'Interviews, public records, spreadsheet analysis' },
                { name: 'Tools', items: 'InDesign, Google Sheets, Notion, WordPress' },
              ],
            }),
            block('achievements', {
              heading: 'Awards',
              items: [
                {
                  title: 'Gold Key, editorial writing',
                  issuer: 'Scholastic Art & Writing Awards',
                  year: '2026',
                  detail: '',
                },
                {
                  title: 'State finalist, extemporaneous debate',
                  issuer: 'State Debate League',
                  year: '2025',
                  detail: '',
                },
                {
                  title: 'Student journalist of the year',
                  issuer: 'Atlanta Community Press',
                  year: '2025',
                  detail: '',
                },
              ],
            }),
            block('testimonials', {
              heading: 'From my editors',
              items: [
                {
                  quote:
                    'Amara is the rare student editor who improves a sentence without flattening the writer’s voice.',
                  author: 'Judith Mbeki',
                  role: 'Faculty adviser, The Riverside Review',
                },
              ],
            }),
            block('contact', {
              heading: 'Let’s talk',
              subtitle:
                'Pitches, questions about a piece, or admissions conversations — email is best.',
              email: 'amara@example.com',
              location: 'Atlanta, GA',
              links: contactLinks,
            }),
            block('footer', { text: '© 2026 Amara Osei.', links: contactLinks }),
          ]),
          page('Writing', 'writing', [
            block('navbar', {
              logoText: 'Amara Osei',
              links: [
                { label: 'Home', href: 'home' },
                { label: 'Writing', href: 'writing' },
              ],
              ctaLabel: 'Contact',
              ctaHref: '#contact',
            }),
            block('text', {
              eyebrow: 'Writing',
              heading: 'A small archive',
              body: 'Selected pieces from the last two years. I am happy to send full clips, source notes, or the drafts behind any of them.',
            }),
            block('projects', {
              heading: 'Clips',
              items: [
                {
                  title: 'The quiet cost of school security',
                  description: 'Investigative feature, The Riverside Review.',
                  tags: 'Investigation',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Who gets to be gifted?',
                  description: 'Data story with district records and 30 family interviews.',
                  tags: 'Data journalism',
                  url: '#',
                  image: '',
                },
                {
                  title: 'The library as a third place',
                  description: 'A reported essay on the teenagers who stay until closing.',
                  tags: 'Feature',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('cta', {
              title: 'Want a full clip?',
              subtitle: 'I can send PDFs or links for any piece in the archive.',
              buttonText: 'Request clips',
              buttonHref: 'mailto:amara@example.com',
            }),
            block('footer', { text: '© 2026 Amara Osei.', links: contactLinks }),
          ]),
        ],
      }),
  },
  {
    id: 'studio-art',
    name: 'Visual Arts',
    description: 'Gallery-first, dark, and image-forward for studio art, photography, and design.',
    category: 'Arts',
    accent: '#c026d3',
    dark: true,
    build: () =>
      project({
        title: 'Noah Rivera — Studio Art',
        description: 'Painting, printmaking, and installation work by Noah Rivera.',
        accent: '#c026d3',
        slug: 'studio-art',
        dark: true,
        serif: true,
        pages: [
          page('Home', 'home', [
            block('navbar', {
              logoText: 'Noah Rivera',
              links: [
                { label: 'Work', href: 'work' },
                { label: 'About', href: '#about' },
              ],
              ctaLabel: 'Studio visits',
              ctaHref: '#contact',
            }),
            block('hero', {
              eyebrow: 'Class of 2027 · Studio art & printmaking',
              title: 'I make prints about the places we leave behind.',
              subtitle:
                'Linocut, screen print, and the occasional very large painting. Currently building a body of work about my grandmother’s neighborhood.',
              ctaText: 'See the work',
              ctaHref: 'work',
              secondaryText: 'About the practice',
              secondaryHref: '#about',
              align: 'split',
            }),
            block('gallery', {
              heading: 'Selected work',
              intro: '2025 — 2026. Ink, paper, and acrylic.',
              images: [
                { url: '', alt: 'Corner store, linocut' },
                { url: '', alt: 'Porch light, screen print' },
                { url: '', alt: 'Study for a block, ink on paper' },
                { url: '', alt: 'Installation view' },
                { url: '', alt: 'Detail, carved block' },
                { url: '', alt: 'Sketchbook spread' },
              ],
            }),
            block('about', {
              eyebrow: 'About',
              heading: 'A practice built on repetition',
              body: 'I started printing because paper was cheap and mistakes were useful. I still work in series: the same porch, the same corner store, printed until the image tells me something I did not know.\n\nMost of my work starts as a walk through my grandmother’s neighborhood and ends as a stack of proofs on the studio floor.',
              image: '',
              facts: [
                { label: 'School', value: 'Riverside Arts Academy' },
                { label: 'Graduating', value: 'Class of 2027' },
                { label: 'Mediums', value: 'Linocut, screen print, acrylic' },
                { label: 'Studio', value: 'Atlanta, GA' },
              ],
            }),
            block('projects', {
              heading: 'Series & exhibitions',
              items: [
                {
                  title: 'Porch Light (series)',
                  description:
                    'Eleven reduction linocuts about the houses on one block, shown at the spring student exhibition.',
                  tags: 'Linocut, 2026',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Aisle Nine',
                  description:
                    'A screen-printed zine and small installation about the corner store that closed in 2025.',
                  tags: 'Screen print, Installation',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('achievements', {
              heading: 'Recognition',
              items: [
                {
                  title: 'Gold Key, printmaking',
                  issuer: 'Scholastic Art & Writing Awards',
                  year: '2026',
                  detail: '',
                },
                {
                  title: 'Best in show',
                  issuer: 'Riverside Spring Exhibition',
                  year: '2025',
                  detail: 'Juried by the museum’s curatorial team.',
                },
              ],
            }),
            block('contact', {
              heading: 'Studio visits & commissions',
              subtitle: 'Happy to talk about prints, trades, or portfolio reviews.',
              email: 'noah@example.com',
              location: 'Atlanta, GA',
              links: [
                { label: 'Instagram', href: 'https://instagram.com' },
                { label: 'Email', href: 'mailto:noah@example.com' },
              ],
            }),
            block('footer', { text: '© 2026 Noah Rivera.', links: [] }),
          ]),
          page('Work', 'work', [
            block('navbar', {
              logoText: 'Noah Rivera',
              links: [
                { label: 'Work', href: 'work' },
                { label: 'About', href: 'home' },
              ],
              ctaLabel: 'Studio visits',
              ctaHref: '#contact',
            }),
            block('gallery', {
              heading: 'Archive',
              intro: 'Selected prints, studies, and installation documentation.',
              images: [
                { url: '', alt: 'Corner store, linocut' },
                { url: '', alt: 'Porch light, screen print' },
                { url: '', alt: 'Aisle nine, installation' },
                { url: '', alt: 'Study, ink on paper' },
                { url: '', alt: 'Carved block' },
                { url: '', alt: 'Proof stack' },
                { url: '', alt: 'Neighborhood walk, photo' },
                { url: '', alt: 'Zine spread' },
                { url: '', alt: 'Studio wall' },
              ],
            }),
            block('cta', {
              title: 'Come see it in person',
              subtitle:
                'The spring exhibition opens in May. I am also happy to arrange a studio visit.',
              buttonText: 'Get in touch',
              buttonHref: 'mailto:noah@example.com',
            }),
            block('footer', { text: '© 2026 Noah Rivera.', links: [] }),
          ]),
        ],
      }),
  },
  {
    id: 'founder',
    name: 'Entrepreneurship',
    description:
      'For students who build businesses, clubs, or products. Outcomes and traction first.',
    category: 'Business',
    accent: '#0f766e',
    build: () =>
      project({
        title: 'Sofia Marín — Builder Portfolio',
        description: 'Products, programs, and community work by Sofia Marín.',
        accent: '#0f766e',
        slug: 'ventures',
        pages: [
          page('Home', 'home', [
            block('navbar', {
              logoText: 'Sofia Marín',
              links: [
                { label: 'Ventures', href: 'ventures' },
                { label: 'About', href: '#about' },
              ],
              ctaLabel: 'Contact',
              ctaHref: '#contact',
            }),
            block('hero', {
              eyebrow: 'Class of 2027 · Chicago, IL',
              title: 'I build small things that solve a real, boring problem.',
              subtitle:
                'Founder of a resale marketplace for school uniforms and a summer program that teaches middle schoolers to ship their first product.',
              ctaText: 'See what I have built',
              ctaHref: 'ventures',
              secondaryText: 'How I work',
              secondaryHref: '#about',
              align: 'split',
            }),
            block('stats', {
              items: [
                { value: '2,400', label: 'Items resold' },
                { value: '$18k', label: 'Program budget raised' },
                { value: '120', label: 'Students served' },
                { value: '3', label: 'Ventures launched' },
              ],
            }),
            block('about', {
              eyebrow: 'About',
              heading: 'Start with the annoying problem',
              body: 'Uniform Swap started because my family had a closet full of blazers nobody needed. The first version was a spreadsheet and a group chat; now it is a marketplace with 900 active listings.\n\nI like the unglamorous parts: pickup logistics, pricing, the email that gets someone to reply.',
              facts: [
                { label: 'School', value: 'Northside College Prep' },
                { label: 'Graduating', value: 'Class of 2027' },
                { label: 'Focus', value: 'Entrepreneurship & operations' },
                { label: 'Location', value: 'Chicago, IL' },
              ],
            }),
            block('projects', {
              heading: 'Ventures',
              intro: 'Launched, measured, and still running.',
              items: [
                {
                  title: 'Uniform Swap',
                  description:
                    'A resale marketplace for school uniforms. 900 active listings, 2,400 items resold, and a pickup network across six schools.',
                  tags: 'Marketplace, Operations',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Ship It Summer',
                  description:
                    'A two-week program where middle schoolers build and launch a real website. Ran twice with 60 students and a waitlist.',
                  tags: 'Education, Program',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Local Ledger',
                  description:
                    'A free bookkeeping template and workshop series for neighborhood shops, used by 14 businesses.',
                  tags: 'Community, Tooling',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('experience', {
              heading: 'Experience',
              items: [
                {
                  role: 'Founder',
                  org: 'Uniform Swap',
                  period: '2024 — present',
                  detail:
                    'Built the first marketplace, recruited 900 listings, and negotiated pickup spots at six schools.',
                },
                {
                  role: 'Operations intern',
                  org: 'Neighborhood Business Alliance',
                  period: 'Summer 2026',
                  detail:
                    'Interviewed 30 shop owners about bookkeeping and turned the findings into a workshop series.',
                },
              ],
            }),
            block('skills', {
              heading: 'What I work with',
              groups: [
                { name: 'Building', items: 'Figma, Webflow, Airtable, Notion' },
                { name: 'Operations', items: 'Pricing, logistics, vendor management, budgeting' },
                { name: 'Talking to people', items: 'Interviews, cold outreach, facilitation' },
              ],
            }),
            block('testimonials', {
              heading: 'What partners say',
              items: [
                {
                  quote:
                    'Sofia is the only student I have worked with who asks about the pickup schedule before the pitch deck.',
                  author: 'Dana Whitfield',
                  role: 'Director, Neighborhood Business Alliance',
                },
              ],
            }),
            block('achievements', {
              heading: 'Recognition',
              items: [
                {
                  title: 'Regional finalist',
                  issuer: 'National Youth Entrepreneurship Challenge',
                  year: '2026',
                  detail: '',
                },
                {
                  title: 'Community impact grant',
                  issuer: 'Chicago Future Fund',
                  year: '2025',
                  detail: '$5,000 for Uniform Swap logistics.',
                },
              ],
            }),
            block('contact', {
              heading: 'Work with me',
              subtitle:
                'Open to mentors, partners, and anyone who has solved a resale logistics problem better than I have.',
              email: 'sofia@example.com',
              location: 'Chicago, IL',
              links: contactLinks,
            }),
            block('footer', { text: '© 2026 Sofia Marín.', links: contactLinks }),
          ]),
          page('Ventures', 'ventures', [
            block('navbar', {
              logoText: 'Sofia Marín',
              links: [
                { label: 'Ventures', href: 'ventures' },
                { label: 'About', href: 'home' },
              ],
              ctaLabel: 'Contact',
              ctaHref: '#contact',
            }),
            block('text', {
              eyebrow: 'Ventures',
              heading: 'What I have shipped',
              body: 'Every project below has a number attached, because the part I care about is whether it actually worked for someone.',
            }),
            block('projects', {
              heading: 'The details',
              items: [
                {
                  title: 'Uniform Swap',
                  description:
                    'Two-sided marketplace with listings, pickup coordination, and a donation flow for families who cannot pay.',
                  tags: 'Marketplace',
                  url: '#',
                  image: '',
                },
                {
                  title: 'Ship It Summer',
                  description:
                    'Curriculum, volunteer training, and a demo day. 60 students, 48 shipped sites, 12 returning volunteers.',
                  tags: 'Program',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('cta', {
              title: 'Have a problem worth solving?',
              subtitle:
                'I am always up for a conversation about operations, marketplaces, or teaching students to ship.',
              buttonText: 'Say hello',
              buttonHref: 'mailto:sofia@example.com',
            }),
            block('footer', { text: '© 2026 Sofia Marín.', links: contactLinks }),
          ]),
        ],
      }),
  },
  {
    id: 'athlete',
    name: 'Scholar-Athlete',
    description:
      'Training, academics, and leadership in one place. Built for college recruiting conversations.',
    category: 'Athletics',
    accent: '#b91c1c',
    build: () =>
      project({
        title: 'Ethan Park — Scholar-Athlete',
        description: 'Academic record, athletics, and leadership by Ethan Park.',
        accent: '#b91c1c',
        slug: 'track',
        pages: [
          page('Home', 'home', [
            block('navbar', {
              logoText: 'Ethan Park',
              links: [
                { label: 'Season', href: 'season' },
                { label: 'About', href: '#about' },
              ],
              ctaLabel: 'Contact',
              ctaHref: '#contact',
            }),
            block('hero', {
              eyebrow: 'Class of 2027 · 800m / 1600m',
              title: 'A runner who likes the spreadsheet as much as the starting line.',
              subtitle:
                'Varsity middle distance, 4:18 in the 1600m, and a biology student who tracks every workout in a notebook I built myself.',
              ctaText: 'Season log',
              ctaHref: 'season',
              secondaryText: 'About me',
              secondaryHref: '#about',
              align: 'split',
            }),
            block('stats', {
              items: [
                { value: '4:18', label: '1600m personal best' },
                { value: '1:56', label: '800m personal best' },
                { value: '3.92', label: 'Unweighted GPA' },
                { value: '3', label: 'Varsity letters' },
              ],
            }),
            block('about', {
              eyebrow: 'About me',
              heading: 'Discipline is a habit, not a personality',
              body: 'I started running to get faster at soccer and stayed because I liked the data. Now I train six days a week, captain the distance squad, and keep a training log that the younger runners actually use.\n\nIn the classroom I lean toward biology and statistics — the two subjects where careful observation pays off immediately.',
              facts: [
                { label: 'School', value: 'Lakeview High School' },
                { label: 'Graduating', value: 'Class of 2027' },
                { label: 'Events', value: '800m, 1600m, 4x800' },
                { label: 'Location', value: 'Madison, WI' },
              ],
            }),
            block('experience', {
              heading: 'Leadership',
              items: [
                {
                  role: 'Distance captain',
                  org: 'Lakeview Track & Field',
                  period: '2025 — present',
                  detail:
                    'Write weekly workouts with the coach and run a peer mentoring group for first-year runners.',
                },
                {
                  role: 'Volunteer coach',
                  org: 'Middle school running club',
                  period: '2024 — present',
                  detail:
                    'Lead twice-weekly practices for 25 students; built a simple progress tracker for the club.',
                },
              ],
            }),
            block('achievements', {
              heading: 'Athletic & academic honors',
              items: [
                {
                  title: 'Conference champion, 1600m',
                  issuer: 'Big Eight Conference',
                  year: '2026',
                  detail: '',
                },
                {
                  title: 'All-state, second team',
                  issuer: 'State Track & Field',
                  year: '2026',
                  detail: '',
                },
                {
                  title: 'Academic All-Conference',
                  issuer: 'Big Eight Conference',
                  year: '2025',
                  detail: 'Awarded for GPA and varsity participation.',
                },
              ],
            }),
            block('gallery', {
              heading: 'Season in photos',
              images: [
                { url: '', alt: 'Start line, conference finals' },
                { url: '', alt: 'Practice, Tuesday intervals' },
                { url: '', alt: 'Relay handoff' },
                { url: '', alt: 'Team after sectionals' },
              ],
            }),
            block('testimonials', {
              heading: 'From my coaches',
              items: [
                {
                  quote:
                    'Ethan is the first captain I have had who brings me data. He makes the whole squad more serious without making it less fun.',
                  author: 'Coach Dan Merrick',
                  role: 'Head track & field coach',
                },
              ],
            }),
            block('cta', {
              title: 'Recruiting? Let’s talk.',
              subtitle: 'Happy to share full race footage, transcripts, and a training log.',
              buttonText: 'Email me',
              buttonHref: 'mailto:ethan@example.com',
            }),
            block('contact', {
              heading: 'Contact',
              subtitle: 'Best reached by email. Coach Merrick can provide a reference.',
              email: 'ethan@example.com',
              location: 'Madison, WI',
              links: contactLinks,
            }),
            block('footer', { text: '© 2026 Ethan Park.', links: [] }),
          ]),
          page('Season', 'season', [
            block('navbar', {
              logoText: 'Ethan Park',
              links: [
                { label: 'Season', href: 'season' },
                { label: 'About', href: 'home' },
              ],
              ctaLabel: 'Contact',
              ctaHref: '#contact',
            }),
            block('text', {
              eyebrow: 'Season log',
              heading: '2026 outdoor season',
              body: 'A running record of races, personal bests, and what I am working on next. Updated after every meet.',
            }),
            block('projects', {
              heading: 'Races',
              items: [
                {
                  title: 'Conference finals — 1600m',
                  description:
                    'First place in 4:19.3. Went out controlled and moved at 600m to go.',
                  tags: '1st, 4:19.3',
                  url: '#',
                  image: '',
                },
                {
                  title: 'State prelims — 800m',
                  description:
                    'Advanced to finals with a 1:56.8. Splits were even; closing speed is the next focus.',
                  tags: 'Qualified, 1:56.8',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('achievements', {
              heading: 'Personal bests',
              items: [
                { title: '1600m', issuer: '4:18.2', year: '2026', detail: '' },
                { title: '800m', issuer: '1:56.1', year: '2026', detail: '' },
                { title: '5k (cross country)', issuer: '16:42', year: '2025', detail: '' },
              ],
            }),
            block('footer', { text: '© 2026 Ethan Park.', links: [] }),
          ]),
        ],
      }),
  },
  {
    id: 'cv',
    name: 'Academic CV',
    description:
      'Quiet, text-forward, and fast to fill in. For applications that need the facts, not the flourishes.',
    category: 'General',
    accent: '#334155',
    build: () =>
      project({
        title: 'Your Name — Academic CV',
        description: 'Academic record, activities, and awards.',
        accent: '#334155',
        slug: 'cv',
        serif: true,
        pages: [
          page('Home', 'home', [
            block('navbar', {
              logoText: 'Your Name',
              links: [{ label: 'CV', href: 'home' }],
              ctaLabel: 'Email',
              ctaHref: 'mailto:you@example.com',
            }),
            block('hero', {
              eyebrow: 'Class of 2027 · Your school',
              title: 'Your name, your focus, one clear sentence.',
              subtitle:
                'Use this space for the one-sentence version of you: what you study, what you have done, and where you are headed.',
              ctaText: 'Download CV',
              ctaHref: '#',
              secondaryText: 'Get in touch',
              secondaryHref: '#contact',
              align: 'center',
            }),
            block('education', {
              heading: 'Education',
              items: [
                {
                  school: 'Your High School',
                  degree: 'Diploma track',
                  period: '2023 — 2027',
                  detail: 'GPA 0.00 / 4.0 · AP courses · Honors',
                },
              ],
            }),
            block('experience', {
              heading: 'Experience & activities',
              items: [
                {
                  role: 'Role or activity',
                  org: 'Organization',
                  period: '2025 — present',
                  detail: 'What you did and what changed because of it.',
                },
              ],
            }),
            block('projects', {
              heading: 'Projects',
              items: [
                {
                  title: 'Your project',
                  description:
                    'A sentence on the problem, a sentence on what you built, a sentence on the result.',
                  tags: 'Skill, Skill',
                  url: '#',
                  image: '',
                },
              ],
            }),
            block('skills', {
              heading: 'Skills',
              groups: [
                { name: 'Technical', items: 'Skill one, Skill two' },
                { name: 'Languages', items: 'English, Spanish' },
              ],
            }),
            block('achievements', {
              heading: 'Awards',
              items: [
                { title: 'Award name', issuer: 'Issuing organization', year: '2026', detail: '' },
              ],
            }),
            block('contact', {
              heading: 'Contact',
              subtitle: 'Email is the fastest way to reach me.',
              email: 'you@example.com',
              location: 'City, State',
              links: contactLinks,
            }),
            block('footer', { text: '© 2026 Your Name.', links: [] }),
          ]),
        ],
      }),
  },
  {
    id: 'blank',
    name: 'Blank canvas',
    description: 'An empty page with just a header and a hero. Build it your way.',
    category: 'General',
    accent: '#2f6f4e',
    build: () =>
      project({
        title: 'Untitled portfolio',
        description: 'A new student portfolio.',
        accent: '#2f6f4e',
        slug: 'portfolio',
        pages: [
          page('Home', 'home', [
            block('navbar', {
              logoText: 'Your Name',
              links: [{ label: 'About', href: '#about' }],
              ctaLabel: 'Contact',
              ctaHref: '#contact',
            }),
            block('hero', {
              eyebrow: 'Class of 2027',
              title: 'Your website starts here',
              subtitle:
                'Write a short introduction, then add sections from the left panel or ask the assistant.',
              ctaText: 'About me',
              ctaHref: '#about',
              secondaryText: '',
              secondaryHref: '',
              align: 'center',
            }),
            block('about', {
              eyebrow: 'About me',
              heading: 'A little about you',
              body: 'Tell visitors what you study, what you care about, and what you are working on right now.',
              facts: [
                { label: 'School', value: 'Your school' },
                { label: 'Graduating', value: 'Class of 2027' },
              ],
            }),
            block('contact', {
              heading: 'Get in touch',
              subtitle: 'Add the best way to reach you.',
              email: 'you@example.com',
              location: '',
              links: [],
            }),
            block('footer', { text: '© 2026 Your Name.', links: [] }),
          ]),
        ],
      }),
  },
];

export function getTemplate(id: string): SiteTemplate | undefined {
  return SITE_TEMPLATES.find((template) => template.id === id);
}
