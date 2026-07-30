---
name: Varsity 2026 Drop
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#45464f'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#767681'
  outline-variant: '#c6c5d1'
  surface-tint: '#4d5b94'
  primary: '#001044'
  on-primary: '#ffffff'
  primary-container: '#16265c'
  on-primary-container: '#808fcb'
  inverse-primary: '#b7c4ff'
  secondary: '#645e50'
  on-secondary: '#ffffff'
  secondary-container: '#eae2d0'
  on-secondary-container: '#6a6456'
  tertiary: '#021b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#053200'
  on-tertiary-container: '#39a620'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#03164d'
  on-primary-fixed-variant: '#35437a'
  secondary-fixed: '#eae2d0'
  secondary-fixed-dim: '#cec6b5'
  on-secondary-fixed: '#1f1b10'
  on-secondary-fixed-variant: '#4b4639'
  tertiary-fixed: '#8cfc6d'
  tertiary-fixed-dim: '#71df54'
  on-tertiary-fixed: '#022100'
  on-tertiary-fixed-variant: '#0d5300'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-hero:
    fontFamily: Anton
    fontSize: 80px
    fontWeight: '400'
    lineHeight: 80px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.02em
  accent-script:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style
The design system reflects the intersection of prestige American collegiate athletics and high-end modern streetwear. It targets a demographic that values exclusivity, heritage, and "quiet luxury" sportswear aesthetics. The emotional response is one of belonging to an elite cohort—confident, expensive, and timeless.

The design style is **High-Contrast Editorial**, leaning into a modern interpretation of vintage varsity aesthetics. Key visual motifs include:
- **Patch-inspired Borders:** Use of consistent 2px cream borders to mimic felt-stitched patches.
- **Atmospheric Texture:** A subtle, low-opacity film grain overlay (approx 3-5% opacity) applied to the main background to reduce digital flatness and add tactile warmth.
- **Layered Dimension:** Jersey-style numbering using thick outlines and sharp, hard-edged offset shadows to create a physical, "pressed" look.
- **Editorial Layout:** High-impact, full-width photography contrasted with vast areas of "Bone" and "Cream" whitespace.

## Colors
The palette is rooted in a "Heritage Navy" and "Cream" foundation, moving away from pure white to evoke a vintage, high-quality textile feel.

- **Primary (Navy):** Used for heavy structural blocks, hero containers, and primary buttons.
- **Secondary (Cream):** The primary canvas color. It provides a warmer, more premium feel than white.
- **Tertiary (Turf):** Reserved strictly for high-action CTAs and "Live" status indicators to mimic field grass.
- **Embroidery Forest:** Used for subtle accents, secondary borders, or decorative iconography.
- **Bone:** Used exclusively as a high-contrast text color when sitting on Navy or Deep Ink backgrounds.
- **Deep Ink:** Applied to footers and utility bars to ground the design.

## Typography
Typography is the primary driver of the collegiate brand. 

- **Headlines:** Use **Anton** to achieve a condensed, varsity-block look. All headlines must be uppercase with tight tracking.
- **The "Script" Feel:** While **Bricolage Grotesque** is a sans, its quirky, characterful terminals at medium weights provide a modern nod to retro baseball scripts when used for "Class of" or "Senior" taglines.
- **Body:** **Hanken Grotesk** provides a sharp, contemporary counterpoint to the heavy headlines. Use medium weight for body text to maintain "ink density" on the cream background.
- **Jersey Numbers:** For large numeric displays (e.g., "26"), use Anton with a 2px text-stroke in Cream and a 4px offset drop shadow in Deep Ink.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop (1440px max-width) and a fluid, single-column approach on mobile. 

- **The 8pt System:** All internal component spacing (padding, gaps) must be multiples of 4px.
- **Editorial Margins:** Use generous 64px outer margins on desktop to allow the imagery to breathe. 
- **Sectioning:** Vertical spacing between major sections should be aggressive (120px+) to emphasize a "Lookbook" feel.
- **Mobile Reflow:** On mobile, high-impact imagery should be full-bleed (edge-to-edge), while text containers maintain the 20px safe-area margin.

## Elevation & Depth
This design system avoids soft, blurry shadows in favor of **Structural Stacking** and **Hard Shadows**.

- **Hard-Edge Shadows:** Elements like cards or buttons use a 4px or 8px offset shadow with 100% opacity in a darker shade of the background (e.g., Navy shadow on Cream surface).
- **Tonal Layering:** Depth is created by placing Navy containers on Cream backgrounds. 
- **Stitch Outlines:** Use 2px Cream or Bone borders on dark elements to create a "patch" effect, effectively lifting the element off the page without using shadows.
- **Image Treatment:** Photography should have a slight "film" grain and high contrast to match the tactile nature of the UI.

## Shapes
Shapes are predominantly **Soft (4px - 12px)**. While the typography is aggressive and sharp, the containers mimic the slightly rounded corners of fabric patches and varsity letter appliques.

- **Standard Radius:** 4px for small components (tags, inputs).
- **Large Radius:** 12px for main product cards and image containers.
- **Interactive Elements:** Buttons should never be fully pill-shaped; keep them slightly rounded to maintain a structured, architectural feel.

## Components
- **Primary Buttons:** Navy background, Bone text, uppercase Anton, 2px Cream border, 4px hard shadow.
- **CTA (Turf) Buttons:** Turf background, Off-black text, bold geometric sans. Used only for "Pre-order Now" or "Add to Bag."
- **Varsity Cards:** Cream surface, 2px Forest or Navy border, hard offset shadow. Use for product categories or student features.
- **Status Chips:** Small, rectangular labels with 2px borders. "SOLD OUT" uses Navy/Cream; "LIMITED" uses Turf/Off-black.
- **Input Fields:** Bone background, 2px Navy border, Hanken Grotesk medium weight text. No inner shadows.
- **Jersey Numbers:** Decorative elements using the headline font, featuring a layered stroke and offset shadow style to represent "Class of 26."
- **Lists:** Clean, underlined items with "stitch" (dashed) dividers instead of solid lines.