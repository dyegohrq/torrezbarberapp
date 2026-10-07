---
name: Torrez Barber Modern Luxury
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d1c5b4'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#9a8f80'
  outline-variant: '#4e4639'
  surface-tint: '#e9c176'
  primary: '#e9c176'
  on-primary: '#412d00'
  primary-container: '#c5a059'
  on-primary-container: '#4e3700'
  inverse-primary: '#775a19'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#e8c178'
  on-tertiary: '#412d00'
  tertiary-container: '#c4a05a'
  on-tertiary-container: '#4e3700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea5'
  primary-fixed-dim: '#e9c176'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5d4201'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdea4'
  tertiary-fixed-dim: '#e8c178'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4202'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-eyebrow:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.14em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies modern gentleman luxury fused with contemporary urban precision. Built for a high-end barbershop experience, it balances traditional artisanal grooming with streamlined digital booking and e-commerce capability.

The visual direction draws from **Dark Luxury Minimalism** combined with subtle **Tactile Metallic** accents:
- **Atmosphere:** Deep carbon blacks, obsidian panels, and warm brushed-gold finishes evoke exclusivity, confidence, and bespoke care.
- **Voice & Tone:** Crisp, direct, sophisticated, and welcoming. Information is delivered with quiet authority without clutter or gimmicks.
- **Target Audience:** Modern men who value punctuality, elevated personal aesthetics, precise grooming, and effortless digital convenience.

## Colors

The palette revolves around deep pitch-blacks, low-luminance graphite layers, and warm antique gold highlights that reflect salon shear steel and fine gold leafing.

### Foundation & Surfaces
- **Canvas / Root Background (`#0D0D0D`):** Deep obsidian ground that absorbs visual noise and maximizes gold contrast.
- **Surface Level 1 (`#141414`):** Section backgrounds, sticky navigation bars, and footer containers.
- **Surface Level 2 (`#1C1C1C`):** Service cards, product tiles, input backgrounds, and modal dialogues.
- **Dividers & Subtle Borders (`#262626`):** Structural boundaries, tab splitters, and card strokes.

### Gold Accent Scale
- **Primary Action (`#C5A059`):** Core CTA buttons, interactive icons, active steppers, and pricing emphasis.
- **Vibrant Accent (`#D4AF37`):** Hover states, badges, highlight words in display headlines, and badge backgrounds.
- **Dark Gold / Muted (`#9E7D3B`):** Pressed button states, inactive step markers, and secondary borders.

### Typography & Content Contrast
- **Text High Emphasis (`#FFFFFF`):** Display titles, card headers, and critical modal metrics.
- **Text Medium Emphasis (`#E5E5E5`):** General paragraph text, service descriptions, and primary inputs.
- **Text Muted / Low (`#9CA3AF`):** Micro-labels, operating hours, metadata, and breadcrumbs.

## Typography

The type hierarchy pairs **Playfair Display** for brand editorial poise with **Plus Jakarta Sans** for crisp, ergonomic user interface interactions.

- **Editorial Flourish:** Hero headlines use Playfair Display with deliberate italicized or colored spans (`#C5A059`) on key value propositions (e.g., *combina*, *Valentina*).
- **Eyebrow Headers:** Section taglines and step indicators (e.g., `O QUE FAZEMOS ?`, `PASSO 1`) employ uppercase `label-eyebrow` styling with tracking (`letter-spacing: 0.14em`) tinted in `#C5A059`.
- **Numeric Clarity:** Prices, hours, and phone numbers are rendered with tabular figures (`tnum`) in Plus Jakarta Sans SemiBold/Bold to ensure clear scanning.

## Layout & Spacing

A structured 12-column grid anchors the desktop canvas, standardizing content maximum width at `1200px` for optimal reading flow and card scanning.

### Responsive Breakpoints
- **Mobile (`< 640px`):** 4 columns, `margin-mobile: 1.25rem`, single-column cards and full-width modal sheets.
- **Tablet (`640px - 1024px`):** 8 columns, `margin: 2rem`, 2-column service and product grids.
- **Desktop (`> 1024px`):** 12 columns, `margin: 3rem`, up to 5-column service showcases with horizontal scroll support.

### Vertical Rhythm
Sections feature generous breathing space (`space-xl` * 2 to 3) between themes (Services, Products, Value Props, Booking, Location) paired with compact internal card margins (`space-md`) to keep interaction clusters tight.

## Elevation & Depth

Visual depth is achieved through **Tonal Layering** and **Subtle Edge Definition** rather than aggressive dropshadows:

- **Level 0 (Base Canvas):** Solid `#0D0D0D` with zero shadow.
- **Level 1 (Card & Modular Units):** `#1C1C1C` background framed by a hairline `1px solid #262626` outline. On hover, the border shifts smoothly to `rgba(197, 160, 89, 0.45)`.
- **Level 2 (Modals & Popovers):** `#141414` elevated with a 40% dark ambient shadow (`0 20px 50px rgba(0, 0, 0, 0.8)`) paired with a `1px solid #333333` perimeter stroke to cleanly detach the modal from the backdrop overlay (`rgba(0, 0, 0, 0.75)` backdrop blur 8px).
- **Floating Floating Accent Buttons:** Optional soft gold ambient glow (`0 8px 24px rgba(197, 160, 89, 0.25)`) reserved exclusively for primary action triggers.

## Shapes

The design system maintains a **Soft Architectural (`roundedness: 1`)** silhouette. This mirrors the sharp, crisp cuts of professional grooming while remaining inviting.

- **Standard Elements (Buttons, Inputs, Badges, Cards):** `0.25rem` (4px) to `0.375rem` (6px) border radius.
- **Modals & Dialogs:** `0.5rem` (8px) border radius for controlled containment.
- **Icon Circles / Floating Avatars:** `50%` pill/circle form when isolating scissor badges or brand marks.

## Components

### Buttons
- **Primary Button:** Solid `#C5A059` background with dark `#0D0D0D` bold uppercase text (`label-lg`). Hover state transitions to `#D4AF37` with slight brightness shift; active state deepens to `#9E7D3B`.
- **Secondary / Outline Button:** Transparent surface with `1px solid #C5A059` border and `#C5A059` typography. Hover adds a subtle `rgba(197, 160, 89, 0.1)` gold background tint.
- **Text Action Button:** Left-aligned or centered gold text with an icon arrow (e.g., `← VOLTAR`), uppercase tracking `0.08em`.

### Service & Product Cards
- **Image Showcase Cards:** Upper 60% contains photograph with bottom vignette fade; floating gold-accent circular icon badge overlaps the seam.
- **Content Area:** Title in `#FFFFFF`, short description in `#9CA3AF`, and right-aligned or prominent gold price tag in `#C5A059` (`headline-sm`).
- **Interactive States:** Lift of `translateY(-4px)` with border color lighting up to gold on hover.

### Multi-Step Booking Modal
- **Header:** Uppercase step indicator in gold (`AGENDAMENTO - ETAPA X DE Y`) alongside an explicit `#FFFFFF` close cross.
- **Review List:** Structured two-column summary table with hairline horizontal rules (`#262626`), muted left label column (`#9CA3AF`), and white right data column (`#FFFFFF`), ending in a bold gold price row.
- **Bottom Action Area:** Full-width primary CTA ("CONFIRMAR AGENDAMENTO") stacked over a secondary text back button ("← VOLTAR").

### Input Fields & Selectors
- **Fields:** Dark charcoal fill (`#1C1C1C`), subtle border (`#262626`), high-contrast typed text (`#FFFFFF`), placeholder text in `#6B7280`. Focused state triggers a `1px solid #C5A059` glow.
- **Slots Grid:** Date and time slot selectors styled as toggleable chips; selected slot fills `#C5A059` with `#0D0D0D` text.

### Badges & Infobar Pills
- **Feature Pills:** Micro-labels with gold iconography (barber icon, clock, pin), `#FFFFFF` text at `11px`, and faint background borders for service announcements.