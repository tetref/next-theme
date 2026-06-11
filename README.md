# Zenith Dashboard

A clean, minimal admin dashboard template built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. Achromatic design that lets the features speak. Over 50 pages, 10 chart types, full CRUD, drag-and-drop, and a live theme customizer.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Design Philosophy

Zenith is the "shadcn default, elevated." Where other admin templates add heavy custom styling, Zenith uses a **pure achromatic (zero chroma) color palette** with a light sidebar. The design gets out of the way so the feature set speaks for itself — making it the easiest DashboardPack template to customize and brand.

---

## Features at a Glance

- 5 dashboard variants (Overview, Analytics, eCommerce, CRM, SaaS)
- 6 app pages (Chat, Mail, File Manager, Kanban, Calendar, Wizard)
- Full CRUD for Orders, Products, and Customers
- Invoices, Billing, Pricing, Profile, Support, Notifications, and Settings pages
- 8 auth/utility pages (Sign In, Sign Up, Forgot/Reset Password, 2FA, Email Verification, Lock Screen, and more)
- 10 Recharts chart types on a dedicated Charts page
- Live theme customizer with 6 color presets, 3 density levels, and RTL support
- 3 layout options: sidebar, horizontal top-nav, and boxed container
- Dark / Light / System themes with localStorage persistence
- Command Palette (Cmd+K / Ctrl+K) with fuzzy search across all pages
- Fully responsive with collapsible sidebar and mobile overlay menu
- Accessible: skip-to-content link, ARIA attributes, focus management, semantic HTML
- Unit tests (Vitest) and E2E tests (Playwright) included
- Storybook component library with 15 stories and auto-docs
- i18n support (English, German, French) with locale switcher
- Built-in `/docs` documentation site

---

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd zenith-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3737](http://localhost:3737) to see the dashboard.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server (port 3737) |
| `npm run build` | Production build (static export to `out/`) |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint (flat config, v9) |
| `npm run test` | Vitest in watch mode |
| `npm run test:run` | Vitest single run |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run storybook` | Start Storybook dev server (port 6006) |
| `npm run analyze` | Bundle size analysis |

---

## Theme Customizer

A slide-out drawer panel for live theme configuration:

- **6 Color Presets** -- Neutral (default), Zinc, Blue, Violet, Rose, Orange
- **3 Density Options** -- Compact, Comfortable, Spacious
- **Theme Mode** -- Dark, Light, System (auto-detects OS preference)
- **RTL Toggle** -- Switch to right-to-left layout instantly
- **Reset to Defaults** -- One-click restore

All changes apply instantly and persist via localStorage.

---

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, static export) |
| UI Library | React 19 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 with OKLCh color tokens |
| Components | @dashboardpack/core (34 shadcn/ui primitives) |
| Charts | Recharts 3 (10 chart types) |
| Data Tables | TanStack Table |
| Forms | React Hook Form + Zod |
| Drag & Drop | @hello-pangea/dnd |
| Animations | Framer Motion |
| Icons | Lucide React |
| Command Palette | cmdk |
| Toasts | Sonner |
| Testing | Vitest + Playwright |
| Storybook | Storybook 8.x |
| i18n | Custom React Context + typed JSON messages |

---

## Customization

Colors use **OKLCh** format defined as CSS custom properties in `src/app/globals.css`. To add color to the achromatic base, update the chroma and hue:

```css
:root {
  --primary: oklch(0.55 0.19 240);   /* Add blue accent */
}
```

Or use the built-in Theme Customizer to switch between 6 color presets without editing CSS.

---

## License

MIT
