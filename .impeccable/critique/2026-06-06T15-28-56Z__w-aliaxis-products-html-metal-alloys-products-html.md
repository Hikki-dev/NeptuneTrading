---
target: hummer-products.html, snow-aliaxis-products.html, metal-alloys-products.html
total_score: 23
p0_count: 1
p1_count: 3
timestamp: 2026-06-06T15-28-56Z
slug: w-aliaxis-products-html-metal-alloys-products-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Breadcrumbs work; HUMMER FAQ accordion broken (P0 HTML bug) |
| 2 | Match System / Real World | 3 | Technical copy is accurate and B2B-appropriate; minor |
| 3 | User Control and Freedom | 3 | "All Products" back-link in every hero breadcrumb; solid |
| 4 | Consistency and Standards | 2 | HUMMER uses black+yellow; Snow/Aliaxis uses navy+blue; Metal Alloys uses a third palette — all three pages feel like different sites |
| 5 | Error Prevention | 1 | HUMMER FAQ div has broken HTML (`faq-gri` truncation); accordion JS silently fails |
| 6 | Recognition Rather Than Recall | 3 | Clear product names, visible CTAs, good breadcrumbs |
| 7 | Flexibility and Efficiency | 2 | No category filter on HUMMER (11 products), no jump-nav, no search |
| 8 | Aesthetic and Minimalist Design | 2 | Identical card grid 11× on HUMMER, broken image aspect ratios on Metal Alloys, competing accent systems |
| 9 | Error Recovery | 2 | Blur validation exists on contact form; FAQ broken on HUMMER with no fallback |
| 10 | Help and Documentation | 3 | FAQ sections on all 3 pages, catalogue downloads on Snow/Aliaxis |
| **Total** | | **23/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment**: The pages don't scream AI-generated — the content is genuine (real products, real specs, real B2B language). However there are two clear tells:

1. **Identical card grid reflex** — all 3 pages use the exact same `product-card` template repeated: image / badge / h3 / paragraph / application-list / CTA. HUMMER has 11 of these in a row with zero variation. There is no featured product, no hierarchy, no visual rhythm change across the grid. This is the most saturated AI scaffold pattern in the codebase.

2. **Credibility card 4-up** — the `credibility-grid` on Snow/Aliaxis and Metal Alloys renders 4 icon+heading+body cards in a row. It's an identical-card-grid inside an already identical-card-grid page.

**Deterministic scan**: Detector returned clean (`[]`) — no gradient text, no side-stripe borders, no numbered section markers detected in the HTML.

**Visual overlays**: Browser injection not attempted in this review; source-file analysis was comprehensive.

## Overall Impression

Snow/Aliaxis is the strongest of the three — navy hero, blue accent system aligned with site direction, download catalogues as a genuine B2B affordance. Metal Alloys has the right approach but its product images are broken (200×88px in a square container). HUMMER is the biggest problem: the yellow-on-black hero visually disconnects the page from the rest of the Neptune site, and the FAQ section has broken HTML that silently kills the accordion.

The single biggest opportunity: **break the identical-card monotony** with a featured-product layout and category grouping, especially on the HUMMER page.

## What's Working

1. **Snow/Aliaxis hero** — the deep navy + diagonal blue grid (`#071030 → #1d3fa8`) with the 3px blue `border-bottom` is sharp and on-brand. It reads "infrastructure" without clichés.
2. **Brand story section on HUMMER** (`hummer-brand-story`) — the split text + military image with origin copy is a genuine differentiator. No other product page has a brand origin story. It earns trust.
3. **B2B "Why Neptune" strips** — the 3-column `product-why-strip` at the bottom of each product section clearly answers "why buy through Neptune" with specific propositions (MTC certificates, authorized distributor, bulk pricing). Procurement managers will read this.

## Priority Issues

### [P0] Broken HTML in HUMMER FAQ section
**What**: Line 577 in `hummer-products.html` reads `<div class="faq-gri             <div class="faq-item">` — the `faq-grid` div is malformed. The class attribute is truncated to `faq-gri` with raw HTML injected into the attribute value.  
**Why it matters**: The FAQ accordion JS targets `.faq-grid > .faq-item`. None of the HUMMER FAQ items will be found. The section silently renders as broken. Procurement managers reading the FAQ get no accordion interaction — they see unstyled questions and answers stacked.  
**Fix**: Replace the broken `<div class="faq-gri...` with `<div class="faq-grid reveal">` and close it properly before `</div>` at line 593.  
**Suggested command**: /impeccable polish

### [P1] HUMMER hero uses black+yellow, disconnected from the Neptune navy brand
**What**: `.trading-page-hero.page-hero--hummer` has `background: #0b0d0f` (near-black) with `color: #ffd100` for h1. Every other page on the site uses a dark navy (`#0b1f4a` / `#071030`) hero. The yellow-text-on-black reads as a car accessories retailer, not a credible B2B distributor.  
**Why it matters**: A procurement manager coming from the homepage (navy hero) or the What We Do page (navy hero) hits the HUMMER page and experiences a complete brand break. The HUMMER identity can be expressed with the yellow `border-bottom` accent and yellow chips — the hero background does not need to be black.  
**Fix**: Change `.trading-page-hero.page-hero--hummer` background to use the same deep navy base as Aliaxis (`#071030 → #0f2460`) with a yellow radial glow overlay and keep the 3px `border-bottom: solid #ffd100`. Change h1 color from `#ffd100` to `#ffffff` with a yellow glow `text-shadow`. This preserves HUMMER identity without breaking the brand system.  
**Suggested command**: /impeccable colorize

### [P1] Identical card grid — 11 HUMMER products in uniform rows with no visual hierarchy
**What**: All 11 HUMMER product cards use identical dimensions, structure, and styling. Jump starters, power banks, inflators, and flashlights all look the same. There is no flagship treatment for the H24 Ultra 4000A (the most capable product), no category grouping (Jump Starters / Power Stations / Power Banks / Accessories), and no visual way to scan the range quickly.  
**Why it matters**: A fleet procurement manager looking for a jump starter has to scan 11 identical cards to find the right one. Cognitive load is high; the products blur together.  
**Fix**: Add a category filter strip above the grid (Jump Starters / Power Stations / Power Banks / Accessories) as tab-style buttons that filter the grid client-side. Promote the H24 Ultra 4000A to a full-width featured card at top. This applies to all 3 pages — Snow/Aliaxis and Metal Alloys would benefit from similar category grouping.  
**Suggested command**: /impeccable layout

### [P1] Metal Alloys product images render as broken thin strips
**What**: Metal Alloys product images are 200×88px or 329×101px — very wide, very short. The `product-card-image` container is a square. With `object-fit: contain` on the image, these render as a thin horizontal stripe at the center of a large empty background. The `mac-cat-brass-alloys.jpg` (329×101) is a strip of metal that occupies roughly 30% of the card's image area height.  
**Why it matters**: The first impression of a metal alloy product category is a squished thin strip on a grey background — it looks like a broken placeholder, not a premium product catalogue.  
**Fix**: For Metal Alloys, change the `product-card--metalco .product-card-image` to use `aspect-ratio: 3/1` (wide landscape) instead of the square default, matching the actual image proportions. Alternatively, source better square or portrait product images.  
**Suggested command**: /impeccable layout

### [P2] `tag-label page-eyebrow` styling on division breadcrumb chips
**What**: All 3 pages have `<span class="tag-label page-eyebrow">HUMMER Power Products</span>` in the hero breadcrumb row. This is the banned eyebrow pattern — small tracked uppercase label on every section.  
**Why it matters**: The breadcrumb navigation purpose is legitimate, but the eyebrow styling marks it as an AI scaffold pattern. The current treatment applies the same "kicker above heading" visual to what is essentially a "you are here" chip.  
**Fix**: Restyle the breadcrumb span as a plain text chip with just a light `background: rgba(255,255,255,0.12)` and no uppercase tracking — remove the `tag-label` class and use `division-breadcrumb-chip` instead.  
**Suggested command**: /impeccable polish

## Persona Red Flags

**Procurement Manager "Tariq"** (B2B buyer, MEP engineer, fleet operator — the primary audience):  
- Opens HUMMER page expecting to find the H24 Ultra for a fleet of 50 trucks. Must scroll through 11 identical cards to reach it; no way to filter by category. Leaves without enquiring.
- Sees the HUMMER page after visiting other Neptune pages — the visual brand break (black vs. navy) introduces doubt: "is this even the same company?"
- Clicks "Request Product Information" on a specific product but lands on the general contact form with no pre-fill visible for which product they wanted. (Note: the URL query params do pre-fill the business-area select, but not the product model.)

**Casey (Distracted Mobile User)**:  
- On mobile, 11 product cards stack vertically — must scroll through the entire HUMMER range with no category navigation. Each card is ~400px tall, so that's ~4400px of single-column scrolling.
- HUMMER hero text `h1` in yellow on near-black: the contrast is acceptable (yellow on black exceeds 4.5:1), but the `p` tag `rgba(255,255,255,0.72)` against `#0b0d0f` gives approximately 10:1 — fine. Snow/Aliaxis hero `rgba(219,234,254,0.8)` against `#071030` — approximately 8:1, also fine.
- Metal Alloys broken image strips are especially obvious on mobile where the card is full-width — a 329×101 image in a square container shows as a 1.5:1 strip on a plain background.

**Jordan (First-Timer / Supplier Prospect)**:  
- Lands on Metal Alloys page not knowing what "admiralty brass" or "cupro-nickel" is. No tooltips, no hover definitions, no glossary links. The copy is accurate but dense. A supplier prospect needs to feel the range at a glance — the identical card grid gives no sense of scale or organization.

## Minor Observations

- The `hummer-brand-story` stats (4,000A / 24V/12V / GM) edge on the hero-metric template ban, but since they're real specs in a content section they pass. Keep them.
- Snow/Aliaxis `credibility-section` has 4 identical `credibility-card` items — it's an icon-grid-within-a-card-grid page. Consider collapsing these into an inline list or a 2-column table with the standard icons stripped.
- The `div-intro-auth-badge` "Authorized Distributor" pill appears identically on all 3 pages. The repetition is fine; the pill is a genuine credibility signal. But the styling (yellow for HUMMER, presumably blue for others) could be unified into a single consistent treatment.
- HUMMER page: `product-cta-band` uses `background: #ffd100` — yellow CTA band. Every other page uses navy/blue for the CTA band. This is brand-intentional but stands out as the only yellow page-wide band on the site.

## Questions to Consider

- "What if the flagship HUMMER product (H24 Ultra 4000A) had its own full-width hero card at the top of the grid — would it make the range feel more intentional and less like a spreadsheet?"
- "Does the HUMMER page need to look like a car accessories site? Or could it look like Neptune — established, sharp, navy — with HUMMER yellow used as the accent, not the dominant?"
- "For Metal Alloys, would a materials-table layout (alloy family / form / standards / applications) work better than a card grid? B2B buyers spec materials from datasheets, not product cards."
