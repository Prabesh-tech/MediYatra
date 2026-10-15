# Medibridge

Medibridge is a pnpm + Turborepo monorepo containing a Next.js web app, a NestJS API, and shared TypeScript/Zod contracts.

Reference websites:
- https://vatsalya.com.np
- https://uiverse.io

## Persistent AI Working Instructions

Treat this section and the approved MediYatra wording rules below as project constraints for every AI-assisted change. Read the root `README.md` before making website changes; specifically follow design direction section 17 and wording rules section 19.

- The additional non-negotiable visual, content, and launch requirements in section 20 must be followed for every change. Do not remove, weaken, or override them unless the user explicitly approves that change.
- The website upgrade is phased and approval-gated: (1) central site configuration and generated navigation/SEO, (2) first-impression hero, (3) shared motion system, (4) visual and responsive polish, (5) performance, SEO, and accessibility. Work in order and do not start a later phase until the user approves the previous phase.
- Work in `apps/web` unless the request explicitly requires another package. Do not modify `apps/api` for website work.
- Preserve existing routes, public component props, localization behavior, and the existing stack. Ask before adding dependencies.
- Never invent facts to fill gaps: do not fabricate doctor or hospital identities, qualifications, affiliations, certifications, service availability, opening hours, prices, patient outcomes, or statistics. Use verified repository data, mark temporary content as a placeholder, or omit it.
- Follow the MediYatra clinical-responsibility rules in section 19. MediYatra coordinates and supports; qualified doctors and hospitals make diagnosis, treatment, and clinical decisions.
- Keep the approved navy/teal/sky/light-blue palette and Poppins typography. Reference sites are for design direction only.
- Use only assets already in `apps/web/public/images` or assets supplied by the user. Never hotlink or copy reference-site imagery. Clearly mark any new placeholder assets for later replacement with licensed photos.
- Respect reduced-motion preferences, accessible contrast, semantic markup, keyboard use, responsive layouts, and the existing route structure.
- For multi-phase requests, implement only the phase explicitly requested, run the requested typecheck and build, report what changed and what was verified, then stop for approval before beginning the next phase.
- Prefer simple, targeted changes and existing patterns. Do not claim tests, browser checks, data verification, or performance results unless they were actually run.
- Before launch or publication, verify contact details, legal copy, service availability, and other operational claims with an authorized source.

The Phase 1 configuration source and editing guide are `apps/web/src/config/site.ts` and [`docs/site-config.md`](./docs/site-config.md).


## Requirements

- Node.js 20 or newer
- pnpm 9
- Docker Compose (for local PostgreSQL and Redis)

## Getting started

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env`, set unique JWT secrets (32+ characters), and generate a local PII key with `openssl rand -hex 32`.
3. Start local services with `docker compose up -d postgres redis`.
4. Generate the Prisma client with `pnpm db:generate`.
5. Create/apply the database migration with `pnpm db:migrate`.
6. Add generic treatment categories with `pnpm db:seed`.
7. Start the apps with `pnpm dev`.

The web app runs on `http://localhost:3000`; the API listens on port `4000`. The API health check is `/api/v1/health`, and development Swagger docs are at `/docs`. Web-side API calls can use the same-origin `/api/*` BFF routes, which forward to `API_INTERNAL_URL` and preserve session cookies.

### Supabase PostgreSQL

The API can use a Supabase-hosted PostgreSQL database through Prisma. Set `DATABASE_URL` to the Supabase connection-pooler URL for API runtime traffic and `DIRECT_URL` to the Supabase direct database URL for Prisma migrations. Keep both values private. For local development, both can point to the local PostgreSQL URL in `.env.example`. Apply checked-in migrations to a hosted database with `pnpm db:deploy`; use `pnpm db:migrate` only for local schema development.

## Architecture

- `apps/web`: Next.js 14, React Server Components, Tailwind CSS, shadcn/ui configuration, English-first next-intl, theme support, a PWA manifest, and same-origin BFF routes.
- `apps/api`: NestJS with Argon2id account flows, access/refresh JWTs, role/CSRF/throttling guards, encrypted inquiry/contact/review text, Prisma, BullMQ, appointment requests, S3-compatible signed document URLs, and Resend/Twilio adapters.
- `packages/shared`: shared TypeScript types and Zod schemas.
- PostgreSQL and Redis are provided by `docker-compose.yml`. S3/R2 and messaging credentials are optional until those integrations are configured.

Public catalog reads, inquiry intake and private report uploads, patient profile/dashboard requests, appointment requests, moderated reviews, contact-message handling, and the admin inquiry pipeline are wired. Appointment requests remain pending until confirmed. Remaining domain CRUD/CMS, payment webhooks, automated data-request fulfillment, provider-owned admin access, and two-factor authentication need product-specific implementation. Email delivery requires Resend credentials; SMS requires Twilio credentials. Provider listings, prices, legal text, and contact channels remain unpublished placeholders until verified. Legal pages are drafts and require qualified review before launch. Do not use demo keys in production; protect and back up the PII encryption key separately from the database.

## MediYatra Website Content Brief

This section is the approved product and content direction for the MediYatra website.

### 1. Hero Section

**Main heading:** Your Healthcare Journey, Coordinated with Care.

**Subheading:** From Nepal to India and back home, MediYatra helps patients navigate medical travel, hospital coordination, accommodation, documentation, and personalized support - all through one dedicated team.

**Primary buttons:**

- Plan Your Medical Journey
- Book Nursing Care

**Service line:** Medical Tourism | Patient Coordination | Nursing Care at Home

### 2. About MediYatra

MediYatra is a healthcare coordination and medical travel support company based in Nepal, helping patients and families navigate their healthcare journey in India with greater clarity and convenience.

When patients are referred to India for specialized treatment, the process can feel complicated: choosing a hospital, coordinating appointments, arranging travel and accommodation, preparing documentation, and finding local support.

MediYatra brings these essential services together under one coordinated journey. From the first enquiry through hospital coordination, travel and accommodation, treatment-related assistance, and follow-up support, the team stays connected with the patient and family throughout the journey.

**Key positioning:** The patient chooses the hospital and healthcare provider. MediYatra coordinates the practical journey around the treatment.

### 3. Our Two Main Services

#### 01 - Medical Tourism and Patient Coordination

Supporting the healthcare journey from Nepal to India.

#### 02 - Nursing Care at Home

Professional nursing support delivered at the patient's doorstep.

### 4. Medical Tourism and Patient Coordination

When specialized treatment requires travel to India, MediYatra helps coordinate the journey from Nepal to the patient's chosen hospital.

- **Medical case and report coordination:** Assistance with organizing medical reports and sharing relevant information with the selected hospital or specialist.
- **Hospital and doctor appointment coordination:** Coordination of appointments with the patient's preferred hospital and specialist.
- **Medical visa and documentation support:** Guidance and assistance with required medical travel documentation.
- **Travel coordination:** Support with travel planning according to the patient's hospital schedule.
- **Airport pickup and local transportation:** Coordination of transportation between the airport, accommodation, and hospital where required.
- **Accommodation assistance:** Assistance in arranging suitable accommodation for patients and accompanying family members.
- **Hospital coordination:** Support with appointments, admission-related coordination, communication, and practical hospital processes.
- **Patient and family support:** A dedicated coordination point throughout the journey.
- **Post-treatment follow-up coordination:** Support with follow-up appointments, reports, communication, and return-home arrangements.

### 5. How It Works - Patient Journey

#### 01 - Share Your Requirement

Tell MediYatra about your healthcare needs and share relevant medical reports or referral information.

#### 02 - Coordinate the Case

The team organizes available information and communicates with the selected hospital or specialist as required.

#### 03 - Choose Your Hospital

The patient remains in control of healthcare decisions and chooses the preferred hospital and doctor.

#### 04 - Plan Your Journey

MediYatra coordinates appointments, documentation, travel, accommodation, and other practical requirements.

#### 05 - Travel to India

The team coordinates arrival, transportation, and hospital-related arrangements.

#### 06 - Hospital and Treatment Support

MediYatra remains available for practical coordination throughout the hospital journey.

#### 07 - Return and Follow-up

The team assists with follow-up coordination and practical arrangements for returning home.

### 6. Specialized Treatment Coordination

MediYatra helps coordinate medical travel for patients seeking specialized healthcare in India.

- Oncology and cancer care
- Cardiology and cardiac care
- Neurology and neurosurgery
- Orthopaedics and joint care
- Gastroenterology
- Nephrology and kidney care
- Urology
- Pulmonology
- Women's health
- Pediatric care
- General and multispecialty care

**Important:** Treatment options, diagnosis, and medical decisions are made by qualified doctors and hospitals. MediYatra's role is to coordinate the patient's healthcare journey and related support services.

**Presentation requirement:** Show these care areas as compact tags that wrap cleanly on smaller screens, followed by a clearly separated clinical-responsibility notice. Keep at least 1rem of vertical space between the tag group and notice. The notice must state that qualified doctors and hospitals make clinical decisions and that MediYatra coordinates related services; do not imply that MediYatra diagnoses or recommends treatment.

### 7. Nursing Care at Home

#### Professional Nursing Care, Right at Your Doorstep

MediYatra provides convenient nursing care at home through scheduled appointments, helping patients receive appropriate nursing support in the comfort of their own homes.

- **Home nursing visits:** Scheduled nursing support at the patient's home.
- **Post-hospital care:** Support for patients who require nursing assistance after discharge.
- **Elderly care support:** Assistance for elderly patients who require regular care and monitoring.
- **Wound and dressing care:** Nursing support for appropriate wound and dressing care as prescribed.
- **Medication support:** Assistance with medication routines according to the treating healthcare professional's instructions.
- **Basic patient monitoring:** Monitoring and recording relevant patient observations as appropriate.
- **Online nursing appointment:** Book a nursing visit according to the preferred date and requirement.

### 8. Book Nursing Care

**Section heading:** Need Nursing Care at Home?

**Supporting copy:** Tell us what kind of support you need, and our team will help arrange an appropriate nursing service.

**Suggested form fields:**

- Patient name
- Phone number
- Location
- Required date
- Preferred time
- Type of care required
- Additional message

**Button:** Book a Nursing Visit

### 9. Why MediYatra

- **One point of coordination:** One team to help coordinate the different parts of the healthcare journey.
- **Patient choice:** The patient chooses the preferred hospital and healthcare provider.
- **End-to-end support:** From initial coordination to travel, accommodation, hospital assistance, and follow-up.
- **Personalized assistance:** Support based on each patient's individual requirements.
- **Family support:** Help for families navigating the practical side of treatment away from home.
- **Support beyond borders:** Coordination between Nepal and India to make the journey more manageable.

### 10. Meet MediYatra

Behind MediYatra is a dedicated team focused on making healthcare journeys more organized, accessible, and patient-friendly.

The role of MediYatra is not to replace doctors or hospitals. The role is to connect the different parts of the journey and provide practical support to patients and their families.

### 11. Patient Journey Visual

Recommended journey graphic:

`Nepal -> Medical Referral / Requirement -> MediYatra Coordination -> Hospital and Doctor -> Travel and Accommodation -> Treatment Journey in India -> Follow-up and Return Home`

### 12. Main Call to Action

**Heading:** Planning Treatment in India?

**Copy:** You do not have to navigate the journey alone.

Share your requirement with MediYatra and let the team help coordinate the next steps.

**Buttons:**

- Start Your Medical Journey
- Talk to Our Team

### 13. Nursing CTA

**Heading:** Need Nursing Care at Home?

**Copy:** Professional nursing support, arranged around your needs.

**Button:** Book a Nursing Visit

### 14. Frequently Asked Questions

#### Is MediYatra a hospital?

No. MediYatra is a healthcare coordination and medical travel support company. Medical diagnosis, treatment, and clinical decisions are provided by qualified doctors and hospitals.

#### Can I choose my own hospital?

Yes. Patients can choose their preferred hospital and healthcare provider. MediYatra assists with coordination and practical arrangements around the journey.

#### Do you provide treatment in India?

Medical treatment is provided by the selected hospital and qualified healthcare professionals in India. MediYatra coordinates the patient's travel and support services.

#### What services do you arrange for medical travel?

Depending on the patient's requirements, MediYatra can assist with hospital and doctor coordination, documentation support, travel planning, accommodation, local transportation, hospital assistance, and follow-up coordination.

#### Can I book nursing care at home?

Yes. Nursing care can be requested through the appointment system. The team will discuss the requirement and arrange an appropriate nursing service where available.

#### Can my family member travel with me?

Yes. Accommodation and travel-related coordination can also be arranged for accompanying family members, depending on the patient's requirements.

### 15. Contact Section

**Heading:** Start Your Healthcare Journey

**Copy:** Have a question or need help planning your medical journey? Talk to the MediYatra team.

**Contact details:**

- Tripureshwor, Kathmandu, Nepal
- 9851423888 / 9801021362 / 9767992467
- info.mediyatra@gmail.com
- www.mediyatra.com

**Enquiry form fields:**

- Name
- Phone number
- Email
- Service required
- Message

**Service dropdown options:**

- Medical Tourism
- Hospital Coordination
- Doctor Appointment
- Visa and Documentation
- Travel and Accommodation
- Nursing Care at Home
- Other

**Button:** Send Enquiry

### 16. Footer

**Brand line:** MediYatra | Healthcare Coordination | Medical Tourism | Nursing Care

**Footer statement:** Your Healthcare Journey, Coordinated with Care.

**Quick links:** Home | About Us | Medical Tourism | Nursing Care | How It Works | Contact

**Social links:** Facebook | Instagram | TikTok, added only when official profile URLs are confirmed.

**Copyright:** (c) 2026 MediYatra. All Rights Reserved.

### 17. Design Direction

- Overall style: clean, modern, trustworthy healthcare and medical travel.
- Primary navy: `#0B4D9B`
- Primary teal: `#129AA3`
- Light teal: `#EAF7F7`
- Light blue: `#EAF3FF`
- Sky accent: `#A4E1F7`
- White: `#FFFFFF`
- Dark text: `#18324A`
- Typography: Poppins SemiBold/Bold for headings; Poppins Regular/Medium for body text.
- Use generous whitespace, rounded cards, simple line icons, and consistent alignment.
- Keep the website professional and reassuring rather than overly decorative.
- Use authentic, high-quality healthcare and travel imagery supplied by the user or already in the approved image library. Do not use AI-generated or AI-slop-looking photos.
- Make phone and WhatsApp contact easy to access on mobile.
- Keep primary calls to action visible throughout the patient journey.

### 18. Homepage Visual Implementation

- The homepage hero uses a 10-image medical slideshow, with images supplied for the site stored under `apps/web/public/images`.
- Images rotate automatically every two seconds, with slide controls that pause rotation while hovered or focused. The slideshow stays still when reduced motion is requested.
- A blue gradient overlay keeps the hero text readable while allowing the photos to remain visible.
- Pale blue section backgrounds and a deep-blue trust strip carry the blue visual theme through the homepage.
- Use licensed or user-provided images only; confirm permission before publishing third-party images.

### 19. Important Wording Rules

- Do not describe MediYatra as a hospital unless it is legally and clinically structured as one.
- Do not claim that MediYatra itself provides medical diagnosis or treatment.
- Use `coordinates`, `assists`, `supports`, `arranges`, and `facilitates` when describing MediYatra's role.
- Clearly state that diagnosis, treatment plans, and clinical decisions are made by qualified doctors and hospitals.
- Avoid guarantees such as `best hospital`, `guaranteed cure`, or `guaranteed results`.
- Confirm actual service availability, partner hospitals, documentation scope, and nursing scope before publishing.

This brief is a content and design target, not a substitute for legal, clinical, privacy, or operational review. Verify contact details, service availability, partner relationships, and published claims before launch.

### 20. Non-Negotiable Design, Content, and Launch Requirements

These requirements supplement and take precedence over conflicting visual suggestions elsewhere in this brief. Preserve existing code unless the user explicitly asks for a code change.

#### Visual and interaction requirements

- Do not make the site look like a generic, sterile, predominantly white product. Keep the approved MediYatra navy, teal, sky, and light-blue palette visually present.
- Do not introduce gradients, shifting or jumping buttons, cursor animations, emoji icons, or excessive scroll animations.
- Keep motion subtle, purposeful, and respectful of reduced-motion preferences. Do not animate controls in a way that makes them move away from a pointer or touch.
- Use the approved form and layout pattern. Do not invent or substitute a different pattern without user approval.

#### Content and trust requirements

- Use concise, clear, plain-language copy. Keep hero messaging specific and strong; do not use weak or generic hero text.
- Never fabricate or simulate reviews, ratings, metrics, customer accounts, or other evidence of real users or outcomes.
- Do not use AI-generated or AI-slop-looking photos. Use only user-supplied or approved repository imagery, or properly licensed authentic photos.
- Do not use emoji as icons. Use the existing icon system and follow the approved brand style.
- Do not use em dashes in website copy.

#### Launch gate

Do not launch or publish the website until all of the following are complete and verified:

- Connect and verify the custom domain.
- Add and verify the site favicon.
- Remove any “Made with AI” tag or label.
- Publish a privacy policy page.
- Publish a terms and conditions page.

Treat this list as a release blocker. Do not claim the site is ready to launch until every item has been verified.
