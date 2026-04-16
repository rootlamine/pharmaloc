# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # Type-check then build for production
npm run lint         # ESLint
npm run format       # Prettier (formats TS/TSX files)
npm run typecheck    # TypeScript type-check without emitting
npm run preview      # Preview production build locally
```

To add shadcn/ui components:
```bash
npx shadcn@latest add <component-name>
```

## Architecture

**Stack:** React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + React Router v7

**Path alias:** `@/` maps to `src/` (configured in `vite.config.ts`).

### Routing (src/App.tsx)
Four routes managed by React Router:
- `/` → `HomePage`
- `/pharmacie-de-garde` → `PharmacieGardePage`
- `/a-propos` → `AboutPage`
- `/contact` → `ContactPage`

### Page structure
- **HomePage** — marketing landing page composed of sequential sections: `HeroSection`, `AboutSection`, `FeaturesSection`, `HowItWorksSection`, `TrustSection`, `CTASection`.
- **PharmacieGardePage** — the core feature: a split-panel map/list view for finding on-duty pharmacies. Contains its own sub-components (`PharmacyCard`, `RoutePanel`, `DetailOverlay`, `MapController`, `MapFitBounds`) all co-located in the same file. Uses [react-leaflet](https://react-leaflet.js.org/) with OpenStreetMap tiles and [OSRM](https://router.project-osrm.org) for turn-by-turn routing. Pharmacy data is currently hardcoded in the file (Dakar, Senegal locations).

### Layout
`Navbar` and `Footer` are shared layout components used by all pages. The navbar height is `74px` — layout math elsewhere (e.g., `calc(100vh - 74px)`) depends on this.

### Styling
- Tailwind CSS v4 configured via `@tailwindcss/vite` plugin (no `tailwind.config.js` — theme is defined in `src/index.css` under `@theme inline`).
- Brand color tokens (usable as Tailwind classes):
  - `pharmaloc-dark` → `#0d5154`
  - `pharmaloc-teal` → `#01c2a7`
  - `pharmaloc-accent` → `#73e39f`
- Fonts: `font-montserrat` (headings/labels) and `font-sora` (body/UI text), loaded from Google Fonts.
- `section-container` is a custom `@utility` defined in `src/index.css` — use it for consistent max-width + padding on section wrappers.

### Custom hook
`useCountUp(end, duration, enabled)` — animates a number from 0 to `end` with easeOutQuad, used in `TrustSection` stats.
