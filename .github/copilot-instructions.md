# Copilot Instructions for AI Coding Agents

## Project Overview

- This is a [Next.js](https://nextjs.org) project created with `create-next-app` using the `/app` directory structure.
- The main entry point is `src/app/page.tsx`. Global styles are in `src/app/globals.css`.
- The project uses TypeScript and modern Next.js (App Router, not Pages Router).
- Static assets (SVGs, icons) are in the `public/` directory.

## Key Workflows

- **Development:**
  - Start the dev server: `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
  - App runs at [http://localhost:3000](http://localhost:3000)
  - Hot reload is enabled for all files in `src/app/`
- **Build:**
  - Production build: `npm run build`
  - Preview production: `npm run start`
- **Styling:**
  - Global styles: `src/app/globals.css`
  - Uses PostCSS (`postcss.config.mjs`)
- **TypeScript:**
  - Configured via `tsconfig.json`
  - Type definitions: `next-env.d.ts`

## Project Conventions

- **Component Location:**
  - All main pages/components live under `src/app/`.
  - Use file-based routing: folders and files in `src/app/` map to routes.
- **Assets:**
  - Place static files in `public/` for direct URL access.
- **Font Optimization:**
  - Uses `next/font` for font loading and optimization.

## Integration Points

- **External:**
  - No custom API integrations or backend code present by default.
  - Ready for Vercel deployment (see README for details).

## Examples

- To add a new page: create a new folder with a `page.tsx` in `src/app/` (e.g., `src/app/about/page.tsx` for `/about` route).
- To add a global style: edit `src/app/globals.css`.
- To add an SVG: place it in `public/` and reference as `/file.svg`.

## References

- See `README.md` for more details on setup and deployment.
- See `next.config.ts` for custom Next.js configuration.

---

If you are unsure about a pattern or workflow, prefer the conventions established in the files above. For new features, follow the Next.js App Router and TypeScript best practices as exemplified in this codebase.
