<div align="center">

<div id="user-content-toc">
  <ul align="center" style="list-style: none;">
    <summary><h1>Tailcast</h1></summary>
  </ul>
</div>

**Dark-themed website template and no-code site builder built with Next.js & Tailwind CSS, designed for a fictional startup.**<br>
Responsive, fast, and ready to customize.

[Live Demo](https://tailcast.vercel.app) · [Getting Started](#quickstart) · [Changelog](https://github.com/matt765/Tailcast/blob/main/CHANGELOG.md)

[![Forks](https://img.shields.io/github/forks/matt765/Tailcast?style=flat)](https://github.com/matt765/Tailcast/forks) [![Version](https://img.shields.io/github/package-json/v/matt765/Tailcast?color=green)](https://github.com/matt765/Tailcast/releases)

</div>

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase, Sentry, Vercel Analytics

## Features

- **Marketing pages** - Home, About, Features, Blog, Explore, Contact, 404
- **Site builder** - Drag-and-drop editor with layers, inspector, AI panel and publishing
- **Portfolios** - Published sites served from `u/[username]/[slug]` routes
- **SEO optimization** - Metadata, Open Graph, canonical URLs, robots
- **Accessible** - Semantic HTML, ARIA attributes, keyboard navigation
- **Responsive** - Mobile-first design that adapts to any screen size
- **Code quality** - ESLint, Prettier and CI pipelines pre-configured

## Quickstart

Requires Node.js 22 or newer. Add your Supabase (and optionally Sentry) keys to `.env.local` first.

```bash
git clone https://github.com/matt765/Tailcast.git
cd Tailcast
npm ci
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to see the site.

You can also deploy on Vercel with one click:

[<img src="https://vercel.com/button" alt="Deploy with Vercel" height="32">](https://vercel.com/new/clone?repository-url=https://github.com/matt765/Tailcast)

## Project structure

```
├── public/                  # Static assets (images, favicon, robots.txt)
├── src/
│   ├── app/                 # App Router pages, layouts and route handlers
│   │   ├── api/             # Route handlers (AI, analytics, projects, publish)
│   │   ├── dashboard/       # Builder dashboard
│   │   └── u/               # Published portfolio routes
│   ├── components/          # Reusable React components
│   │   └── builder/        # Editor, panels and dashboard views
│   ├── lib/                 # Site compiler, templates, store and Supabase clients
│   └── styles/              # Theme tokens and utility styles
├── supabase/
│   └── migrations/          # Database schema migrations
├── scripts/                 # Repository tooling
├── next.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

## Available commands

| Command              | Action                                     |
| :------------------- | :----------------------------------------- |
| `npm run dev`        | Start the development server               |
| `npm run build`      | Build for production (`.next/`)            |
| `npm run start`      | Serve the production build locally         |
| `npm run check`      | Run the TypeScript type check              |
| `npm run lint`       | Run ESLint                                 |
| `npm run format`     | Format code with Prettier                  |
| `npm run format:check` | Check formatting                         |

## License

This project is open source and available under the MIT License. See [LICENSE](license) for details.

## Author

Made by [matt765](https://github.com/matt765/)
