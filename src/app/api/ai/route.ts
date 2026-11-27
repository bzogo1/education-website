import { NextRequest, NextResponse } from 'next/server';
import { BLOCK_CATALOG, makeBlock } from '@/lib/site/blocks';
import { getTemplate } from '@/lib/site/templates';
import { newId, normalizeProject, slugify } from '@/lib/site/project';
import type { BlockType, SiteProject } from '@/lib/site/types';

export const runtime = 'nodejs';

interface AiRequest {
  mode: 'create' | 'edit';
  message: string;
  document?: SiteProject;
}

const BLOCK_SPEC = BLOCK_CATALOG.map((block) => {
  const fields = block.fields.map((field) => field.key).join(', ');
  return `- "${block.type}" (${block.label}): ${block.description}. Props: ${fields}`;
}).join('\n');

const SYSTEM_PROMPT = `You are Folio, a website builder for high-school students creating academic portfolios for college admissions. You output ONLY valid JSON, no markdown.

A site is a JSON object:
{
  "title": string,
  "description": string,
  "accent": "#2f6f4e" (hex),
  "theme": { "mode": "light" | "dark", "font": "sans" | "serif" },
  "pages": [{ "id": string, "name": string, "slug": string, "blocks": SiteBlock[] }]
}
SiteBlock = { "id": string, "type": BlockType, "props": object }

Available block types and the props they accept:
${BLOCK_SPEC}

Prop shapes:
- links: [{ "label": string, "href": string }]
- education items: [{ "school", "degree", "period", "detail" }]
- experience items: [{ "role", "org", "period", "detail" }]
- projects items: [{ "title", "description", "tags" (comma separated), "url", "image" }]
- achievements items: [{ "title", "issuer", "year", "detail" }]
- skills groups: [{ "name", "items" (comma separated) }]
- stats items: [{ "value", "label" }]
- gallery images: [{ "url", "alt" }]
- recommendations items: [{ "quote", "author", "role" }]
- about facts: [{ "label", "value" }]

Rules:
- Write specific, believable student content. Never use lorem ipsum or "Feature one".
- Use real-sounding academic details: GPA, AP courses, projects with outcomes, awards with years.
- Keep ids unique short strings like "b1", "b2", "p1".
- Page slugs are lowercase with hyphens. The first page slug is "home".
- Anchor values like "#projects" and page slugs like "research" are both valid hrefs.
- For edits, return the COMPLETE updated site (all pages, all blocks), applying the request.
- Respond with JSON: { "reply": "one short friendly sentence", "site": <site object> }`;

function siteSchemaOk(site: unknown): site is SiteProject {
  if (!site || typeof site !== 'object') return false;
  const candidate = site as SiteProject;
  return typeof candidate.title === 'string' && Array.isArray(candidate.pages) && candidate.pages.length > 0;
}

/* --------------------------- rule based fallback -------------------------- */

const BLOCK_KEYWORDS: [RegExp, BlockType][] = [
  [/recommendation|testimonial|reference/i, 'testimonials'],
  [/award|honor|achievement|recognition/i, 'achievements'],
  [/education|school|coursework|gpa/i, 'education'],
  [/experience|internship|job|leadership/i, 'experience'],
  [/project|portfolio piece|research/i, 'projects'],
  [/skill|tool|language/i, 'skills'],
  [/stat|number|gpa line/i, 'stats'],
  [/gallery|photo|image grid/i, 'gallery'],
  [/about|bio|story/i, 'about'],
  [/contact|email|reach/i, 'contact'],
  [/hero|headline|banner/i, 'hero'],
  [/nav/i, 'navbar'],
  [/footer/i, 'footer'],
  [/cta|call to action/i, 'cta'],
];

function guessBlockType(message: string): BlockType | null {
  for (const [pattern, type] of BLOCK_KEYWORDS) {
    if (pattern.test(message)) return type;
  }
  return null;
}

function templateForPrompt(message: string): string {
  const text = message.toLowerCase();
  if (/art|paint|design|photo|illustrat|studio|portfolio of my work/.test(text)) return 'studio-art';
  if (/writ|essay|journal|humanities|politic|philosoph|debate|english/.test(text)) return 'humanities';
  if (/business|startup|founder|entrepreneur|market|sell|shop/.test(text)) return 'founder';
  if (/athlete|track|run|cross country|sport|recruit|swim|basketball|soccer/.test(text)) return 'athlete';
  if (/cv|resume|academic record/.test(text)) return 'cv';
  if (/research|science|stem|lab|biology|chemistry|physics|math|computer|code|robotic/.test(text))
    return 'research';
  return 'blank';
}

function replaceInValue(value: unknown, from: string, to: string): unknown {
  if (typeof value === 'string') return value.split(from).join(to);
  if (Array.isArray(value)) return value.map((item) => replaceInValue(item, from, to));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        replaceInValue(entry, from, to),
      ])
    );
  }
  return value;
}

function personalize(project: SiteProject, message: string, suffix: string): SiteProject {
  const nameMatch = message.match(
    /(?:\bnamed\b|\bcalled\b|\bfor\b|\bby\b)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/
  );
  if (!nameMatch) return project;

  const name = nameMatch[1].trim();
  const previous =
    (project.pages[0]?.blocks.find((block) => block.type === 'navbar')?.props.logoText as
      | string
      | undefined) ?? '';
  const previousFirst = previous.split(' ')[0];
  const firstName = name.split(' ')[0];

  const rename = (value: unknown): unknown => {
    let next = value;
    if (previous && previous !== name) next = replaceInValue(next, previous, name);
    if (previousFirst && previousFirst !== firstName && previousFirst !== previous) {
      next = replaceInValue(next, previousFirst, firstName);
    }
    return next;
  };

  return {
    ...project,
    title: `${name} — ${suffix}`,
    description: project.description ? String(rename(project.description)) : project.description,
    pages: project.pages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) => ({
        ...block,
        props: rename(block.props) as Record<string, unknown>,
      })),
    })),
  };
}

function fallbackCreate(message: string): SiteProject {
  const template = getTemplate(templateForPrompt(message)) ?? getTemplate('blank')!;
  const project = personaliseBuild(template.build(), message, template.name);
  project.source = 'ai';

  const wanted = BLOCK_KEYWORDS.filter(([pattern]) => pattern.test(message)).map(([, type]) => type);
  const firstPage = project.pages[0];
  if (firstPage) {
    const existing = new Set(firstPage.blocks.map((block) => block.type));
    const extras = wanted.filter((type) => !existing.has(type)).map((type) => makeBlock(type));
    if (extras.length > 0) {
      const footerIndex = firstPage.blocks.findIndex((block) => block.type === 'footer');
      firstPage.blocks.splice(footerIndex === -1 ? firstPage.blocks.length : footerIndex, 0, ...extras);
    }
  }
  return project;
}

function personaliseBuild(project: SiteProject, message: string, suffix: string): SiteProject {
  return personalize(project, message, suffix);
}

function fallbackEdit(document: SiteProject, message: string): SiteProject {
  const site: SiteProject = normalizeProject(JSON.parse(JSON.stringify(document)));
  const page = site.pages[0];
  if (!page) return site;
  const notes: string[] = [];

  const themeMatch = message.match(/\b(dark|light)\s*(?:mode|theme)\b/i);
  if (themeMatch) {
    site.theme = { ...site.theme, mode: themeMatch[1].toLowerCase() as 'dark' | 'light' };
    notes.push(`Switched to ${themeMatch[1].toLowerCase()} mode.`);
  }

  if (/\bserif\b/i.test(message)) {
    site.theme = { ...site.theme, font: 'serif' };
    notes.push('Set headings to serif.');
  } else if (/sans[- ]?serif|sans\b/i.test(message)) {
    site.theme = { ...site.theme, font: 'sans' };
    notes.push('Set headings to sans-serif.');
  }

  const accentMatch = message.match(/(?:accent|colour|color)[^#]*(#[0-9a-f]{6})/i);
  if (accentMatch) {
    site.accent = accentMatch[1];
    notes.push('Updated the accent colour.');
  }

  const heroMatch = message.match(
    /(?:change|set|update|rewrite)\s+(?:the\s+)?hero\s+(?:title|heading|headline)\s+to\s+["']?([^"'.]+)["']?/i
  );
  if (heroMatch) {
    const hero = page.blocks.find((block) => block.type === 'hero');
    if (hero) {
      hero.props.title = heroMatch[1].trim();
      notes.push('Rewrote the hero headline.');
    }
  }

  const titleMatch = message.match(
    /(?:change|set|rename)\s+(?:the\s+)?(?:site\s+)?title\s+to\s+["']?([^"'.]+)["']?/i
  );
  if (titleMatch) {
    site.title = titleMatch[1].trim();
    notes.push(`Renamed the site to “${site.title}”.`);
  }

  const removeMatch = message.match(
    /(?:remove|delete)\s+(?:the\s+|my\s+)?([\w\s-]+?)(?:\s+(?:section|block))?\.?$/i
  );
  if (removeMatch && /\b(remove|delete)\b/i.test(message)) {
    const type = guessBlockType(removeMatch[1]);
    if (type) {
      const index = page.blocks.map((block) => block.type).lastIndexOf(type);
      if (index !== -1) {
        page.blocks.splice(index, 1);
        notes.push(`Removed the ${type} section.`);
      }
    }
  }

  if (notes.length === 0) {
    const type = guessBlockType(message);
    if (type && /\b(add|include|create|put)\b/i.test(message)) {
      const block = makeBlock(type);
      const footerIndex = page.blocks.findIndex((candidate) => candidate.type === 'footer');
      page.blocks.splice(footerIndex === -1 ? page.blocks.length : footerIndex, 0, block);
      notes.push(`Added a ${type} section.`);
    }
  }

  if (notes.length === 0) {
    const textBlock = makeBlock('text');
    textBlock.props.heading = message.slice(0, 70);
    textBlock.props.body = message;
    page.blocks.push(textBlock);
    notes.push('Added your message as a text section.');
  }

  return site;
}

/* --------------------------------- route ---------------------------------- */

export async function POST(request: NextRequest) {
  let body: AiRequest;
  try {
    body = (await request.json()) as AiRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : '';
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = (process.env.AI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.AI_MODEL ?? 'gpt-4o-mini';

  if (apiKey) {
    try {
      const userContent =
        body.mode === 'edit' && body.document
          ? `Current site JSON:\n${JSON.stringify(body.document)}\n\nUser request: ${message}`
          : `User request: ${message}`;

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userContent },
          ],
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as { reply?: string; site?: unknown };
          if (siteSchemaOk(parsed.site)) {
            const candidate = parsed.site as Partial<SiteProject> & { id?: string };
            const site = normalizeProject({ ...candidate, id: candidate.id ?? newId('p') });
            if (!site.slug) site.slug = slugify(site.title);
            return NextResponse.json({
              reply: typeof parsed.reply === 'string' ? parsed.reply : 'Done!',
              site,
              engine: 'llm',
            });
          }
        }
      } else {
        const errorText = await res.text();
        console.error('AI provider error', res.status, errorText.slice(0, 300));
      }
    } catch (error) {
      console.error('AI request failed', error);
    }
  }

  if (body.mode === 'edit' && body.document && siteSchemaOk(body.document)) {
    const site = fallbackEdit(body.document, message);
    return NextResponse.json({
      reply: 'Updated your site. Add AI_API_KEY to .env.local for richer, model-written copy.',
      site,
      engine: 'rules',
    });
  }

  const site = fallbackCreate(message);
  return NextResponse.json({
    reply: `I built “${site.title}” for you. Open it to keep editing. Add AI_API_KEY to .env.local for richer, model-written copy.`,
    site,
    engine: 'rules',
  });
}
