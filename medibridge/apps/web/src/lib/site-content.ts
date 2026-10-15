export const treatmentAreas = [
  { slug: "cardiac-care", title: "Cardiac care", summary: "Information and coordination for people exploring heart-care options." },
  { slug: "orthopedics", title: "Orthopedics", summary: "Explore questions to discuss about bone, joint, and mobility care." },
  { slug: "cancer-care", title: "Cancer care", summary: "Organize records and questions for a qualified oncology review." },
  { slug: "fertility-ivf", title: "Fertility and IVF", summary: "Learn what to ask when comparing fertility-care options." },
  { slug: "dental-care", title: "Dental care", summary: "Prepare questions about dental treatment, timing, and aftercare." },
  { slug: "cosmetic-care", title: "Cosmetic care", summary: "Review credentials, risks, recovery needs, and written treatment plans." },
  { slug: "eye-care", title: "Eye care", summary: "Coordinate a specialist review and understand what information may be needed." },
  { slug: "transplant-consultation", title: "Transplant consultation", summary: "Discuss eligibility and clinical requirements directly with a licensed transplant team." },
  { slug: "bariatric-care", title: "Bariatric care", summary: "Explore assessment, follow-up, and long-term support questions." },
  { slug: "wellness-ayurveda", title: "Wellness and Ayurveda", summary: "Ask about practitioner qualifications, treatment scope, and safety considerations." },
] as const;

export const faqItems = [
  { question: "Does Mediyatra provide medical advice?", answer: "No. Mediyatra helps organize information and care coordination. Diagnosis and treatment decisions belong to qualified clinicians who know your case." },
  { question: "Are providers already verified?", answer: "The directory is being prepared. Profiles will be published only after credentials, permissions, and listing details are reviewed." },
  { question: "Are treatment prices available?", answer: "No unverified prices are published. Request a case-specific written estimate after a provider has reviewed the relevant clinical information." },
  { question: "How should I share medical reports?", answer: "Use the private, short-lived upload links provided through an inquiry. Do not send medical reports over ordinary email or social messaging." },
  { question: "Can I make travel arrangements before a care plan is confirmed?", answer: "It is safer to wait for a written plan and confirm dates, provider availability, and current travel requirements before making non-refundable bookings." },
] as const;

export const travelChecklist = [
  "Ask for the treating clinician and facility details in writing.",
  "Confirm which services and follow-up visits are included.",
  "Check current entry requirements through official government sources.",
  "Discuss accessibility, language support, and recovery needs before booking.",
  "Keep copies of records and a plan for care after returning home.",
] as const;
