import { slugify } from './project';
import type { BlockType, SiteBlock, SitePage, SiteProject } from './types';

export interface CompileOptions {
  /** Public path of the site, e.g. /u/maya-chen/research-portfolio. */
  basePath?: string;
  /** Preview mode: disable navigation inside the iframe. */
  preview?: boolean;
  /** Report block clicks to the parent so the editor can open its inspector. */
  selectable?: boolean;
  /** Absolute origin used for canonical and Open Graph tags. */
  siteUrl?: string;
}

interface RenderContext {
  project: SiteProject;
  activePage: SitePage;
  options: CompileOptions;
}

const esc = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const str = (v: unknown, fallback = ''): string =>
  typeof v === 'string' && v.trim().length > 0 ? v : fallback;

const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

type Row = Record<string, unknown>;

const rows = (v: unknown): Row[] => arr<Row>(v).filter((r) => r && typeof r === 'object');

/** Accepts both "a, b" and ["a", "b"] so AI output never loses a list. */
const csv = (v: unknown): string => {
  if (Array.isArray(v)) return v.map((item) => String(item ?? '').trim()).filter(Boolean).join(', ');
  return typeof v === 'string' ? v : '';
};

function initials(text: string): string {
  const clean = text.replace(/[^A-Za-z\s.'-]/g, ' ').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '✳';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function inkFor(hex: string): string {
  const value = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!value) return '#ffffff';
  const int = parseInt(value[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#141310' : '#ffffff';
}

function pageHref(slug: string, ctx: RenderContext): string {
  if (!ctx.options.basePath) return '#';
  const pages = ctx.project.pages;
  const first = pages[0];
  const match = pages.find((p) => p.slug === slug || slugify(p.name) === slug);
  if (!match || match.id === first?.id) return ctx.options.basePath;
  return `${ctx.options.basePath}/${match.slug}`;
}

/** Blocks javascript:, data: and other executable URL schemes. */
function safeUrl(value: string): string {
  const url = value.trim();
  if (!url) return '';
  if (/^(?:https?:|mailto:|tel:|\/\/|\/|\.|#)/i.test(url)) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return '';
  return url;
}

function safeImageUrl(value: string): string {
  const url = value.trim();
  if (!url) return '';
  if (/^(?:https?:|\/\/|\/|\.)/i.test(url)) return url;
  if (/^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i.test(url)) return url;
  return '';
}

function renderHref(href: string, ctx: RenderContext): string {
  const value = href.trim();
  if (!value || value === '#') return '#';
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return safeUrl(value) || '#';
  if (value.startsWith('/') || value.startsWith('#')) return value;
  return pageHref(value.replace(/^\.?\//, '').replace(/\/+$/, ''), ctx);
}

function imageHtml(url: string, alt: string, extraClass = ''): string {
  const source = safeImageUrl(url);
  if (!source) {
    return `<div class="media-ph ${extraClass}" role="img" aria-label="${esc(alt || 'Image')}"><span class="media-initial">${esc(initials(alt))}</span></div>`;
  }
  return `<img class="${extraClass}" src="${esc(source)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`;
}

function portraitHtml(url: string, name: string): string {
  const source = safeImageUrl(url);
  if (!source) {
    return `<div class="media-ph portrait-ph" role="img" aria-label="${esc(name)}"><span class="media-initial">${esc(initials(name))}</span></div>`;
  }
  return `<img src="${esc(source)}" alt="${esc(name)}" loading="lazy" decoding="async" />`;
}

function eyebrow(text: string): string {
  return text ? `<p class="eyebrow">${esc(text)}</p>` : '';
}

function sectionHead(p: Row, ctx: RenderContext, fallbackTitle: string): string {
  const heading = str(p.heading, str(p.title, fallbackTitle));
  const intro = str(p.intro, str(p.subtitle));
  if (!heading && !intro) return '';
  return `<div class="section-head">
    ${eyebrow(str(p.eyebrow))}
    ${heading ? `<h2 class="section-title">${esc(heading)}</h2>` : ''}
    ${intro ? `<p class="section-lead">${esc(intro)}</p>` : ''}
  </div>`;
}

const ANCHORED: Partial<Record<BlockType, string>> = {
  about: 'about',
  education: 'education',
  experience: 'experience',
  projects: 'projects',
  skills: 'skills',
  achievements: 'awards',
  gallery: 'gallery',
  testimonials: 'recommendations',
  contact: 'contact',
};

function sectionOpen(block: SiteBlock, extraClass = ''): string {
  const anchor = ANCHORED[block.type];
  return `<section class="section ${extraClass}"${anchor ? ` id="${anchor}"` : ''} data-block-id="${esc(block.id)}" data-reveal>`;
}

function renderNavbar(block: SiteBlock, p: Row, ctx: RenderContext, activePage: SitePage): string {
  const brandName = str(p.logoText, ctx.project.title);
  const explicit = rows(p.links);
  const links =
    explicit.length > 0
      ? explicit
      : ctx.project.pages.map((page) => ({ label: page.name, href: page.slug }));
  const linkHtml = links
    .map((link) => {
      const href = renderHref(str(link.href, '#'), ctx);
      const label = str(link.label, 'Link');
      return `<a class="nav-link" href="${esc(href)}">${esc(label)}</a>`;
    })
    .join('');
  const cta = str(p.ctaLabel)
    ? `<a class="nav-cta" href="${esc(renderHref(str(p.ctaHref, '#'), ctx))}">${esc(str(p.ctaLabel))}</a>`
    : '';
  const home = pageHref(activePage.slug === ctx.project.pages[0]?.slug ? activePage.slug : 'home', ctx);

  return `<header class="nav" data-block-id="${esc(block.id)}">
    <div class="wrap nav-inner">
      <a class="brand" href="${esc(home)}">
        <span class="brand-mark" aria-hidden="true">${esc(initials(brandName))}</span>
        <span class="brand-name">${esc(brandName)}</span>
      </a>
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="Toggle menu" />
      <label for="nav-toggle" class="nav-burger" aria-label="Toggle menu"><span></span><span></span><span></span></label>
      <nav class="nav-links" aria-label="Main navigation">
        ${linkHtml}
        ${cta}
      </nav>
    </div>
  </header>`;
}

function renderHero(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const align = str(p.align, 'split') === 'center' ? 'center' : 'split';
  const title = str(p.title, 'Your name, in your own words');
  const portrait = str(p.portrait);
  const primary = str(p.ctaText)
    ? `<a class="btn" href="${esc(renderHref(str(p.ctaHref, '#'), ctx))}">${esc(str(p.ctaText))}<span aria-hidden="true">→</span></a>`
    : '';
  const secondary = str(p.secondaryText)
    ? `<a class="btn btn-ghost" href="${esc(renderHref(str(p.secondaryHref, '#'), ctx))}">${esc(str(p.secondaryText))}</a>`
    : '';
  const copy = `<div class="hero-copy">
    ${eyebrow(str(p.eyebrow))}
    <h1 class="hero-title">${esc(title)}</h1>
    ${str(p.subtitle) ? `<p class="hero-sub">${esc(str(p.subtitle))}</p>` : ''}
    ${primary || secondary ? `<div class="hero-actions">${primary}${secondary}</div>` : ''}
  </div>`;

  return `<section class="hero hero-${align}" data-reveal data-block-id="${esc(block.id)}">
    <div class="wrap hero-inner">
      ${copy}
      ${align === 'split' ? `<div class="hero-portrait">${portraitHtml(portrait, title)}</div>` : ''}
    </div>
  </section>`;
}

function renderStats(block: SiteBlock, p: Row): string {
  const stats = rows(p.items);
  if (stats.length === 0) return '';
  return `<section class="section-tight" data-block-id="${esc(block.id)}" data-reveal>
    <div class="wrap">
      <div class="stat-strip">
        ${stats
          .map(
            (item) => `<div class="stat">
              <div class="stat-value">${esc(str(item.value, '—'))}</div>
              <div class="stat-label">${esc(str(item.label))}</div>
            </div>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

function renderAbout(block: SiteBlock, p: Row): string {
  const facts = rows(p.facts);
  return `${sectionOpen(block)}<div class="wrap about-grid">
    <div class="about-copy">
      ${eyebrow(str(p.eyebrow))}
      <h2 class="section-title">${esc(str(p.heading, 'About me'))}</h2>
      <div class="prose">${str(p.body)
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((para) => `<p>${esc(para)}</p>`)
        .join('')}</div>
    </div>
    <div class="about-aside">
      ${str(p.image) ? `<div class="about-image">${imageHtml(str(p.image), str(p.heading, 'Portrait'))}</div>` : ''}
      ${
        facts.length
          ? `<dl class="facts">${facts
              .map(
                (fact) => `<div class="fact"><dt>${esc(str(fact.label))}</dt><dd>${esc(str(fact.value))}</dd></div>`
              )
              .join('')}</dl>`
          : ''
      }
    </div>
  </div></section>`;
}

function renderEducation(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const items = rows(p.items);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Education')}
    <div class="edu-list">
      ${items
        .map(
          (item) => `<article class="edu">
            <div>
              <h3>${esc(str(item.school, 'School'))}</h3>
              ${str(item.degree) ? `<p class="edu-degree">${esc(str(item.degree))}</p>` : ''}
            </div>
            ${str(item.period) ? `<p class="edu-period">${esc(str(item.period))}</p>` : ''}
            ${str(item.detail) ? `<p class="edu-detail">${esc(str(item.detail))}</p>` : ''}
          </article>`
        )
        .join('')}
    </div>
  </div></section>`;
}

function renderExperience(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const items = rows(p.items);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Experience')}
    <div class="timeline">
      ${items
        .map(
          (item) => `<article class="tl-item">
            <div class="tl-head">
              <div>
                <h3>${esc(str(item.role, 'Role'))}</h3>
                ${str(item.org) ? `<p class="tl-org">${esc(str(item.org))}</p>` : ''}
              </div>
              ${str(item.period) ? `<p class="tl-period">${esc(str(item.period))}</p>` : ''}
            </div>
            ${str(item.detail) ? `<p class="tl-detail">${esc(str(item.detail))}</p>` : ''}
          </article>`
        )
        .join('')}
    </div>
  </div></section>`;
}

function renderProjects(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const items = rows(p.items);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Projects')}
    <div class="project-grid">
      ${items
        .map((item) => {
          const tags = csv(item.tags)
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
          const url = str(item.url);
          return `<article class="project">
            <div class="project-media">${imageHtml(str(item.image), str(item.title, 'Project'))}</div>
            <div class="project-body">
              ${tags.length ? `<div class="tags">${tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join('')}</div>` : ''}
              <h3>${esc(str(item.title, 'Project'))}</h3>
              ${str(item.description) ? `<p>${esc(str(item.description))}</p>` : ''}
              ${url && url !== '#' ? `<span class="project-link">View project <span aria-hidden="true">↗</span></span>` : ''}
            </div>
            ${url && url !== '#' ? `<a class="project-hit" href="${esc(renderHref(url, ctx))}" aria-label="${esc(str(item.title, 'Project'))}"></a>` : ''}
          </article>`;
        })
        .join('')}
    </div>
  </div></section>`;
}

function renderSkills(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const groups = rows(p.groups);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Skills')}
    <div class="skill-groups">
      ${groups
        .map((group) => {
          const chips = csv(group.items)
            .split(',')
            .map((chip) => chip.trim())
            .filter(Boolean);
          return `<div class="skill-group">
            <h3>${esc(str(group.name, 'Skills'))}</h3>
            <div class="chips">${chips.map((chip) => `<span class="chip">${esc(chip)}</span>`).join('')}</div>
          </div>`;
        })
        .join('')}
    </div>
  </div></section>`;
}

function renderAchievements(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const items = rows(p.items);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Awards and honors')}
    <div class="awards">
      ${items
        .map(
          (item) => `<div class="award">
            <div class="award-year">${esc(str(item.year, '—'))}</div>
            <div class="award-body">
              <h3>${esc(str(item.title, 'Award'))}</h3>
              ${str(item.issuer) ? `<p class="award-issuer">${esc(str(item.issuer))}</p>` : ''}
              ${str(item.detail) ? `<p class="award-detail">${esc(str(item.detail))}</p>` : ''}
            </div>
          </div>`
        )
        .join('')}
    </div>
  </div></section>`;
}

function renderGallery(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const images = rows(p.images);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Gallery')}
    <div class="gallery-grid">
      ${images
        .map(
          (image) => `<figure class="gallery-item">
            ${imageHtml(str(image.url), str(image.alt, 'Image'))}
            ${str(image.alt) ? `<figcaption>${esc(str(image.alt))}</figcaption>` : ''}
          </figure>`
        )
        .join('')}
    </div>
  </div></section>`;
}

function renderTestimonials(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const items = rows(p.items);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Recommendations')}
    <div class="quote-grid">
      ${items
        .map(
          (item) => `<figure class="quote">
            <blockquote>${esc(str(item.quote))}</blockquote>
            <figcaption>
              <span class="quote-avatar" aria-hidden="true">${esc(initials(str(item.author, 'A')))}</span>
              <span>
                <span class="quote-name">${esc(str(item.author, 'Name'))}</span>
                ${str(item.role) ? `<span class="quote-role">${esc(str(item.role))}</span>` : ''}
              </span>
            </figcaption>
          </figure>`
        )
        .join('')}
    </div>
  </div></section>`;
}

function renderText(block: SiteBlock, p: Row): string {
  return `<section class="section" data-block-id="${esc(block.id)}" data-reveal><div class="wrap text-block">
    ${eyebrow(str(p.eyebrow))}
    ${str(p.heading) ? `<h2 class="section-title">${esc(str(p.heading))}</h2>` : ''}
    <div class="prose">${str(p.body)
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((para) => `<p>${esc(para)}</p>`)
      .join('')}</div>
  </div></section>`;
}

function renderImage(block: SiteBlock, p: Row): string {
  return `<section class="section" data-block-id="${esc(block.id)}" data-reveal><div class="wrap">
    <figure class="wide-figure">
      ${imageHtml(str(p.url), str(p.alt, 'Image'))}
      ${str(p.caption) ? `<figcaption>${esc(str(p.caption))}</figcaption>` : ''}
    </figure>
  </div></section>`;
}

function renderCta(block: SiteBlock, p: Row, ctx: RenderContext): string {
  return `<section class="cta-wrap" data-block-id="${esc(block.id)}" data-reveal><div class="wrap">
    <div class="cta-panel">
      <h2>${esc(str(p.title, 'Get in touch'))}</h2>
      ${str(p.subtitle) ? `<p>${esc(str(p.subtitle))}</p>` : ''}
      ${
        str(p.buttonText)
          ? `<a class="btn btn-invert" href="${esc(renderHref(str(p.buttonHref, '#'), ctx))}">${esc(str(p.buttonText))}</a>`
          : ''
      }
    </div>
  </div></section>`;
}

function renderContact(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const links = rows(p.links);
  return `${sectionOpen(block)}<div class="wrap contact-grid">
    <div>
      ${eyebrow('Contact')}
      <h2 class="section-title">${esc(str(p.heading, 'Get in touch'))}</h2>
      ${str(p.subtitle) ? `<p class="section-lead">${esc(str(p.subtitle))}</p>` : ''}
      ${str(p.email) ? `<a class="contact-email" href="mailto:${esc(str(p.email))}">${esc(str(p.email))}<span aria-hidden="true">↗</span></a>` : ''}
      ${str(p.location) ? `<p class="contact-meta">${esc(str(p.location))}</p>` : ''}
    </div>
    ${
      links.length
        ? `<div class="contact-links">${links
            .map(
              (link) => `<a class="contact-link" href="${esc(renderHref(str(link.href, '#'), ctx))}">
                <span>${esc(str(link.label, 'Link'))}</span><span aria-hidden="true">↗</span>
              </a>`
            )
            .join('')}</div>`
        : ''
    }
  </div></section>`;
}

function renderFooter(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const links = rows(p.links);
  return `<footer class="foot" data-block-id="${esc(block.id)}"><div class="wrap foot-inner">
    <div class="foot-brand">
      <span class="brand-mark" aria-hidden="true">${esc(initials(str(p.text, ctx.project.title)))}</span>
      <p>${esc(str(p.text, '© Your Name'))}</p>
    </div>
    <div class="foot-right">
      <nav class="foot-links" aria-label="Footer">
        ${links.map((link) => `<a href="${esc(renderHref(str(link.href, '#'), ctx))}">${esc(str(link.label, 'Link'))}</a>`).join('')}
      </nav>
      <p class="foot-credit">Built with <a href="/?ref=folio">Folio</a></p>
    </div>
  </div></footer>`;
}

function renderFeatures(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const items = rows(p.items);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Highlights')}
    <div class="highlight-grid">
      ${items
        .map(
          (item) => `<div class="highlight">
            <h3>${esc(str(item.title, 'Highlight'))}</h3>
            <p>${esc(str(item.text))}</p>
          </div>`
        )
        .join('')}
    </div>
  </div></section>`;
}

function renderPricing(block: SiteBlock, p: Row, ctx: RenderContext): string {
  const plans = rows(p.plans);
  return `${sectionOpen(block)}<div class="wrap">
    ${sectionHead(p, ctx, 'Pricing')}
    <div class="plan-grid">
      ${plans
        .map((plan) => {
          const features = csv(plan.features)
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean);
          return `<div class="plan">
            <h3>${esc(str(plan.name, 'Plan'))}</h3>
            <p class="plan-price">${esc(str(plan.price, '$0'))}</p>
            ${features.length ? `<ul>${features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
            <a class="btn btn-ghost" href="#">${esc(str(plan.ctaText, 'Choose'))}</a>
          </div>`;
        })
        .join('')}
    </div>
  </div></section>`;
}

function renderBlock(block: SiteBlock, ctx: RenderContext): string {
  const p = block.props;
  switch (block.type) {
    case 'navbar':
      return renderNavbar(block, p, ctx, ctx.activePage);
    case 'hero':
      return renderHero(block, p, ctx);
    case 'stats':
      return renderStats(block, p);
    case 'about':
      return renderAbout(block, p);
    case 'education':
      return renderEducation(block, p, ctx);
    case 'experience':
      return renderExperience(block, p, ctx);
    case 'projects':
      return renderProjects(block, p, ctx);
    case 'skills':
      return renderSkills(block, p, ctx);
    case 'achievements':
      return renderAchievements(block, p, ctx);
    case 'gallery':
      return renderGallery(block, p, ctx);
    case 'text':
      return renderText(block, p);
    case 'image':
      return renderImage(block, p);
    case 'testimonials':
      return renderTestimonials(block, p, ctx);
    case 'cta':
      return renderCta(block, p, ctx);
    case 'contact':
      return renderContact(block, p, ctx);
    case 'footer':
      return renderFooter(block, p, ctx);
    case 'features':
      return renderFeatures(block, p, ctx);
    case 'pricing':
      return renderPricing(block, p, ctx);
    default:
      return '';
  }
}

function baseCss(accent: string, mode: string, font: string): string {
  const dark = mode === 'dark';
  const ink = inkFor(accent);
  const headFont =
    font === 'serif'
      ? "'Iowan Old Style','Palatino Linotype',Palatino,Georgia,'Times New Roman',serif"
      : "'Geist','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";
  return `
:root{
  --accent:${accent};
  --accent-ink:${ink};
  --bg:${dark ? '#0a0a0b' : '#fbfaf7'};
  --surface:${dark ? '#121214' : '#ffffff'};
  --surface-2:${dark ? '#19191c' : '#f2f0ea'};
  --text:${dark ? '#f5f4ef' : '#161510'};
  --muted:${dark ? '#a3a19b' : '#6b675f'};
  --line:${dark ? 'rgba(255,255,255,.09)' : 'rgba(22,21,16,.10)'};
  --line-strong:${dark ? 'rgba(255,255,255,.17)' : 'rgba(22,21,16,.18)'};
  --accent-soft:color-mix(in srgb, var(--accent) ${dark ? '22%' : '10%'}, transparent);
  --radius:16px;
  --shadow:${dark ? '0 1px 2px rgba(0,0,0,.4)' : '0 1px 2px rgba(22,21,16,.04),0 22px 44px -28px rgba(22,21,16,.32)'};
  --head:${headFont};
  --tracking:${font === 'serif' ? '-0.015em' : '-0.03em'};
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
img{max-width:100%}
::selection{background:var(--accent);color:var(--accent-ink)}
h1,h2,h3,h4{font-family:var(--head);color:var(--text);margin:0;line-height:1.15;letter-spacing:var(--tracking);font-weight:620;text-wrap:balance}
p{margin:0}
a{color:inherit}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
.wrap{width:100%;max-width:1080px;margin:0 auto;padding:0 clamp(20px,5vw,40px)}

/* navigation */
.nav{position:sticky;top:0;z-index:40;background:color-mix(in srgb, var(--bg) 82%, transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.nav-inner{position:relative;display:flex;align-items:center;gap:20px;min-height:68px}
.brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none;font-weight:640;letter-spacing:-.015em}
.brand-mark{display:grid;place-items:center;flex:none;width:30px;height:30px;border-radius:9px;background:var(--accent);color:var(--accent-ink);font-family:var(--head);font-size:13px;font-weight:700;letter-spacing:0}
.brand-name{font-size:15px}
.nav-links{margin-left:auto;display:flex;align-items:center;gap:24px}
.nav-link{font-size:14px;text-decoration:none;color:var(--muted);transition:color .18s ease}
.nav-link:hover{color:var(--text)}
.nav-cta{display:inline-flex;align-items:center;padding:8px 14px;border-radius:9px;border:1px solid var(--line-strong);font-size:13.5px;font-weight:560;text-decoration:none;transition:border-color .18s ease,background .18s ease}
.nav-cta:hover{border-color:var(--accent);background:var(--accent-soft)}
.nav-toggle{display:none}
.nav-burger{display:none;margin-left:auto;flex-direction:column;gap:5px;padding:8px;cursor:pointer}
.nav-burger span{display:block;width:20px;height:1.5px;background:var(--text);border-radius:2px}

/* hero */
.hero{position:relative;overflow:hidden;padding:clamp(60px,9vw,104px) 0 clamp(52px,7vw,86px);border-bottom:1px solid var(--line)}
.hero::before{content:"";position:absolute;inset:-40% 8% auto;height:560px;background:radial-gradient(closest-side,color-mix(in srgb,var(--accent) 30%,transparent),transparent);opacity:${dark ? '.35' : '.5'};pointer-events:none}
.hero-inner{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);gap:clamp(30px,5vw,64px);align-items:center}
.hero-copy{max-width:640px}
.eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:11.5px;font-weight:660;letter-spacing:.15em;text-transform:uppercase;color:var(--accent)}
.eyebrow::before{content:"";width:20px;height:1px;background:currentColor;opacity:.55}
.hero-title{font-size:clamp(2.3rem,5.4vw,4rem);line-height:1.04;margin:16px 0 0;max-width:17ch}
.hero-sub{margin:20px 0 0;max-width:50ch;color:var(--muted);font-size:clamp(1rem,1.5vw,1.1rem);line-height:1.7}
.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
.hero-portrait{position:relative;border-radius:calc(var(--radius) + 7px);border:1px solid var(--line);background:var(--surface);padding:10px;box-shadow:var(--shadow);transform:rotate(-1.1deg)}
.hero-portrait img,.hero-portrait .media-ph{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:var(--radius);margin:0}
.hero-center .hero-inner{grid-template-columns:1fr;justify-items:center;text-align:center;max-width:840px}
.hero-center .hero-copy{display:flex;flex-direction:column;align-items:center}
.hero-center .hero-title{max-width:22ch;margin-inline:auto}
.hero-center .hero-sub{margin-inline:auto}
.hero-center .hero-actions{justify-content:center}
.hero-center .eyebrow{justify-content:center}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:11px;background:var(--accent);color:var(--accent-ink);font-size:14.5px;font-weight:560;text-decoration:none;border:1px solid transparent;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}
.btn:hover{transform:translateY(-1px);box-shadow:0 10px 24px -14px var(--accent);filter:saturate(1.05)}
.btn-ghost{background:transparent;color:var(--text);border-color:var(--line-strong)}
.btn-ghost:hover{border-color:var(--accent);background:var(--accent-soft);box-shadow:none}
.btn-invert{background:var(--bg);color:var(--text);border-color:transparent}
.btn-invert:hover{box-shadow:0 10px 26px -12px rgba(0,0,0,.45)}

/* sections */
.section{padding:clamp(52px,7.5vw,84px) 0;border-top:1px solid var(--line);scroll-margin-top:84px}
.section-tight{padding:clamp(32px,4vw,48px) 0}
.section-head{max-width:660px;margin-bottom:clamp(26px,3.5vw,40px)}
.section-title{font-size:clamp(1.65rem,3.1vw,2.35rem);margin-top:10px}
.section-lead{margin:12px 0 0;color:var(--muted);font-size:1.04rem;line-height:1.7}
.prose{max-width:66ch}
.prose p{margin:0 0 16px;color:var(--muted);font-size:1.04rem;line-height:1.78}
.prose p:last-child{margin-bottom:0}

/* stats */
.stat-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}
.stat{background:var(--surface);padding:24px 26px}
.stat-value{font-family:var(--head);font-size:clamp(1.6rem,3vw,2.1rem);font-weight:640;letter-spacing:var(--tracking);line-height:1.1}
.stat-label{margin-top:6px;font-size:12.5px;color:var(--muted);letter-spacing:.02em}

/* about */
.about-grid{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);gap:clamp(28px,5vw,64px);align-items:start}
.about-copy .section-title{margin:10px 0 20px}
.about-aside{display:grid;gap:16px}
.about-image{overflow:hidden;border-radius:var(--radius);border:1px solid var(--line);background:var(--surface)}
.about-image img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover}
.facts{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:4px 22px;box-shadow:var(--shadow)}
.fact{display:flex;justify-content:space-between;gap:18px;padding:13px 0;border-bottom:1px solid var(--line);font-size:.9rem}
.fact:last-child{border-bottom:0}
.fact dt{color:var(--muted)}
.fact dd{margin:0;font-weight:540;text-align:right}

/* education */
.edu-list{display:grid;gap:14px}
.edu{display:grid;grid-template-columns:1fr auto;gap:4px 24px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:22px 26px;box-shadow:var(--shadow)}
.edu h3{font-size:1.1rem}
.edu-degree{margin-top:4px;color:var(--accent);font-size:.9rem;font-weight:520}
.edu-period{color:var(--muted);font-size:.85rem;white-space:nowrap;padding-top:3px}
.edu-detail{grid-column:1/-1;margin-top:8px;color:var(--muted);font-size:.94rem}

/* timeline */
.timeline{position:relative;padding-left:30px;max-width:840px}
.timeline::before{content:"";position:absolute;left:6px;top:10px;bottom:10px;width:1px;background:var(--line-strong)}
.tl-item{position:relative;padding-bottom:30px}
.tl-item:last-child{padding-bottom:0}
.tl-item::before{content:"";position:absolute;left:-28px;top:6px;width:11px;height:11px;border-radius:50%;background:var(--bg);border:2px solid var(--accent)}
.tl-head{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:baseline}
.tl-head h3{font-size:1.08rem}
.tl-org{margin-top:3px;color:var(--accent);font-size:.9rem;font-weight:520}
.tl-period{color:var(--muted);font-size:.84rem;white-space:nowrap}
.tl-detail{margin-top:8px;color:var(--muted);font-size:.94rem;max-width:62ch;white-space:pre-line}

/* projects */
.project-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:20px}
.project{position:relative;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);transition:transform .3s ease,border-color .3s ease}
.project:hover{transform:translateY(-3px);border-color:var(--line-strong)}
.project-media{aspect-ratio:16/10;overflow:hidden;background:var(--surface-2)}
.project-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.22,1,.36,1)}
.project:hover .project-media img{transform:scale(1.04)}
.project-body{padding:22px 24px 26px;display:flex;flex-direction:column;gap:9px}
.project-body h3{font-size:1.12rem}
.project-body p{color:var(--muted);font-size:.94rem;line-height:1.65}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:2px}
.tag{font-size:11px;letter-spacing:.03em;padding:4px 9px;border-radius:999px;background:var(--accent-soft);color:var(--accent);border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);font-weight:560}
.project-link{margin-top:6px;font-size:.86rem;font-weight:560;color:var(--text)}
.project-hit{position:absolute;inset:0}
.media-ph{display:grid;place-items:center;width:100%;height:100%;background:linear-gradient(135deg,var(--accent-soft),var(--surface-2) 62%);color:var(--text);min-height:120px}
.media-initial{font-family:var(--head);font-size:clamp(1.4rem,3vw,2rem);font-weight:640;opacity:.42;letter-spacing:.02em}
.portrait-ph{min-height:0}

/* skills */
.skill-groups{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:28px}
.skill-group h3{font-size:.92rem;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);font-family:inherit;font-weight:600}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.chip{padding:7px 12px;border-radius:9px;border:1px solid var(--line);background:var(--surface);font-size:.86rem;transition:border-color .18s ease}
.chip:hover{border-color:var(--accent)}

/* achievements */
.awards{border-top:1px solid var(--line)}
.award{display:grid;grid-template-columns:86px minmax(0,1fr);gap:22px;padding:22px 0;border-bottom:1px solid var(--line)}
.award-year{font-family:var(--head);font-size:.95rem;font-weight:620;color:var(--accent);padding-top:2px}
.award-body h3{font-size:1.03rem}
.award-issuer{margin-top:3px;color:var(--muted);font-size:.88rem}
.award-detail{margin-top:6px;color:var(--muted);font-size:.9rem;max-width:64ch}

/* gallery */
.gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.gallery-item{margin:0;border-radius:12px;overflow:hidden;background:var(--surface-2);border:1px solid var(--line)}
.gallery-item img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;transition:transform .6s cubic-bezier(.22,1,.36,1)}
.gallery-item:hover img{transform:scale(1.045)}
.gallery-item .media-ph{aspect-ratio:4/3;min-height:0}
.gallery-item figcaption{padding:10px 12px;font-size:.8rem;color:var(--muted)}
.wide-figure{margin:0}
.wide-figure img{display:block;width:100%;max-height:560px;object-fit:cover;border-radius:var(--radius);border:1px solid var(--line)}
.wide-figure figcaption{margin-top:10px;font-size:.85rem;color:var(--muted);text-align:center}

/* quotes */
.quote-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.quote{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:26px 28px;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:18px}
.quote blockquote{margin:0;font-family:var(--head);font-size:1.06rem;line-height:1.55;letter-spacing:-.01em}
.quote blockquote::before{content:"“";color:var(--accent);font-size:2.2rem;line-height:0;display:block;margin-bottom:6px;font-family:Georgia,serif}
.quote figcaption{display:flex;align-items:center;gap:11px;margin-top:auto}
.quote-avatar{display:grid;place-items:center;width:34px;height:34px;flex:none;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-size:11px;font-weight:700;letter-spacing:.03em}
.quote-name{display:block;font-size:.88rem;font-weight:580}
.quote-role{display:block;font-size:.78rem;color:var(--muted)}

/* cta */
.cta-wrap{padding:clamp(30px,5vw,56px) 0}
.cta-panel{position:relative;overflow:hidden;background:var(--accent);color:var(--accent-ink);border-radius:calc(var(--radius) + 8px);padding:clamp(34px,5.5vw,60px);text-align:center}
.cta-panel::before{content:"";position:absolute;inset:-60% 20% auto;height:400px;background:radial-gradient(closest-side,rgba(255,255,255,.22),transparent);pointer-events:none}
.cta-panel h2{color:var(--accent-ink);font-size:clamp(1.6rem,3vw,2.3rem);position:relative}
.cta-panel p{margin:14px auto 0;max-width:52ch;color:color-mix(in srgb,var(--accent-ink) 78%,transparent);font-size:1.02rem;position:relative}
.cta-panel .btn{margin-top:26px;position:relative}

/* contact */
.contact-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(28px,5vw,56px);align-items:start}
.contact-email{display:inline-flex;align-items:center;gap:8px;margin-top:24px;font-family:var(--head);font-size:clamp(1.15rem,2.4vw,1.55rem);font-weight:580;text-decoration:none;border-bottom:1px solid var(--line-strong);padding-bottom:4px;transition:border-color .2s ease,color .2s ease}
.contact-email:hover{color:var(--accent);border-color:var(--accent)}
.contact-meta{margin-top:14px;color:var(--muted);font-size:.9rem}
.contact-links{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.contact-link{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:17px 20px;background:var(--surface);text-decoration:none;font-size:.94rem;transition:background .18s ease}
.contact-link:hover{background:var(--surface-2)}
.contact-link span:last-child{color:var(--accent)}

/* legacy sections */
.highlight-grid,.plan-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.highlight{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:22px 24px}
.highlight h3{font-size:1.02rem}
.highlight p{margin-top:6px;color:var(--muted);font-size:.92rem}
.plan{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:24px;text-align:center}
.plan-price{font-family:var(--head);font-size:1.9rem;font-weight:640;margin:8px 0 14px}
.plan ul{list-style:none;padding:0;margin:0 0 20px;text-align:left}
.plan li{padding:4px 0 4px 18px;position:relative;font-size:.9rem;color:var(--muted)}
.plan li::before{content:"✓";position:absolute;left:0;color:var(--accent)}

/* footer */
.foot{border-top:1px solid var(--line);padding:clamp(36px,5vw,52px) 0}
.foot-inner{display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between}
.foot-brand{display:flex;align-items:center;gap:10px}
.foot-brand p{font-size:.85rem;color:var(--muted)}
.foot-right{display:flex;flex-wrap:wrap;align-items:center;gap:22px}
.foot-links{display:flex;flex-wrap:wrap;gap:16px}
.foot-links a{font-size:.84rem;color:var(--muted);text-decoration:none;transition:color .18s ease}
.foot-links a:hover{color:var(--text)}
.foot-credit{font-size:.78rem;color:var(--muted)}
.foot-credit a{color:var(--accent);text-decoration:none}

/* motion */
[data-reveal].will-reveal{opacity:0;transform:translateY(16px)}
[data-reveal]{transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1)}
[data-reveal].will-reveal.is-in{opacity:1;transform:none}

/* editor preview affordances */
.is-preview [data-block-id]{cursor:pointer;transition:box-shadow .15s ease}
.is-preview [data-block-id]:hover{box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--accent) 55%,transparent)}
.is-preview .project-hit{pointer-events:none}

/* responsive */
@media (max-width:900px){
  .hero-inner{grid-template-columns:1fr}
  .hero-portrait{max-width:340px;transform:none}
  .about-grid,.contact-grid{grid-template-columns:1fr}
  .about-aside{max-width:420px}
  .gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:760px){
  .nav-burger{display:flex}
  .nav-toggle{display:none}
  .nav-links{display:none}
  .nav-toggle:checked ~ .nav-links{position:absolute;top:calc(100% + 1px);left:0;right:0;display:flex;flex-direction:column;align-items:flex-start;gap:4px;margin:0;padding:14px clamp(20px,5vw,40px) 20px;background:var(--surface);border-bottom:1px solid var(--line);box-shadow:var(--shadow)}
  .nav-links .nav-link{padding:8px 0;width:100%;font-size:15px}
  .nav-links .nav-cta{margin-top:6px}
  .hero-title{max-width:20ch}
  .edu{grid-template-columns:1fr}
  .edu-period{padding-top:2px}
  .award{grid-template-columns:64px minmax(0,1fr);gap:16px}
  .foot-inner{align-items:flex-start;flex-direction:column}
}
@media (max-width:520px){
  .gallery-grid{grid-template-columns:1fr}
  .stat-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
  .hero-actions .btn{flex:1 1 100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
  [data-reveal].will-reveal{opacity:1;transform:none}
}
@media print{
  .nav,.cta-wrap,.foot-credit,.hero-actions{display:none!important}
  body{background:#fff;color:#000}
  .section{padding:18px 0;break-inside:avoid}
  a{text-decoration:none}
}
`;
}

function siteName(project: SiteProject): string {
  const navbar = project.pages.flatMap((page) => page.blocks).find((block) => block.type === 'navbar');
  return str(navbar?.props.logoText, project.title);
}

export function compilePageHtml(
  page: SitePage,
  project: SiteProject,
  options: CompileOptions = {}
): string {
  const safeProject: SiteProject = {
    ...project,
    pages: project.pages.length > 0 ? project.pages : [page],
  };
  const ctx: RenderContext = { project: safeProject, activePage: page, options };
  const accent = /^#[0-9a-f]{6}$/i.test(project.accent ?? '') ? project.accent : '#2f6f4e';
  const mode = project.theme?.mode === 'dark' ? 'dark' : 'light';
  const font = project.theme?.font === 'serif' ? 'serif' : 'sans';
  const body = page.blocks.map((block) => renderBlock(block, ctx)).join('\n');
  const description = str(project.description, `${siteName(safeProject)} — student portfolio`);
  const canonical = options.siteUrl
    ? `${options.siteUrl}${options.basePath ?? ''}${page === safeProject.pages[0] ? '' : `/${page.slug}`}`
    : undefined;
  const name = siteName(safeProject);
  const interactive = Boolean(options.preview);
  const selectable = interactive && options.selectable !== false;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `${page.name} — ${name}`,
    description,
    mainEntity: {
      '@type': 'Person',
      name,
      description,
      ...(options.siteUrl ? { url: `${options.siteUrl}${options.basePath ?? ''}` } : {}),
    },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(page === safeProject.pages[0] ? project.title : `${page.name} — ${name}`)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="theme-color" content="${esc(accent)}" />
<meta property="og:type" content="profile" />
<meta property="og:title" content="${esc(name)}" />
<meta property="og:description" content="${esc(description)}" />
${canonical ? `<link rel="canonical" href="${esc(canonical)}" />\n<meta property="og:url" content="${esc(canonical)}" />` : ''}
<meta name="twitter:card" content="summary" />
<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>
<style>${baseCss(accent, mode, font)}</style>
</head>
<body${selectable ? ' class="is-preview"' : ''}>
${body}
<script>
(function () {
  var isInteractive = ${interactive ? 'true' : 'false'};
  var isSelectable = ${selectable ? 'true' : 'false'};
  var burger = document.querySelector('.nav-burger');
  var navToggle = document.getElementById('nav-toggle');
  if (burger && navToggle) {
    burger.setAttribute('role', 'button');
    burger.setAttribute('tabindex', '0');
    burger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navToggle.checked = !navToggle.checked;
      }
    });
  }
  if (isInteractive) {
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var anchor = target.closest('a');
      if (anchor) event.preventDefault();
      if (!isSelectable) return;
      var block = target.closest('[data-block-id]');
      if (block && window.parent) {
        window.parent.postMessage({ type: 'folio:block', blockId: block.getAttribute('data-block-id') }, '*');
      }
    }, true);
    if (window.parent) window.parent.postMessage({ type: 'folio:ready' }, '*');
    // Keep the preview scroll position across srcDoc re-renders.
    if (isSelectable) {
      var restore = window.name.indexOf('folio-scroll:') === 0 ? parseInt(window.name.slice(13), 10) : 0;
      if (restore > 0) {
        requestAnimationFrame(function () { window.scrollTo(0, restore); });
      }
      window.addEventListener('scroll', function () {
        window.name = 'folio-scroll:' + window.scrollY;
      }, { passive: true });
    }
  }
  var targets = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -6% 0px' });
  Array.prototype.forEach.call(targets, function (target, index) {
    if (index === 0) { target.classList.add('is-in'); return; }
    target.classList.add('will-reveal');
    observer.observe(target);
  });
})();
</script>
</body>
</html>`;
}

export function compileProjectIndexHtml(project: SiteProject, options: CompileOptions = {}): string {
  const page = project.pages[0];
  if (!page) {
    return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><title>Empty site</title></head><body></body></html>';
  }
  return compilePageHtml(page, project, options);
}
