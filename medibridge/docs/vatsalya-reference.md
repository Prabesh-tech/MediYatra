# Vatsalya visual reference notes

## Scope and method

Reference reviewed on 2026-11-03 at `https://vatsalya.com.np/` and its About, Services, Team, and Contact pages. Browser measurements were taken at 1440x900, 967x537, and 375x812. The page was scrolled through the homepage in short increments; section order was also cross-checked from the rendered heading positions. Screenshots and computed browser styles were used for layout, typography, and interaction checks.

These are design observations, not a content or asset source. No reference wording, names, photos, logos, illustrations, or statistics are to be reused. Some content changes while the page is open, and the site occasionally displays an appointment form overlay. A complete, dedicated DevTools Animations-panel trace was not available; durations below are samples from active browser animations and should be treated as observed examples, not site-wide rules. Unverified behavior is called out rather than inferred.

## Shared design system observed

- **Typography:** Manrope is the principal rendered family. A desktop homepage hero heading measured 60px, weight 700, 75px line-height; at 375px it measured 24px. Main navigation measured 14px. Section eyebrow labels are small, uppercase, bold, and widely tracked; section headings are generally more restrained than the hero.
- **Color and surfaces:** The reference uses a pale blush hero (`rgb(255, 245, 246)`), pink-to-coral gradient panels, strong magenta/pink calls to action, and occasional warm cream/gold accents. This differs from MediYatra’s approved palette; translate hierarchy and contrast, not these colors.
- **Shapes:** Main calls to action are pill-shaped. Service cards are comparatively restrained, with an 8px measured radius and no visible shadow in the sampled state. Some portrait panels use a pronounced asymmetric corner (about 50px). Hero decorations are soft pastel geometric blobs. White/light sections alternate with tinted gradient bands.
- **Container and spacing:** Desktop page content uses a wide centered layout with about 80px horizontal padding at 1440px. Sections use generous vertical spacing; About-page sections use approximately 64–96px vertical padding. Contact form elements use 14px radii and 16px grid gaps.
- **Navigation:** The desktop header is sticky, about 78px tall, with a left brand area, centered/right navigation, and utility controls. Desktop links measured 14px. A separate global utility strip was not evident on the homepage. Contact details instead appear in the Contact page content. Hovering the Services link did not open a dropdown in this run; it behaved as a navigation link. A separate tools control has a disclosure affordance.
- **Mobile header:** Below the desktop navigation breakpoint, links collapse to a hamburger. At 375px the header remains about 78px tall and the desktop nav is hidden. Opening the hamburger showed a full-screen blush gradient drawer with a close control at the upper-right, vertically stacked links, and a call action near the bottom. A floating WhatsApp control remains at the lower-right.
- **Motion samples:** Scroll-triggered content reveals were sampled through the Web Animations API. Active examples included opacity reveals at 300ms with ease-out or a cubic-bezier easing, 700ms with `cubic-bezier(0.4, 0, 0.2, 1)`, and 1000ms ease-out. These were observed after scrolling content into view. They are not a complete timing inventory. Do not copy motion that depends on reference-only content or assets.

## Homepage section order and patterns

| Order | Observed section | Layout and visual treatment | Interaction and responsive notes |
|---|---|---|---|
| 1 | Hero and proof points | Desktop hero fills roughly one viewport and pairs left-aligned text/actions with a large, nearly square portrait panel on the right. The hero uses a pale blush field and soft decorative shapes. A three-item numeric proof row sits immediately below the main message. | At 375px the hero becomes a vertical flow, with text/actions and a 328px square image; the measured heading is 24px. Avoid reusing the reference’s numbers or claims. |
| 2 | Service offerings | A centered uppercase eyebrow introduces an image-led set of four service cards. The cards use image, short title, and a secondary action; the rendered structure includes a horizontal slider. | A card hover transform was not measured. Treat image zoom/lift as a possible design translation only if separately approved and tested. |
| 3 | About / identity | A short image-and-copy story block follows the offering cards. | Appears as a broad editorial section rather than a dense feature grid. |
| 4 | Capability overview | A second explanatory image-and-copy section follows the first. | Alternating content hierarchy continues the long-form story. |
| 5 | Expert showcase | Centered eyebrow with horizontal rules, an editorial heading, and a large featured profile with portrait, role, summary, and consultation/callback/detail actions. A set of smaller portrait/profile items and controls accompanies the feature. | Profile content changed while idle during the review, suggesting carousel advancement, but autoplay interval and pause behavior were not confirmed. The Team page also has category tabs, pagination, a feature/profile area, and a staff-card grid. |
| 6 | Process | A four-step process is laid out in a long, image/icon-supported sequence with numbered steps. | Scroll-triggered reveal behavior was visible on content in this region. MediYatra’s seven steps should retain its own sequence and language. |
| 7 | Reasons / visit guidance | A titled guidance area presents multiple explanatory items in a more compact card/feature layout. | Exact hover behavior was not verified. |
| 8 | Testimonials | A testimonial carousel uses grouped slides with previous/next controls. | Six groups were exposed in the rendered page. Do not reproduce testimonial text, identities, or outcomes. Exact autoplay and pause behavior were not verified. |
| 9 | FAQs | A dedicated FAQ section follows testimonials and precedes editorial/news content. | Accordion-style controls are present in the page structure. Open/close timing and keyboard behavior were not independently measured. |
| 10 | News and footer | Editorial/news cards follow the FAQ. Footer includes navigation and contact-oriented content. | Footer details and hover states were not comprehensively sampled in this review. |

## Inner pages reviewed

### About

- Opens with a breadcrumb-style banner and a large, tinted/gradient introduction area.
- The main story is organized into spacious sections with image-and-copy layouts, mission/vision-style content, and later values/team/credibility sections. The page uses centered eyebrow labels with thin horizontal rules above section headings.
- At the inspected desktop width, sections use generous vertical padding and broad text measures. Shared Manrope typography and pink/coral gradients carry through.
- Mobile imagery and text are presented in a narrower vertical flow; exact animation timing for each About section was not measured.

### Services

- Starts with a compact title/intro area, followed by a services section and multiple detailed image-and-copy panels.
- The service-detail area is long-form, with repeated image/text units and a later guided-selection section. Sampled desktop detail headings were about 28px.
- Use the section rhythm and content hierarchy only. Replace clinical service claims and all reference imagery with verified MediYatra information and approved repository assets.
- Detailed card hover behavior and mobile ordering for every service panel were not individually verified.

### Team / doctors

- Starts with a breadcrumb and photo-backed banner, followed by a featured profile and a larger team listing.
- The desktop page includes category tabs, pagination, profile actions, large portrait panels, and smaller portrait thumbnails. Profile images sit in softly tinted panels with asymmetric rounded corners.
- At 375px there was no horizontal overflow. The page becomes a vertical composition; the featured portrait measured about 290x336px, and the next card portrait about 320x371px. The site’s actual people and photographs are reference-only and must not be used.

### Contact

- Uses an introductory banner, contact channels, location/service-area information, map content, and an appointment form.
- At 1440px, the form measured about 592px wide, used a two-column grid with 16px gaps, and had 14px-rounded controls around 45px tall.
- At 375px the form remained two columns, with the first fields measuring about 152px each; the message field spanned the full 320px form width. The page had no horizontal overflow in this check.
- A delayed appointment overlay appeared during browsing. It is an intrusive state to account for when testing screenshot-based layouts, not a behavior to copy without product approval.

## Interaction audit and confidence

- **Confirmed:** sticky desktop header; desktop nav links; responsive hamburger; full-screen mobile drawer; floating WhatsApp action; contact form grid and control sizing; carousel-style controls in the profile and testimonial areas; scroll-triggered opacity animations at the sampled timings above.
- **Not confirmed:** a Services hover dropdown; exact card hover zoom/lift; exact accordion open/close motion; slideshow/autoplay intervals and pause-on-hover/focus; all focus-ring states; full mobile behavior for every individual homepage section; full footer interactions.
- **Audit limitation:** pages are dynamic and occasionally produced hydration/navigation errors or automatic overlays during inspection. Measurements describe the rendered states observed, not an assurance that every reference interaction works consistently.

## MediYatra adaptation guardrails

- Translate layout, hierarchy, and interaction patterns only. Keep MediYatra’s own colors, logo, Poppins font, wording, route structure, translations, and repository-approved images.
- Use only verified facts and approved text. Do not reproduce reference statistics, patient stories, doctor identities, qualifications, clinical claims, or partner information.
- Keep the required clinical-responsibility statement: “Treatment decisions are made by your doctor and hospital.”
- The reference’s four process steps are not a substitute for MediYatra’s seven-step journey. Use MediYatra’s existing seven-step content.
- Preserve reduced-motion support, keyboard access, visible focus, responsive layouts, and the existing dependency set.
