---
name: Obsidian Precision
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e11'
  surface-container-low: '#1b1b1f'
  surface-container: '#1f1f23'
  surface-container-high: '#292a2d'
  surface-container-highest: '#343538'
  on-surface: '#e3e2e6'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e3e2e6'
  inverse-on-surface: '#303034'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#bdc2ff'
  on-secondary: '#131e8c'
  secondary-container: '#2f3aa3'
  on-secondary-container: '#a8afff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#2f3aa3'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#121316'
  on-background: '#e3e2e6'
  surface-variant: '#343538'
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.035em
  display-hero-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  code-base:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.01em
  code-badge:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-xs:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-sm: 1rem
  margin-lg: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels an uncompromising, hyper-engineered luxury aesthetic tailored for senior engineers, system architects, and technical founders. Drawing inspiration from precision productivity tools like Linear, Raycast, and Vercel, the interface treats API indexing as high craft. 

The aesthetic blends **Minimalism** with **Dark Glassmorphism** and subtle **Luminous Accents**:
- Ultra-deep obsidian canvases that eliminate eye fatigue during continuous sessions.
- Laser-sharp optical micro-details: 1px sub-surface borders, calibrated specular highlights, and concentrated indigo photonic blooms.
- Restraint over decoration: visual weight is governed entirely by information density, typographic contrast, and state illumination.
- Atmospheric feedback: interactions feel instantaneous, tactile, and frictionless, evoking executive command lines and luxury developer instrument panels.

## Colors

The palette is engineered around dark light absorption, high-fidelity legibility, and luminous visual feedback.

### Surface Tones
- **Base Canvas (`#0a0b0e`)**: Deep obsidian foundation absorbing maximum glare.
- **Sub-canvas Layer (`#0f1117`)**: Structural foundation for divided views, nested sidebars, and inactive wells.
- **Card Surface Level 1 (`#141721`)**: Primary container surface for directories, tables, and API cards.
- **Card Surface Level 2 (`#181b26`)**: Hover states, elevated modals, dialogs, and floating command palettes.

### Accent & Signal Colors
- **Primary Accent (`#6366f1`)**: Pure indigo utilized for primary actions, focus rings, selected state highlights, and structural glow gradients.
- **Secondary Accent (`#818cf8`)**: Radiant violet used for active text links, keyboard shortcut indicators, and subtle directional specular shines.
- **Tertiary Success / Uptime (`#10b981`) & Light Emerald (`#34d399`)**: High-contrast, vibrant emerald reserved specifically for 99.99% uptime status indicators, operational health badges, and live telemetry pulses.
- **Error / Degraded (`#f43f5e`)**: Laser-crimson for outages and endpoint deprecations.
- **Warning / Latency (`#f59e0b`)**: Amber for rate-limit warnings and high p99 latency spikes.

### Borders & Overlays
- **Default Structural Border**: `rgba(255, 255, 255, 0.08)`
- **Hover/Active Border**: `rgba(255, 255, 255, 0.16)`
- **Luminous Glow Layer**: `rgba(99, 102, 241, 0.15)`

## Typography

Typography pairs high-efficiency neutral prose with razor-sharp monospaced data clarity.

- **Primary Interface (Geist)**: Delivers dense information hierarchy without visual clutter. Tightly tracked headlines (`-0.025em` to `-0.035em`) deliver a unified, modern silhouette for high-impact titles and technical summaries.
- **Technical & Telemetry (JetBrains Mono)**: Encodes all API metrics, HTTP verb tags (`GET`, `POST`, `GRAPHQL`), latency numbers (`18ms`), response status codes, and terminal snippets.
- **Case Rules**: Micro metadata (status badges, categories, keyboard shortcuts) is rendered in uppercase `JetBrains Mono` with loose tracking (`0.04em` to `0.08em`) to guarantee quick peripheral scanning.

## Layout & Spacing

Layouts follow a **12-column fluid grid** centered within a max-width container of `1440px`.

### Responsive Breakpoints & Reflow
- **Desktop (`>= 1280px`)**: 12 columns, 32px (`gutter-lg`) gutters, 64px (`margin-lg`) canvas margins. Directory view splits into a fixed 280px filter rail and a dynamic 3-column API card matrix.
- **Tablet (`768px - 1279px`)**: 8 columns, 24px (`gutter`) gutters, 32px (`margin`) margins. Filter rail collapses into a slide-over drawer; API cards display in a 2-column matrix.
- **Mobile (`< 768px`)**: 4 columns, 16px (`gutter-sm`) gutters, 16px (`margin-sm`) margins. Directory collapses into a 1-column vertical stack with horizontal sticky filter chips.

### Grid Alignment
All component paddings and margins strictly conform to a 4px sub-grid built from the `space-*` scale. Spacing within atomic elements (e.g., status dot to text label) defaults to `space-xs` (4px) or `space-sm` (8px). Structural padding within cards and layout blocks adheres to `space-md` (16px) or `space-lg` (24px).

## Elevation & Depth

Visual hierarchy is constructed through **Tonal Stacking**, **Glassmorphism**, and **Luminous Edges**, discarding heavy muddy drop shadows in favor of crisp dark-mode light simulation.

### Depth Layers
- **Surface Level 0 (Obsidian Floor - `#0a0b0e`)**: The zero plane. Hosts ambient background radial gradients (`rgba(99, 102, 241, 0.05)` blurred at 120px).
- **Surface Level 1 (Frosted Navigation Header)**: Translucent glass layer (`rgba(10, 11, 14, 0.75)`) with a `16px` backdrop blur (`backdrop-filter: blur(16px)`), bounded on the bottom by a `1px` border of `rgba(255, 255, 255, 0.08)`.
- **Surface Level 2 (Standard Container / Card - `#141721`)**: Base container elevation. Defined by a razor 1px inner or perimeter stroke of `rgba(255, 255, 255, 0.08)`.
- **Surface Level 3 (Elevated / Hover State - `#181b26`)**: Triggered by user interaction. The border illuminates to `rgba(255, 255, 255, 0.16)`, accompanied by an inner top specular sheen (`inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`) and a faint indigo ambient bloom: `0 8px 32px -8px rgba(99, 102, 241, 0.2)`.
- **Surface Level 4 (Overlays, Modals, Quick Open Palette - `#141721`)**: Floating technical surfaces with high opacity, backed by `blur(24px)`, a perimeter stroke of `rgba(255, 255, 255, 0.12)`, and an omnidirectional deep shadow: `0 24px 64px -12px rgba(0, 0, 0, 0.8)`.

## Shapes

The design system uses a controlled corner radius strategy (`roundedness: 2`), balancing modern precision with human-scale software aesthetics:
- **Base Components (0.5rem / 8px)**: Standard buttons, text input fields, code blocks, dropdown items, and table selection highlights.
- **Large Containers (1rem / 16px)**: API cards, preview panels, documentation sheets, and filter modules.
- **Overlays & Dialogs (1.5rem / 24px)**: Modal containers, command palettes, and floating banners.
- **Full Pill (`9999px`)**: Reserved exclusively for uptime indicators, latency chips, protocol tags (`REST`, `gRPC`), and keyboard shortcut (`kbd`) badges.

## Components

### Buttons & Interactive Controls
- **Primary Button**: Solid indigo background (`#6366f1`) with crisp white typography (`Geist 14px Medium`), top inner edge highlight (`rgba(255, 255, 255, 0.2)`), and dynamic hover transition to `#4f46e5` with a `0 0 20px rgba(99, 102, 241, 0.4)` bloom.
- **Secondary Button**: Obsidian surface (`#141721`) encased in a `1px` border of `rgba(255, 255, 255, 0.08)`. Hover transitions the background to `#181b26` and border to `rgba(255, 255, 255, 0.2)`.
- **Ghost Button**: Transparent background, muted slate text (`#94a3b8`), transitioning to `rgba(255, 255, 255, 0.05)` fill on hover with `#f8fafc` text.

### API Cards
- **Base Style**: Elevated `#141721` container with `16px` radius and `1px` border of `rgba(255, 255, 255, 0.08)`. Internal padding is `20px`.
- **Header Structure**: Top row includes the API brand mark (rounded 8px container), the API name in `headline-sm`, and the uptime chip on the far right.
- **Body & Metrics**: Monospaced endpoint URL preview (`code-base`) with copy action, average latency counter (`JetBrains Mono 12px`), and categories tagged via subtle chips.
- **Hover State**: Seamlessly elevates background to `#181b26`, illuminates outer stroke with an indigo trace (`rgba(99, 102, 241, 0.4)`), and projects a soft bottom-right directional flare.

### Live Status & Uptime Badges
- **Operational Badge**: Pill container with `rgba(16, 185, 129, 0.08)` background and `1px` border of `rgba(16, 185, 129, 0.2)`. Houses a 6px emerald (`#10b981`) dot equipped with a continuous CSS pulse wave animation, paired with "99.99%" text in `code-badge`.
- **Degraded Badge**: Pill container with `rgba(245, 158, 11, 0.08)` background, amber dot (`#f59e0b`), and latency delta indicator.

### Input Fields & Search Bars
- **Command Palette Search Input**: Obsidian level 1 (`#141721`) background with an inset `1px` border of `rgba(255, 255, 255, 0.1)`. Height: 44px; typography: `body-md`. Left-aligned with an icon and right-aligned with a native dark `kbd` pill (`⌘K`). On focus: zero outline, border shifts to `#6366f1`, backed by a 3px outer glow ring of `rgba(99, 102, 241, 0.2)`.

### Chips & Protocol Tags
- **Protocol Tags (`REST`, `GraphQL`, `gRPC`, `WebSocket`)**: Micro pill containers with `JetBrains Mono 11px`, 2px horizontal padding, 8px vertical padding, neutral dark fill (`rgba(255, 255, 255, 0.04)`), and low-contrast borders (`rgba(255, 255, 255, 0.06)`).

### Selection Controls (Checkboxes & Radios)
- **Checkboxes**: 16x16px squares with 4px border radius. Inactive: background `#0f1117`, border `rgba(255, 255, 255, 0.2)`. Checked: background `#6366f1`, border `#6366f1`, featuring an ultra-crisp white check glyph with an instantaneous snap scale transition.

### Lists & Key-Value Telemetry Tables
- **Lists**: Borderless rows separated by `1px` dividers of `rgba(255, 255, 255, 0.04)`. Height: 48px. Alternating hover state introduces `rgba(255, 255, 255, 0.02)` fill with zero transition lag.