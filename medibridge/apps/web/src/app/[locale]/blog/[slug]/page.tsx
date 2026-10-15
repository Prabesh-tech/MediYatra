import { notFound } from "next/navigation";
import { StaticPage } from "@/components/shared/static-page";
import { fetchCatalogItem } from "@/lib/catalog";

const guides: Record<string, { title: string; paragraphs: string[] }> = {
  "questions-for-a-provider": {
    title: "Questions to ask when comparing providers",
    paragraphs: [
      "Ask who will assess your case, who will provide care, and which facility is responsible for each part of the plan.",
      "Request written information about the proposed plan, alternatives, risks, follow-up, total charges, and cancellation terms.",
      "Confirm credentials with the relevant professional body and ask how your records will be protected and shared.",
    ],
  },
  "organizing-medical-records": {
    title: "Organizing records for a consultation",
    paragraphs: [
      "Ask the clinician which records are relevant before sharing documents. Keep a secure copy of anything you provide.",
      "Use a private upload link when available. Avoid sending reports through ordinary email or social messaging.",
      "If a report is unclear or incomplete, ask your treating clinician whether an updated copy or explanation is needed.",
    ],
  },
  "planning-follow-up-care": {
    title: "Planning follow-up care before travel",
    paragraphs: [
      "Before travelling, ask who will provide follow-up, how urgent concerns will be handled, and what information your local clinician will receive.",
      "Discuss recovery needs, medication continuity, travel fitness, and possible changes to your return plans with your treating team.",
      "Confirm a written contact path and keep copies of your care plan and discharge information.",
    ],
  },
};

export default async function GuidePage({ params }: { params: { locale: string; slug: string } }) {
  const post = await fetchCatalogItem<{ title: string; content: string; excerpt: string }>(`blog/${encodeURIComponent(params.slug)}`);
  const guide = guides[params.slug];
  if (!post && !guide) notFound();
  return (
    <StaticPage eyebrow="Patient guide" title={post?.title ?? guide!.title} description={post?.excerpt ?? "General planning information; not medical advice."}>
      <article className="prose guide-copy">
        {post ? <div>{post.content.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : guide!.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className="disclaimer">This information is general and cannot replace advice from your clinician or official sources.</p>
      </article>
    </StaticPage>
  );
}
