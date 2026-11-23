# Vatsalya page-structure notes for MediYatra

## Scope and guardrails

Reviewed on 2026-11-03 for structure and interaction patterns only. The shared browser was used to inspect the desktop header and representative About and Services pages; route content was also checked for the requested pages. The existing Vatsalya reference notes were used for previously observed responsive behavior.

Do not reuse Vatsalya copy, names, profiles, photos, logos, illustrations, testimonials, statistics, awards, service claims, or financing claims. The notes below intentionally describe hierarchy and layout rather than reference-site content. Any MediYatra implementation must use its own approved wording and assets, preserve existing routes, and follow README sections 19 and 20. In particular, MediYatra coordinates and supports; doctors and hospitals make clinical decisions.

## Shared header and utility controls

- At 1440px, the header is a roughly 78px-tall horizontal bar. Brand marks sit at the left, the seven principal links occupy the center/right, and utility controls sit in a separate group.
- Main links are direct links rather than a Services mega-menu. The observed primary order is About, Services, Team, Stories, Blog, Clinic, Contact. No separate Home label appears in the desktop nav; the brand links home.
- The utility group contains a payment-plan control, a phone control, and a tools disclosure. A complete email/language/theme group was not visible in the inspected reference header.
- The tools disclosure is visible, but its expanded contents and click/keyboard behavior could not be verified reliably in the rendered session. Do not infer the contents from its label.
- The header remains at the top during scroll. At narrow widths the main links collapse behind a hamburger. A full-screen drawer with a close action and vertically stacked navigation was observed in the earlier mobile review; exact transition timing was not measured.
- A delayed appointment-request overlay appeared during browsing and sometimes obstructed header interactions. Its presence is recorded as an audit limitation, not a pattern to adopt without product approval.
- No reliable compact-on-scroll or hide-on-scroll behavior was confirmed during this review.

## Page structures

### About Us — `/about-us`

1. Breadcrumb/title banner with a page-level action.
2. Introductory story section using a text-and-image split, followed by a compact proof/credential-style visual row. Any reference proof or numbers are excluded from MediYatra adaptation.
3. Mission/vision-style section with another image and copy block.
4. Team/organization feature.
5. Milestone-style visual band.
6. Culture/values section with supporting media.
7. Benefits/reasons grid.
8. Testimonial feature near the end, followed by the shared footer.

The page uses spacious alternating editorial sections and centered section-heading treatments. Exact animation timings and all mobile section ordering were not measured.

### Services — `/services`

1. Page title/intro banner.
2. Service-card group with image, title, summary, and detail link.
3. A supporting explanatory/guidance section.
4. Grouped informational cards, then a later stage/category selection area.
5. Shared footer.

The service cards link to individual `/services/<slug>` pages. Do not reuse the reference’s health advice, categories, claims, or imagery. Individual hover and carousel behavior was not conclusively measured.

### Service detail — `/services/infertility-treatment`

1. Breadcrumb and detail title/banner.
2. Introductory overview with supporting image.
3. Long-form explanatory sections with secondary subheadings and lists.
4. Related-service cards and a call-request action.
5. Shared footer.

The rendered detail content contained material inconsistent with the selected route. Treat this as a reference-site content/data mismatch; only the generic page hierarchy is useful.

### Our Team — `/our-team`

1. Photo-backed title banner.
2. Featured profile area with a large portrait, profile summary, and three actions.
3. Smaller profile thumbnails/selection controls beside or around the featured profile.
4. Category controls and paginated or grouped staff listing.
5. Shared footer.

The earlier mobile review found a vertical composition without horizontal overflow. Portrait panels have pronounced asymmetric rounding. Names, titles, qualifications, bios, and portraits are not transferable.

### Team detail — `/our-team/dr-aakriti-bharati`

1. Profile breadcrumb/label and detail heading.
2. Profile hero with portrait, role, location, experience/credential fields, and action buttons.
3. Long-form biography and a highlighted expertise/reasons section.
4. Related-service cards.
5. Shared footer.

MediYatra must show only verified team data; placeholders must be clearly identified and must not imply a real doctor or clinical qualification.

### Success Stories — `/success-story`

1. A page-led collection of video-style story cards.
2. Repeated media thumbnail, short story label, and person/couple attribution pattern.
3. Carousel-like grouping in the rendered content.
4. Shared footer.

These are real-person testimonials on the reference. MediYatra must not reproduce them or imply outcomes; use only approved stories, otherwise show clearly marked placeholders or omit this content.

### Blogs — `/blog`

1. Editorial listing of image-led post cards.
2. Cards include date, title, excerpt, and a link into a detail route.
3. Shared footer.

No reliable search, category-filter, or pagination interaction was confirmed. Existing blog data should be the sole content source for MediYatra; do not introduce medical advice, prices, statistics, or unsupported author claims.

### Blog detail — `/blog/ivf-cost-what-affects-the-total-price`

1. Article title and lead section.
2. Long-form article body with nested headings, paragraphs, and lists.
3. Inline links to related service content.
4. Shared footer.

The inspected article includes claims and advice that must not be copied, summarized, or adapted. Reading-time display and related-post interaction were not confirmed.

### Clinic — `/our-clinic`

1. Location/clinic directory with repeated location cards.
2. Each location card presents a location name, short descriptive block, email, and phone.
3. Shared footer.

The route shows multiple locations. A map, hours, and gallery were not reliably confirmed. MediYatra must not imply it operates clinics; use verified coordination-office details only.

### Contact Us — `/contact-us`

1. Breadcrumb and contact-page banner.
2. Contact-channel cards.
3. Enquiry form with name, phone, address, center selection, and message fields.
4. Location/service-area content, supporting images, and FAQ teaser.
5. Shared footer.

At 1440px the earlier review measured a form around 592px wide, two columns, 16px gaps, and controls around 45px tall with 14px corners. At 375px the fields remained in two columns and the message field spanned both columns; no horizontal overflow was observed. A delayed appointment overlay affected the page during the check.

### Careers — `/career`

1. Repeated job-opening blocks.
2. Each opening shows role, location, and work type.
3. Expanded content contains responsibility and qualification lists.
4. An application action is associated with each opening; its full submission flow was not verified.
5. Shared footer.

Openings and requirements must never be invented for MediYatra.

### Request a Call — `/reqcall`

1. Breadcrumb and short page title/introduction.
2. A callback request form is the expected page focus.
3. Shared footer.

The route response exposed only the title-level content during inspection, so form fields and submission behavior remain unverified.

### Booking — `/booking`

1. Breadcrumb and booking title/introduction.
2. Appointment-request form is the expected page focus.
3. Shared footer.

The route response exposed only the title-level content; actual booking steps and confirmation states were not verifiable. Do not imply an appointment is confirmed until the existing MediYatra flow says so.

### FAQs — `/faqs`

1. FAQ content organized as question-and-answer entries.
2. Shared footer.

The route response returned answer text but did not expose a reliable rendered interaction state. Accordion behavior and keyboard handling were not confirmed. MediYatra FAQs must come from its own approved content and must not give clinical advice.

### Terms — `/terms`

1. Text-first legal page with numbered sections and nested paragraphs/lists.
2. Shared footer.

The reference legal copy is not suitable for reuse. MediYatra legal copy requires its own authorized review.

### Privacy — `/privacy`

1. Expected to be a text-first policy page.
2. The inspected response appeared to return terms-like content rather than a distinct privacy document.

Treat the reference route as unreliable for privacy-page structure beyond a basic long-form legal layout. MediYatra's privacy page requires its own reviewed copy.

### Sitemap — `/sitemap-page`

1. A link-oriented page and footer-style grouping of site destinations.
2. Shared footer content includes several navigation/location/service/help groups and a newsletter form.

Generate MediYatra sitemap links from actual route configuration; do not carry over reference URLs or labels.

## Shared footer and floating actions

- Footer begins with brand/tagline/contact and social-link content, followed by several link columns. The observed categories cover general links, locations, service areas, company, service pages, and help/legal destinations.
- A newsletter email field and subscribe action appear above the copyright row.
- Footer groups are link-dense and are visually separated into columns on desktop; they collapse into a narrower stacked layout on mobile. Exact breakpoints and mobile accordion behavior were not confirmed.
- Floating call and WhatsApp actions appear near the lower-right edge. A delayed appointment-request dialog is also present in the reference session.
- MediYatra should use only its configured contacts and confirmed social URLs. Hide empty groups and retain its own service routes.

## Responsive and interaction notes

- Previously inspected widths: 1440px, 967px, and 375px. Desktop header links collapse to a hamburger on mobile. Team and Contact content stack vertically at narrow widths.
- Desktop section content generally uses centered wide containers, generous vertical spacing, and alternating image/text blocks. Card and profile grids become narrower or stacked on mobile.
- Carousel/profile areas expose controls and profile actions. Testimonial content is grouped as slides/cards. Exact autoplay, pause, transition duration, hover states, and keyboard focus order were not consistently measurable.
- A dedicated DevTools animation-panel audit was not available. Do not claim exact motion timings or implement inferred reference behavior as measured fact.
- Dynamic content, failed analytics requests, and the appointment overlay affected the inspected pages. Browser observations describe only the states available during this review.

## MediYatra adaptation constraints

- The reference supplies structure only. Keep MediYatra's existing routes, approved palette, fonts, logo, translation behavior, and repository-approved images.
- Preserve the existing homepage content, layout, and animation. This research phase makes no implementation changes.
- Keep shared header/footer links centrally configured and derive service links from real MediYatra pages.
- No fabricated doctors, hospitals, affiliations, testimonials, stats, credentials, opening hours, or service availability.
- Keep the required clinical-responsibility statement: “Treatment decisions are made by your doctor and hospital.”
