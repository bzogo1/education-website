import { newId, slugify } from './project';
import type { BlockType, SiteBlock, SitePage } from './types';

export type BlockCategory =
  | 'Structure'
  | 'Intro'
  | 'Academics'
  | 'Showcase'
  | 'Contact'
  | 'Marketing';

export interface FieldSpec {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'select' | 'items';
  placeholder?: string;
  options?: { label: string; value: string }[];
  itemFields?: { key: string; label: string; type: 'text' | 'textarea' | 'url' }[];
  itemLabelKey?: string;
  newItem?: () => Record<string, unknown>;
}

export interface BlockDef {
  type: BlockType;
  label: string;
  description: string;
  category: BlockCategory;
  icon: string;
  defaults: () => Record<string, unknown>;
  fields: FieldSpec[];
}

const LINK_FIELDS: FieldSpec = {
  key: 'links',
  label: 'Links',
  type: 'items',
  itemFields: [
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'href', label: 'Link or #anchor', type: 'text' },
  ],
  itemLabelKey: 'label',
  newItem: () => ({ label: 'New link', href: '#' }),
};

export const BLOCK_CATALOG: BlockDef[] = [
  {
    type: 'navbar',
    label: 'Navigation',
    description: 'Sticky header with your name and page links',
    category: 'Structure',
    icon: 'Menu',
    defaults: () => ({
      logoText: 'Your Name',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Work', href: '#projects' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaLabel: 'Resume',
      ctaHref: '#',
    }),
    fields: [
      { key: 'logoText', label: 'Name in header', type: 'text' },
      LINK_FIELDS,
      { key: 'ctaLabel', label: 'Button label', type: 'text' },
      { key: 'ctaHref', label: 'Button link', type: 'text' },
    ],
  },
  {
    type: 'hero',
    label: 'Hero',
    description: 'The first thing admissions sees — your name, focus, and pitch',
    category: 'Intro',
    icon: 'Sparkles',
    defaults: () => ({
      eyebrow: 'Grade 12 · Lincoln High School',
      title: 'Hi, I’m Your Name — I build things with code and curiosity',
      subtitle:
        'A short introduction: what you study, what you care about, and what you are working on right now.',
      ctaText: 'View my work',
      ctaHref: '#projects',
      secondaryText: 'Get in touch',
      secondaryHref: '#contact',
      portrait: '',
      align: 'split',
    }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow / status line', type: 'text' },
      { key: 'title', label: 'Headline', type: 'textarea' },
      { key: 'subtitle', label: 'Intro paragraph', type: 'textarea' },
      { key: 'ctaText', label: 'Primary button', type: 'text' },
      { key: 'ctaHref', label: 'Primary link', type: 'text' },
      { key: 'secondaryText', label: 'Secondary button', type: 'text' },
      { key: 'secondaryHref', label: 'Secondary link', type: 'text' },
      { key: 'portrait', label: 'Portrait image URL', type: 'url' },
      {
        key: 'align',
        label: 'Layout',
        type: 'select',
        options: [
          { label: 'Image right', value: 'split' },
          { label: 'Centered', value: 'center' },
        ],
      },
    ],
  },
  {
    type: 'stats',
    label: 'Statistics',
    description: 'A quick row of numbers: GPA, awards, hours, members',
    category: 'Intro',
    icon: 'BarChart3',
    defaults: () => ({
      items: [
        { value: '3.98', label: 'Unweighted GPA' },
        { value: '1480', label: 'SAT score' },
        { value: '6', label: 'AP courses' },
        { value: '2', label: 'Research projects' },
      ],
    }),
    fields: [
      {
        key: 'items',
        label: 'Statistics',
        type: 'items',
        itemFields: [
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
        itemLabelKey: 'label',
        newItem: () => ({ value: '0', label: 'New stat' }),
      },
    ],
  },
  {
    type: 'about',
    label: 'About me',
    description: 'A short story, a portrait, and the facts that matter',
    category: 'Intro',
    icon: 'UserRound',
    defaults: () => ({
      heading: 'About me',
      eyebrow: 'The short version',
      body: 'I am a student who likes hard problems, good questions, and work that reaches real people. Most of my time goes into my coursework, my research project, and the clubs I help run.\n\nOutside of school you will find me reading, running, or teaching myself something new.',
      image: '',
      facts: [
        { label: 'School', value: 'Lincoln High School' },
        { label: 'Graduating', value: 'Class of 2027' },
        { label: 'Focus', value: 'Computer science & biology' },
        { label: 'Location', value: 'Portland, OR' },
      ],
    }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Your story', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'url' },
      {
        key: 'facts',
        label: 'Quick facts',
        type: 'items',
        itemFields: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'value', label: 'Value', type: 'text' },
        ],
        itemLabelKey: 'label',
        newItem: () => ({ label: 'Fact', value: 'Value' }),
      },
    ],
  },
  {
    type: 'education',
    label: 'Education',
    description: 'Schools, programs, and coursework with dates',
    category: 'Academics',
    icon: 'GraduationCap',
    defaults: () => ({
      heading: 'Education',
      intro: 'Where I study and what I have taken.',
      items: [
        {
          school: 'Lincoln High School',
          degree: 'High school diploma · STEM honors track',
          period: '2023 — 2027',
          detail: 'GPA 3.98 / 4.0 · 7 AP courses · National Honor Society',
        },
      ],
    }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro line', type: 'text' },
      {
        key: 'items',
        label: 'Education entries',
        type: 'items',
        itemFields: [
          { key: 'school', label: 'School / program', type: 'text' },
          { key: 'degree', label: 'Degree or track', type: 'text' },
          { key: 'period', label: 'Dates', type: 'text' },
          { key: 'detail', label: 'Details', type: 'textarea' },
        ],
        itemLabelKey: 'school',
        newItem: () => ({
          school: 'School name',
          degree: 'Program',
          period: '2024 — 2028',
          detail: '',
        }),
      },
    ],
  },
  {
    type: 'experience',
    label: 'Experience',
    description: 'Timeline of internships, jobs, and leadership roles',
    category: 'Academics',
    icon: 'Briefcase',
    defaults: () => ({
      heading: 'Experience',
      intro: 'Places where I have learned by doing.',
      items: [
        {
          role: 'Research assistant',
          org: 'University biology lab',
          period: 'Summer 2026',
          detail: 'Analyzed sequencing data in Python and presented weekly findings to the lab.',
        },
        {
          role: 'Founder',
          org: 'Peer tutoring collective',
          period: '2025 — present',
          detail: 'Started a free tutoring program that now serves 40 students each week.',
        },
      ],
    }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro line', type: 'text' },
      {
        key: 'items',
        label: 'Roles',
        type: 'items',
        itemFields: [
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'org', label: 'Organization', type: 'text' },
          { key: 'period', label: 'Dates', type: 'text' },
          { key: 'detail', label: 'What you did', type: 'textarea' },
        ],
        itemLabelKey: 'role',
        newItem: () => ({ role: 'Role', org: 'Organization', period: '2026', detail: '' }),
      },
    ],
  },
  {
    type: 'projects',
    label: 'Projects',
    description: 'Case-study cards for research, builds, and creative work',
    category: 'Showcase',
    icon: 'FolderKanban',
    defaults: () => ({
      heading: 'Selected projects',
      intro: 'Work I am proud of, with the details that matter.',
      items: [
        {
          title: 'Protein folding visualizer',
          description:
            'A browser tool that turns PDB files into interactive 3D models for classroom demonstrations.',
          tags: 'Python, Three.js, Research',
          url: '#',
          image: '',
        },
        {
          title: 'Peer tutoring platform',
          description:
            'Matched 40 students with volunteer tutors and cut no-shows by half with text reminders.',
          tags: 'Next.js, Postgres, Community',
          url: '#',
          image: '',
        },
      ],
    }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro line', type: 'text' },
      {
        key: 'items',
        label: 'Projects',
        type: 'items',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
          { key: 'url', label: 'Link', type: 'text' },
          { key: 'image', label: 'Cover image URL', type: 'url' },
        ],
        itemLabelKey: 'title',
        newItem: () => ({
          title: 'New project',
          description: 'What you built and what changed because of it.',
          tags: '',
          url: '#',
          image: '',
        }),
      },
    ],
  },
  {
    type: 'skills',
    label: 'Skills',
    description: 'Grouped skills and tools, shown as chips',
    category: 'Academics',
    icon: 'Wrench',
    defaults: () => ({
      heading: 'Skills & tools',
      intro: '',
      groups: [
        { name: 'Languages', items: 'Python, JavaScript, TypeScript, SQL' },
        { name: 'Science', items: 'PCR, microscopy, data analysis' },
        { name: 'Tools', items: 'Git, Figma, LaTeX, Excel' },
      ],
    }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro line', type: 'text' },
      {
        key: 'groups',
        label: 'Skill groups',
        type: 'items',
        itemFields: [
          { key: 'name', label: 'Group name', type: 'text' },
          { key: 'items', label: 'Skills (comma separated)', type: 'textarea' },
        ],
        itemLabelKey: 'name',
        newItem: () => ({ name: 'Group', items: 'Skill one, Skill two' }),
      },
    ],
  },
  {
    type: 'achievements',
    label: 'Achievements',
    description: 'Awards, honors, and recognitions in a clean list',
    category: 'Academics',
    icon: 'Award',
    defaults: () => ({
      heading: 'Awards & honors',
      intro: '',
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
      ],
    }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro line', type: 'text' },
      {
        key: 'items',
        label: 'Achievements',
        type: 'items',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'issuer', label: 'Issuer', type: 'text' },
          { key: 'year', label: 'Year', type: 'text' },
          { key: 'detail', label: 'Detail', type: 'textarea' },
        ],
        itemLabelKey: 'title',
        newItem: () => ({ title: 'Award', issuer: '', year: '2026', detail: '' }),
      },
    ],
  },
  {
    type: 'gallery',
    label: 'Gallery',
    description: 'Photo grid for art, fieldwork, or events',
    category: 'Showcase',
    icon: 'Images',
    defaults: () => ({
      heading: 'Gallery',
      intro: '',
      images: [
        { url: '', alt: 'Studio work' },
        { url: '', alt: 'Fieldwork' },
        { url: '', alt: 'Exhibition' },
        { url: '', alt: 'Process' },
        { url: '', alt: 'Detail' },
        { url: '', alt: 'Installation' },
      ],
    }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro line', type: 'text' },
      {
        key: 'images',
        label: 'Images',
        type: 'items',
        itemFields: [
          { key: 'url', label: 'Image URL', type: 'url' },
          { key: 'alt', label: 'Caption', type: 'text' },
        ],
        itemLabelKey: 'alt',
        newItem: () => ({ url: '', alt: 'New image' }),
      },
    ],
  },
  {
    type: 'testimonials',
    label: 'Recommendations',
    description: 'Quotes from teachers, mentors, and coaches',
    category: 'Showcase',
    icon: 'Quote',
    defaults: () => ({
      heading: 'Recommendations',
      intro: '',
      items: [
        {
          quote:
            'One of the most self-directed students I have taught. She asks the question the rest of the class misses.',
          author: 'Dr. Elena Ruiz',
          role: 'AP Biology teacher',
        },
        {
          quote:
            'He treats every project like it will be used by real people — because he makes sure it is.',
          author: 'Marcus Bell',
          role: 'Robotics coach',
        },
      ],
    }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro line', type: 'text' },
      {
        key: 'items',
        label: 'Quotes',
        type: 'items',
        itemFields: [
          { key: 'quote', label: 'Quote', type: 'textarea' },
          { key: 'author', label: 'Name', type: 'text' },
          { key: 'role', label: 'Role', type: 'text' },
        ],
        itemLabelKey: 'author',
        newItem: () => ({ quote: '', author: 'Name', role: 'Teacher' }),
      },
    ],
  },
  {
    type: 'text',
    label: 'Text',
    description: 'A heading and a block of writing',
    category: 'Academics',
    icon: 'Type',
    defaults: () => ({
      heading: 'A little more context',
      eyebrow: '',
      body: 'Use this section for an essay excerpt, a longer explanation of your research, or anything that needs room to breathe. Line breaks are preserved.',
    }),
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
    ],
  },
  {
    type: 'image',
    label: 'Image',
    description: 'A single wide image with a caption',
    category: 'Showcase',
    icon: 'Image',
    defaults: () => ({ url: '', alt: 'Project photo', caption: '' }),
    fields: [
      { key: 'url', label: 'Image URL', type: 'url' },
      { key: 'alt', label: 'Alt text', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'text' },
    ],
  },
  {
    type: 'cta',
    label: 'Call to action',
    description: 'A full-width panel with one clear next step',
    category: 'Contact',
    icon: 'MousePointerClick',
    defaults: () => ({
      title: 'Want to talk about a project?',
      subtitle: 'I am always happy to hear from teachers, mentors, and other students.',
      buttonText: 'Email me',
      buttonHref: '#contact',
    }),
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'subtitle', label: 'Supporting line', type: 'textarea' },
      { key: 'buttonText', label: 'Button label', type: 'text' },
      { key: 'buttonHref', label: 'Button link', type: 'text' },
    ],
  },
  {
    type: 'contact',
    label: 'Contact',
    description: 'Email, location, and links for admissions teams',
    category: 'Contact',
    icon: 'Mail',
    defaults: () => ({
      heading: 'Get in touch',
      subtitle:
        'I am happy to share more about my work, send a transcript, or answer questions from admissions teams.',
      email: 'you@example.com',
      location: 'Portland, OR',
      links: [
        { label: 'LinkedIn', href: '#' },
        { label: 'GitHub', href: '#' },
      ],
    }),
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subtitle', label: 'Supporting line', type: 'textarea' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      LINK_FIELDS,
    ],
  },
  {
    type: 'footer',
    label: 'Footer',
    description: 'Closing bar with your name and links',
    category: 'Structure',
    icon: 'PanelBottom',
    defaults: () => ({
      text: '© 2026 Your Name. Built for the Class of 2027.',
      links: [
        { label: 'Email', href: '#' },
        { label: 'LinkedIn', href: '#' },
      ],
    }),
    fields: [{ key: 'text', label: 'Copyright line', type: 'textarea' }, LINK_FIELDS],
  },
  {
    type: 'features',
    label: 'Highlights',
    description: 'Three or four short highlights in a grid',
    category: 'Marketing',
    icon: 'LayoutGrid',
    defaults: () => ({
      title: 'Highlights',
      subtitle: '',
      items: [
        { title: 'Research', text: 'Two years in a computational biology lab.' },
        { title: 'Leadership', text: 'Founder of a 40-student tutoring program.' },
        { title: 'Community', text: 'Volunteer coach for middle school robotics.' },
      ],
    }),
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      { key: 'subtitle', label: 'Intro line', type: 'text' },
      {
        key: 'items',
        label: 'Highlights',
        type: 'items',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Text', type: 'textarea' },
        ],
        itemLabelKey: 'title',
        newItem: () => ({ title: 'Highlight', text: '' }),
      },
    ],
  },
  {
    type: 'pricing',
    label: 'Pricing',
    description: 'Service tiers, for tutoring or freelance work',
    category: 'Marketing',
    icon: 'CreditCard',
    defaults: () => ({
      title: 'Tutoring',
      plans: [
        {
          name: 'Single session',
          price: '$25',
          features: ['60 minutes', 'Any STEM subject'],
          ctaText: 'Book',
        },
        {
          name: 'Monthly',
          price: '$80',
          features: ['4 sessions', 'Homework support'],
          ctaText: 'Book',
        },
      ],
    }),
    fields: [
      { key: 'title', label: 'Heading', type: 'text' },
      {
        key: 'plans',
        label: 'Plans',
        type: 'items',
        itemFields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'price', label: 'Price', type: 'text' },
          { key: 'features', label: 'Features (comma separated)', type: 'textarea' },
          { key: 'ctaText', label: 'Button label', type: 'text' },
        ],
        itemLabelKey: 'name',
        newItem: () => ({ name: 'Plan', price: '$0', features: '', ctaText: 'Choose' }),
      },
    ],
  },
];

export function getBlockDef(type: BlockType): BlockDef | undefined {
  return BLOCK_CATALOG.find((def) => def.type === type);
}

export function makeBlock(type: BlockType): SiteBlock {
  const def = getBlockDef(type);
  return { id: newId('b'), type, props: def ? def.defaults() : {} };
}

export function makePage(name: string, slug: string): SitePage {
  return { id: newId('page'), name, slug: slug || slugify(name), blocks: [] };
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  'Structure',
  'Intro',
  'Academics',
  'Showcase',
  'Contact',
  'Marketing',
];
