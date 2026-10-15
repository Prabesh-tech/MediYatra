import { notFound } from "next/navigation";
import { StaticPage } from "@/components/shared/static-page";

const policies: Record<string, { title: string; paragraphs: string[] }> = {
  privacy: {
    title: "Privacy notice",
    paragraphs: [
      "Draft for review by qualified privacy counsel before launch. Mediyatra should collect only information needed to respond to a request and coordinate a patient-authorized review.",
      "Inquiry narratives, patient phone details, and contact messages are designed for field-level encryption. Medical documents use private object storage and short-lived signed links.",
      "Before production, publish controller identity, lawful bases, processors, retention periods, international-transfer safeguards, rights-request contacts, and breach procedures.",
    ],
  },
  terms: {
    title: "Terms of use",
    paragraphs: [
      "Draft for review by qualified counsel. Website information is general and does not create a clinician-patient relationship or guarantee availability, outcomes, or provider credentials.",
      "Before launch, add verified company details, applicable law, service scope, provider responsibilities, payment terms, cancellation rules, and dispute procedures.",
    ],
  },
  cookies: {
    title: "Cookie policy",
    paragraphs: [
      "The current build uses essential browser storage for theme and cookie preferences. Optional analytics are not enabled.",
      "Before adding analytics, obtain and record appropriate consent, document vendor settings, and provide a withdrawal path.",
    ],
  },
  "medical-disclaimer": {
    title: "Medical disclaimer",
    paragraphs: [
      "Mediyatra provides care coordination and general information, not diagnosis, treatment, or emergency services.",
      "Only a qualified clinician who has assessed you can advise whether a treatment is suitable. Confirm risks, alternatives, expected outcomes, recovery, and follow-up with the treating team.",
      "If you may be experiencing a medical emergency, contact local emergency services immediately.",
    ],
  },
  refunds: {
    title: "Refund policy",
    paragraphs: [
      "Draft for review. No deposits or bundled packages are currently sold through this launch build.",
      "Before taking payment, publish the responsible seller, provider cancellation rules, refund timelines, payment-provider fees, and how disputes are handled.",
    ],
  },
};

export default function LegalPage({ params }: { params: { slug: string } }) {
  const policy = policies[params.slug];
  if (!policy) notFound();
  return (
    <StaticPage eyebrow="Policy" title={policy.title} description="This policy content is a launch draft and must be reviewed and completed before production use.">
      <article className="prose">
        {policy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
    </StaticPage>
  );
}
