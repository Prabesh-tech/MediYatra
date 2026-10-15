# Vatsalya reference notes

Visual inspection of `https://vatsalya.com.np/` on 4 October 2026. These notes record layout and motion patterns only. Do not reuse Vatsalya copy, names, photos, logos, credentials, statistics, or color branding.

## Doctor and team carousel

- A centered, uppercase section label with thin horizontal rules introduces the doctor section, followed by a clear centered heading.
- One featured profile is shown at a time. The large portrait sits in a softly colored rounded panel on the left; the doctor's name, role, short biography, and actions are aligned on the right.
- The actions are grouped near the biography: `Consult Now`, `Call Back Request`, and a quieter `View Detail` link.
- A strip of portrait thumbnails spans the width beneath the feature, with previous/next arrows and small pagination dots centered below it.
- Profiles change automatically; the observed carousel had a compact, smooth transition. Thumbnail selection and arrow/dot navigation provide direct controls.
- Adapt this structure with MediYatra navy/teal/sky gradients and its verified clinician data. Never use the reference photos or claims.

## Service cards and process steps

- The services area uses a centered section heading and a spacious, four-part composition around a central photograph. Each service area has a simple line illustration/icon, short heading, clipped description, and `Learn more` link. The card surfaces are large asymmetric pale-pink rounded shapes rather than conventional bordered rectangles.
- “How we work” uses a centered heading and a vertical timeline. Numbered steps alternate sides: one side pairs concise text with the other side's illustration/photo. A thin center line connects the steps; step markers sit alongside the copy.
- These sections are visually light, with plenty of white space and restrained decorative line art rather than dense borders.

## Other homepage sections

- **Stats:** a horizontal row of three prominent numeric callouts directly below the hero, with smaller labels. Their count-up treatment is brief; no values should be carried over.
- **Testimonials:** a wide, soft pink gradient band containing horizontally arranged white cards. Cards use a photo at the top, a large quote mark, a short excerpt, a read-more affordance, and the author's label; dots and arrows sit under the rail.
- **FAQ:** a two-column layout with a large rounded maternity image on one side and stacked question/answer rows on the other. A narrow colored vertical rule emphasizes each row; open answers remain readable in the flow.
- **Blog cards:** image-led horizontal cards with a small date, bold truncated title, short excerpt, and a small directional link icon.
- **Footer:** a pale pink full-width surface. A compact “important links” band comes first, then columns for brand/contact, company, services, help, and newsletter, with a fine divider and small copyright line at the bottom.

## Visual and motion language

- The reference uses Manrope, medium-to-bold headings, small uppercase section labels, and a light, generous sans-serif hierarchy. MediYatra keeps its approved Poppins font.
- The reference palette is blush/pink with coral and plum accents. For MediYatra, preserve the layout rhythm while mapping emphasis to the approved navy, teal, sky, light-blue, and light-teal tokens.
- Sections have generous vertical spacing; cards and image panels are softly rounded (roughly 16–24px, with occasional larger organic shapes). Shadows are subtle and layered rather than dark. Buttons are pill-like, with a filled primary action and quiet outlined/inline secondary actions.
- The visible motion language is restrained: gentle fade/slide and stagger on section/card entrances, a smooth doctor-profile swap, and short hover emphasis. A precise easing curve and durations are not exposed by visual inspection; for MediYatra, keep motion in the requested 0.4–0.8s range with ease-out and honor reduced-motion preferences.
- Soft gradients and sparse line-art flourishes support, but do not compete with, the content. Contact shortcuts remain fixed and easy to reach.

## Implementation boundary

Rebuild only reusable visual patterns in MediYatra's own components. Use existing MediYatra image assets or approved supplied images, existing profile fields, and established routes. Do not hotlink or copy any reference-site assets or content.
