# Changelog

All notable changes to Zenith Dashboard are documented here.

## v1.0.0 — February 2026

Initial release. Clean, minimal admin dashboard with achromatic design.

### Design

- Achromatic (zero chroma) OKLCh color palette — pure grayscale primary
- Light sidebar in light mode, dark sidebar in dark mode
- Colorful chart palette for data readability
- 6 color presets: Neutral (default), Zinc, Blue, Violet, Rose, Orange
- Subtle page transitions (150ms fade + 4px slide)

### Features

- 51+ routes: 6 dashboard variations, CRUD pages, app pages, auth, docs
- TanStack Table with sort, filter, pagination, CSV export, mobile cards
- Theme customizer with color presets, density, layout, container, direction, language
- Dark/light/system theme with localStorage persistence
- Command palette (Cmd+K)
- i18n support (English, German, French)
- RTL support
- Storybook component documentation
- Vitest unit tests + Playwright E2E tests

### Stack

- Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- @dashboardpack/core component library
- Recharts, Lucide React, Framer Motion
- React Hook Form + Zod validation
