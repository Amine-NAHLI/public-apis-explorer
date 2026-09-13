---
name: Aetheric API Index
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f5'
  surface-container: '#f0edf0'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e5e1e4'
  on-surface: '#1c1b1d'
  on-surface-variant: '#464554'
  inverse-surface: '#313032'
  inverse-on-surface: '#f3f0f2'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#006577'
  on-tertiary: '#ffffff'
  tertiary-container: '#008096'
  on-tertiary-container: '#f9fdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#fcf8fb'
  on-background: '#1c1b1d'
  surface-variant: '#e5e1e4'
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.035em
  display-hero-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.011em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.006em
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-pill:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies technical luxury, clinical precision, and quiet authority. Designed for high-performing engineers, technical architects, and product builders, it rejects visual clutter in favor of extreme clarity, sub-pixel alignment, and understated digital craft reminiscent of top-tier developer tooling environments.

### Aesthetic Paradigm
- **Minimalist Structuralism:** Generous negative space paired with razor-sharp micro-borders (`1px` hairline rules) and structural data density.
- **Glassmorphism & Luster:** Optical depth built through translucent canvas layers (`backdrop-blur-md`), faint directional gradient halos, and reflective inner strokes rather than heavy drop shadows.
- **Atmosphere:** Controlled, high-end, and intellectual. Information density is treated as a premium asset: typography is crisp, tracking is deliberately tight, and interactive states respond instantaneously with subtle optical feedback.

## Colors

The color system is calibrated for precision and contrast, engineered to effortlessly toggle between a crystalline daylight mode and a deep, void-like night mode.

### Light Mode Architecture
- **Canvas Base:** Pure white (`#ffffff`) for elevated surfaces; off-white canvas base (`#fafafa`) for page foundations.
- **Borders & Dividers:** Zinc hairline rules (`#e4e4e7` / `rgba(0, 0, 0, 0.06)`).
- **Ink Tiers:** 
  - Primary: Deep graphite (`#09090b`) for headings and core values.
  - Muted: Slate gray (`#71717a`) for meta-labels and descriptions.
  - Subtle: Light slate (`#a1a1aa`) for placeholders, inactive indicators, and shortcuts.

### Dark Mode Architecture (OLED Deep)
- **Canvas Base:** Obsidian black (`#09090b`) for foundation; dark zinc (`#121215`) for elevated cards.
- **Borders & Dividers:** Faint white highlights (`rgba(255, 255, 255, 0.08)`).
- **Ink Tiers:** Primary pure white (`#fafafa`), secondary muted ash (`#a1a1aa`).

### Technical Accents
- **Indigo / Violet (`#6366f1`):** Primary identity, focused states, and key architectural callouts.
- **Emerald (`#10b981`):** Operational health, active status codes (200 OK), high uptime badges.
- **Cyan (`#06b6d4`):** Real-time latency, streaming endpoints, WebSocket indicators.

## Typography

Typographic discipline provides the foundation of the interface. We employ **Geist** for all display and prose surfaces due to its Swiss modernist proportions, geometric neutrality, and razor-sharp rendering on Retina displays. For technical payloads, HTTP method markers, response timings, and endpoints, **JetBrains Mono** provides uncompromised legibility.

### Principles
- **Negative Letterspacing:** Large display and body hierarchies leverage tightly negative tracking (`-0.035em` to `-0.01em`) to replicate modern high-density developer consoles.
- **Vertical Alignment:** Strict alignment along base metric heights prevents micro-jitter during layout shifts.
- **Visual Weight:** Medium (`500`) and Semibold (`600`) weights anchor the informational structure without needing heavy bold strokes.

## Layout & Spacing

The layout is built on a responsive 12-column structural grid system anchored by a maximum container width of `1280px` for directory listings and documentation hubs.

### Rhythm & Breakpoints
- **Mobile (< 768px):** Single-column stack with `margin: 1rem`, dynamic `space-sm` component gaps, and sticky bottom navigation elements.
- **Tablet (768px - 1024px):** 6-column fluid structure, `margin: 2rem`, and balanced dual-pane navigation.
- **Desktop (> 1024px):** 12-column grid system with `margin: 3rem` and `gutter: 1.5rem`. Directory view toggles seamlessly between multi-column card matrices and high-density tabular views.

## Elevation & Depth

Visual hierarchy is constructed via architectural stacking and frosted translucent tiers rather than muddy, high-spread shadows.

### Elevation Levels
- **Level 0 (Foundation):** `#fafafa` canvas (Light) or `#09090b` (Dark). Flat background plane.
- **Level 1 (Cards & Data Panels):** Background: `#ffffff` (Light) or `#121215` (Dark), bordered by an ultra-crisp hairline rule: `1px solid rgba(0, 0, 0, 0.06)` (Light) or `1px solid rgba(255, 255, 255, 0.08)` (Dark). Shadow: `0 1px 2px rgba(0, 0, 0, 0.04)`.
- **Level 2 (Hovered Surface / Popover):** Slight upward shift (`translate-y-[-1px]`), shadow: `0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)`. An inner stroke highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.8)` in light mode, `inset 0 1px 0 0 rgba(255, 255, 255, 0.12)` in dark mode) simulates a beveled glass edge.
- **Level 3 (Modal Dialogs & Command Bar / Raycast Style):** Translucent backdrop: `rgba(255, 255, 255, 0.8)` (Light) or `rgba(18, 18, 21, 0.85)` (Dark), accompanied by `backdrop-filter: blur(16px)` and a diffused halo: `0 24px 48px -12px rgba(0, 0, 0, 0.12)`.

## Shapes

The design uses a refined, soft geometric silhouette (`roundedness: 1`). Corner radii are deliberately contained to convey engineered discipline and technical rigor:

- Standard structural elements (cards, containers, text fields) use `0.25rem` to `0.5rem` (`rounded-lg`).
- Dialogs and command palettes scale to `0.75rem` (`rounded-xl`).
- Status chips, protocol badges (e.g., `REST`, `GraphQL`, `gRPC`), and interactive pills use full circular geometry (`9999px`) to create optical harmony against structural rectangular grids.

## Components

### Buttons
- **Primary:** Solid `#09090b` (Light) or `#fafafa` (Dark) background with inverted typography. Subtle top inner highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`). Hover: micro-opacity drop (`0.92`).
- **Ghost / Secondary:** Transparent canvas with `1px solid rgba(0,0,0,0.08)` (Light) / `rgba(255,255,255,0.1)` (Dark). Hover states reveal a soft ambient wash (`rgba(0,0,0,0.03)` / `rgba(255,255,255,0.04)`).
- **Shortcut Action:** Features keyboard shortcut indicators (`⌘K`, `↵`) aligned to the trailing edge in `JetBrains Mono` at `10px`.

### API Cards
- Compact structural units featuring the API provider logo, official endpoint category, latency metric indicator, and authentication tag (e.g., `Bearer`, `OAuth 2.0`, `No Auth`).
- Border shifts on hover to `#6366f1` at `20%` opacity, accompanied by an ultra-soft radial gradient spot illumination that follows cursor entry.

### Chips & Protocol Badges
- **Pill Badges:** Capsule form with `label-pill` typography.
- **REST:** Tinted neutral slate.
- **GraphQL:** Indigo tint (`rgba(99, 102, 241, 0.08)` background, `#6366f1` text, `1px solid rgba(99, 102, 241, 0.2)` border).
- **Status Indicator:** Glowing micro-dot (`6px`) with CSS ping animation for `99.9%` operational APIs.

### Command Bar & Search (Raycast Style)
- Global floating palette with blur filter, instant keyboard-driven search indexing, category filters, and live preview panels for documentation schemas and endpoint response times.

### Inputs & Toggles
- Inputs feature zero background offset in resting state, snapping to an active glowing halo (`0 0 0 1px #09090b` in light mode, `0 0 0 1px #fafafa` in dark mode).
- Theme toggle: Minimal icon-slider utilizing spring easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`).