# Google Stitch — prompts to generate the frontend

Stitch works best **one screen at a time**. Generate them in the order below.
Paste each block as-is. After each screen generates, export the HTML and drop it
into this repo (I'll tell you where) — or just screenshot it and send it to me.

Keep the **Design system** block pinned at the top of every prompt so the screens
stay visually consistent.

---

## 0. Design system (prepend this to EVERY prompt)

```
DESIGN SYSTEM — use these exact values on every screen.

Brand: Galala University Class of 2026 senior varsity jacket drop.
Vibe: premium streetwear brand meets American collegiate athletics.
Think Aime Leon Dore, Represent, and university team-store lookbooks.
Confident and expensive, NOT cutesy, NOT corporate, NOT a school portal.

COLORS
- Navy (primary, backgrounds):      #16265C
- Ink (deep backgrounds, footer):   #0B1330
- Forest (embroidery green):        #24422F
- Turf (accent, CTAs, highlights):  #43B02A
- Cream (jacket body, light bg):    #F0E7D5
- Bone (off-white text on navy):    #FBF8F1
- Off-black:                        #111111

TYPE
- Display / headlines: heavy collegiate slab or condensed varsity block
  letters, ALL CAPS, very tight letter-spacing, huge (clamp 48px to 140px).
- Accent / script: a retro baseball script for single words like "Senior",
  "Class of", "Drop" — used sparingly, overlapping the display type.
- Body / UI: clean geometric sans, generous line height, medium weight.

TEXTURE & MOTION
- Subtle film grain / noise overlay across dark sections.
- Chunky 2px cream borders and "patch" style rounded cards, like embroidered
  varsity patches.
- Numbers styled like jersey numbers: outlined, layered drop shadow.
- Generous whitespace. Big images. Nothing cramped.

LAYOUT
- Mobile-first. Most buyers are on phones. Every screen must look
  intentional at 390px wide, then scale up to 1440px.
```

---

## 1. Landing / hero

```
[paste DESIGN SYSTEM here]

Screen: Landing page hero for a senior varsity jacket drop.

- Full-viewport navy (#16265C) hero with film grain.
- Small pill badge top center: "GALALA UNIVERSITY — CLASS OF 2026".
- Enormous stacked display headline, cream, tight leading:
  "SENIOR" / "JACKET" / "'26"
  with the word "Senior" rendered in the retro baseball script, rotated
  slightly, overlapping the block letters.
- A large cutout photo of a model in a cream varsity jacket, centered,
  breaking outside the headline's bounding box (text behind, photo in front).
- Two CTAs side by side: primary solid Turf green "RESERVE YOURS",
  secondary outlined cream "SIZE CHART".
- A thin marquee/ticker strip along the bottom edge scrolling
  "LIMITED RUN • CLASS OF 2026 • CUSTOM NAME + NUMBER •" repeating,
  cream text on forest green.
- Sticky minimal top nav: left = GU seniors wordmark, right = links
  (The Jacket, Sizes, Order) plus a small green "ORDER NOW" button.
```

---

## 2. The jacket / detail gallery

```
[paste DESIGN SYSTEM here]

Screen: Product detail section, cream (#F0E7D5) background.

- Section label, small, uppercase, letterspaced, forest green: "THE JACKET".
- Big display headline off-black: "BUILT TO BE KEPT."
- Asymmetric editorial photo grid, 3 images at different sizes and
  vertical offsets (not a uniform grid): a back shot showing the name and
  number, a side shot showing the chest letter, and a tight macro of the
  embroidered sleeve crest.
- Each photo has a small caption tag in the corner, monospace uppercase,
  e.g. "01 / BACK — CUSTOM NAME + '26", "02 / CHEST — CHENILLE LETTER",
  "03 / SLEEVE — CLASS CREST".
- Below the grid, a row of 4 spec cards styled like embroidered patches
  with 2px forest borders: "HEAVY FLEECE", "CHENILLE PATCHES",
  "RAGLAN SLEEVE", "YOUR NAME ON THE BACK". Each with a tiny icon and one
  line of supporting text.
```

---

## 3. 3D showcase section

```
[paste DESIGN SYSTEM here]

Screen: Full-bleed dark (#0B1330) section that showcases a rotating 3D
jacket.

- Dead center, a large empty square/portrait stage area reserved for a 3D
  model viewer — leave it EMPTY, just a subtle radial glow behind where the
  jacket will sit. Do not put a photo here.
- Behind the stage, enormous outlined display text "2026" in stroke-only
  cream letters at very low opacity, so the jacket floats in front of it.
- Small hint below the stage: "DRAG TO ROTATE" with a rotate icon,
  uppercase, letterspaced, low opacity.
- Left and right of the stage on desktop (stacked above/below on mobile),
  short annotation lines with thin connector rules pointing inward:
  "CHENILLE 'H' PATCH", "CLASS CREST — LEFT SLEEVE",
  "CUSTOM NAME + NUMBER", "RIBBED CUFF + HEM".
```

---

## 4. Size chart

```
[paste DESIGN SYSTEM here]

Screen: Size guide section on cream (#F0E7D5).

- Headline: "FIND YOUR FIT."
- Left: a clean line-art technical drawing of the jacket, front view, with
  thin dimension arrows labelled A (chest), B (length), C (sleeve).
- Right: a size table, sizes S / M / L / XL / XXL as rows, columns
  A Chest (cm), B Length (cm), C Sleeve (cm). Table styled editorially —
  no heavy borders, just hairline rules, generous row height, the size
  letter set large in the display face.
- A toggle above the table: "CM / IN".
- Callout box below in forest green: "Oversized fit. If you're between
  sizes, size down. Still unsure? Message us on WhatsApp."
- Small note: "Measurements are of the garment, laid flat, ±2cm."
```

---

## 5. Order form

```
[paste DESIGN SYSTEM here]

Screen: Order form, navy (#16265C) background, single centered column,
max-width 640px.

- Headline: "CLAIM YOUR JACKET."
- Sub: "Limited run. Once the order closes, that's it."
- Form fields, all with floating labels, 2px cream borders, transparent
  fills, chunky 56px tall inputs:
  1. Full name (text)
  2. WhatsApp number (tel)
  3. Faculty / Major (select)
  4. NAME ON BACK (text, max 12 chars, with a live character counter)
  5. NUMBER ON BACK (text, max 2 chars)
  6. Size (segmented button row: S M L XL XXL — big tappable squares,
     selected state fills Turf green)
  7. Payment method (three large selectable cards, radio behavior, each
     with an icon and a one-line description):
       - InstaPay
       - Vodafone Cash
       - Cash (arrange later)
  8. Notes (optional textarea)
- Live preview panel above or beside the form showing the back of the
  jacket with the typed name and number rendered on it in the varsity face.
- Submit button, full width, Turf green, uppercase: "PLACE ORDER".
- Under the button, fine print: "You'll get an order number on the next
  screen. Send your payment screenshot with that number on WhatsApp."

Also generate the SUCCESS state of this screen:
- Big cream checkmark inside a circle.
- "ORDER RECEIVED" headline.
- The order number displayed huge, jersey-number style: "GU26-0042",
  with a small "copy" icon next to it.
- A large green WhatsApp button: "SEND PAYMENT PROOF ON WHATSAPP".
- Three numbered steps beneath it: 1 Transfer the amount, 2 Screenshot the
  confirmation, 3 Send it on WhatsApp with your order number.
```

---

## 6. FAQ + footer

```
[paste DESIGN SYSTEM here]

Screen: FAQ accordion plus footer.

- FAQ on cream. Headline "QUESTIONS." Accordion rows with hairline rules,
  large uppercase questions, plus/minus toggle on the right.
  Questions: When does the order close? / When do I get my jacket? /
  Can I change my name or size after ordering? / How do I pay? /
  What if it doesn't fit? / Can non-seniors order one?
- Footer on ink (#0B1330). Enormous outlined wordmark "GU SENIORS '26"
  spanning the full width, clipped by the bottom edge of the page.
- Above it: Instagram handle, WhatsApp link, and a line
  "Made by the Class of 2026." Small print: "Not an official Galala
  University store."
```

---

## Notes when you're in Stitch

- Generate mobile first if it gives you the option, then ask it for the
  desktop variant of the same screen.
- If a screen comes out too "corporate template", add to the prompt:
  *"more editorial, more negative space, bigger type, less like a SaaS
  landing page."*
- Don't worry if the photos it invents are wrong — those get swapped for
  the real shoot photos. Judge it on **layout, type scale, and spacing.**
- Export each screen's HTML, or send me screenshots. Either works.
