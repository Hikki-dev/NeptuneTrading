---
target: hummer-products.html
total_score: 25
p0_count: 0
p1_count: 4
timestamp: 2026-06-06T17-02-15Z
slug: hummer-products-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Filter tabs show active state; breadcrumb shows location |
| 2 | Match System / Real World | 3 | B2B language clear; "supercapacitor" unexplained |
| 3 | User Control and Freedom | 3 | Filter tabs, back link, clear CTAs |
| 4 | Consistency and Standards | 2 | Hero navy → white → cream → blinding yellow → cream → yellow CTA — no coherent color narrative |
| 5 | Error Prevention | 3 | Contact links pre-fill product context |
| 6 | Recognition Rather Than Recall | 3 | All products visible, filter tabs show categories |
| 7 | Flexibility and Efficiency | 2 | Filter tabs good; no compare, no quick-jump anchors |
| 8 | Aesthetic and Minimalist Design | 1 | Two intro sections; 10 identical cards; repeated labels; cream background |
| 9 | Error Recovery | 3 | Contact form handles errors |
| 10 | Help and Documentation | 2 | FAQ exists but generic; no inline specs or comparison |
| **Total** | | **25/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict
LLM: cream background on HUMMER page; identical card grid (10 of 11 cards identical); "Industry Applications" repeated eyebrow label on every card; hero-metric stat trio (4,000A / 24V/12V / GM). Full-width #ffd100 brand story section fails WCAG contrast.
Detector: 0 findings.

## Priority Issues
P1 - Blinding yellow brand-story section: background #ffd100 with body text, ~1.8:1 contrast, fails WCAG AA. Best storytelling on page is unreadable.
P1 - 10 identical product cards: no visual differentiation between jump starters, power banks, accessories. No triage cues for B2B buyer scanning.
P1 - Cream/warm-neutral product grid background (#fffdf5 → #fffcee → #f9f8f2): off-brand AI-default cream on a page that should feel industrial. Incoherent color narrative.
P1 - Two consecutive "authorized distributor" sections before products: Division Intro + GM Credibility = 2 full viewport heights of credentials before any product is visible.
P2 - Hero-metric stat trio in brand story: 4,000A / 24V/12V / GM as SaaS-style metric row, banned pattern.
P2 - "Industry Applications" eyebrow label repeated on every card.

## Persona Red Flags
B2B Procurement Manager: lands on page, hits 2 credential sections before seeing products. Abandonment risk high.
Mobile buyer: filter tabs tight on mobile; yellow brand story section unreadable on any screen.

## Minor Observations
- product-b2b-section missing division-card--hummer class
- FAQ heading italic <em> on "FAQ" has no visual payoff
- Section heading "HUMMER Industrial Product Showcase" is generic filler
