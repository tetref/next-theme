# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev       # Start dev server on port 3737 (uses --webpack flag)
npm run build     # Production static export to out/
npm run start     # Serve production build
npm run lint      # ESLint (flat config v9, next/core-web-vitals + typescript)
```

```bash
npm run test              # Vitest watch mode
npm run test:run          # Vitest single run
npx vitest run src/components/dashboard/stats-cards.test.tsx  # Run single test file
npm run test:e2e          # Playwright E2E (auto-starts dev server on port 3737)
npm run test:e2e:ui       # Playwright with interactive UI
npm run storybook         # Storybook dev server (port 6006)
npm run build-storybook   # Build static Storybook to storybook-static/
npm run analyze           # Bundle size analysis (ANALYZE=true next build)
```

## Architecture

Next.js 16 app using App Router with React 19, TypeScript (strict), and Tailwind CSS v4. Static export (`output: "export"` in next.config.ts). All dashboard components are client-side rendered (`"use client"`). No backend/API layer — all data is mock/hardcoded.

### Route Groups

- `(dashboard)/*` — Main dashboard pages. Uses `DashboardShell` layout (sidebar + header + command palette + page transitions). Wrapped in `SidebarProvider` with `zenith` storage prefix.
- `(auth)/*` — Auth pages (login, register, forgot-password, reset-password, two-factor). Centered card layout, no sidebar.
- `docs/*` — Built-in documentation site (getting-started, theming, charts, components, testing, i18n, etc.).
- Root-level error pages: `403/`, `500/`, `coming-soon/`, `maintenance/`, `not-found.tsx`, `error.tsx`.

### @dashboardpack/core (Local Dependency)

Linked via `file:../dashboardpack-core`. This is the shared component library across DashboardPack templates. It provides:

- **UI primitives** (`components/ui/`) — 30+ shadcn/ui-style components (button, card, dialog, form, data-table, etc.)
- **Shared components** (`components/shared/`) — `PageHeader`, `EmptyState`, `ConfirmDialog`, `DataTable`, `LazyChart`, `DateRangePicker`
- **Providers** (`providers/`) — `ThemeProvider` (dark/light/system), `SidebarProvider` (collapse state, layout mode, container mode)
- **Mock data** (`lib/data/`) — All page data (orders, products, customers, invoices, users, analytics, chat, mail, kanban, calendar, files, notifications)
- **Data types** (`lib/data/types.ts`) — Shared TypeScript interfaces for all data models
- **i18n** (`lib/i18n/`) — `LocaleProvider`, `useTranslations()` hook, message files (en, de, fr)
- **Utilities** (`lib/utils.ts`) — `cn()` helper (clsx + tailwind-merge)

When adding new pages, mock data goes in `@dashboardpack/core/lib/data/`, not in the Zenith repo. Import pattern: `import { orders } from "@dashboardpack/core/lib/data"`.

### Key Zenith-Specific Files

- `src/components/dashboard/dashboard-shell.tsx` — Main layout shell: sidebar + header + command palette + page transitions. Handles sidebar/topnav layout switching and boxed container mode.
- `src/components/dashboard/theme-customizer.tsx` — Slide-out drawer for live theme configuration (presets, density, layout, RTL).
- `src/components/command-palette.tsx` — Cmd+K command palette using cmdk.
- `src/lib/navigation.ts` — Sidebar navigation items with icons, badges, keywords, and group ("main"/"system").
- `src/app/globals.css` — OKLCh color tokens, density system, dark mode overrides, animations.

### Theming System

Colors use **OKLCh** format as CSS custom properties in `globals.css` with separate `:root` (light) and `.dark` blocks. Default is **achromatic (zero chroma)** — pure grayscale.

The `<head>` in `layout.tsx` contains inline scripts that read localStorage before paint to prevent FOUC for: theme density, color preset, layout mode, container mode, and RTL direction.

localStorage keys all use `zenith-` prefix: `zenith-theme`, `zenith-density`, `zenith-color-preset`, `zenith-layout`, `zenith-container`, `zenith-direction`.

6 color presets: neutral (default), zinc, blue, violet, rose, orange. 3 density levels (compact, comfortable, spacious) implemented via CSS custom properties (`--table-row-height`, `--card-padding`, `--spacing-unit`) wired to `data-slot` selectors.

Dark mode variant: `@custom-variant dark (&:is(.dark *))` in globals.css.

### Dashboard Page Pattern

Chart-heavy components use `next/dynamic` with `ssr: false` and `Skeleton` loading placeholders:

```tsx
const RevenueChart = dynamic(
  () => import("@/components/dashboard/revenue-chart").then((m) => m.RevenueChart),
  { loading: () => <Skeleton className="h-[420px] w-full rounded-xl" />, ssr: false }
);
```

The `LazyChart` wrapper from `@dashboardpack/core` uses IntersectionObserver to defer chart rendering until visible in viewport.

### Path Aliases & Webpack

- `@/*` maps to `src/*` (tsconfig.json)
- `@dashboardpack/core/*` resolved via tsconfig paths + webpack symlink config

Dev and build use `--webpack` flag (not Turbopack) due to symlinked `@dashboardpack/core`. The webpack config in `next.config.ts` sets `resolve.symlinks = false` and adds the local `node_modules` to `resolve.modules`.

### UI Component System

UI primitives come from `@dashboardpack/core`. Components follow shadcn/ui conventions (CVA variants, `cn()` utility, `forwardRef` pattern). A `components.json` config exists so `npx shadcn@latest add <component>` can scaffold new components (new-york style, neutral base color).

### Testing

- **Unit tests**: Vitest + jsdom + React Testing Library. Setup in `src/test/setup.ts`. Tests co-located as `*.test.{ts,tsx}`.
- **E2E tests**: Playwright in `e2e/`. Chromium only. Auto-starts dev server on `localhost:3737`.
- **Stories**: Storybook 8.x with `@storybook/react-vite` (NOT `@storybook/nextjs`). Stories in `src/stories/` and co-located as `*.stories.tsx`.

### Key Libraries

- **Recharts 3** — Area, bar, pie, radar, scatter, treemap, gauge charts
- **TanStack Table** — Data tables with sort, filter, pagination, CSV export
- **React Hook Form + Zod** — Form handling and validation
- **Framer Motion** — Page transitions and animations
- **@hello-pangea/dnd** — Drag and drop (Kanban board)
- **cmdk** — Command palette
- **Lucide React** — Icons
- **Sonner** — Toast notifications
