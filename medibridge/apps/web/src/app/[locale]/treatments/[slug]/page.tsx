import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaticPage } from "@/components/shared/static-page";
import { treatmentAreas } from "@/lib/site-content";
import { fetchCatalogItem } from "@/lib/catalog";

type Treatment = {
  slug: string;
  name: string;
  summary: string;
  overview: string;
  priceMinUsd?: number | null;
  priceMaxUsd?: number | null;
  hospitals?: { hospital: { slug: string; name: string } }[];
  doctors?: { doctor: { slug: string; name: string } }[];
  faqs?: { id: string; question: string; answer: string }[];
};

export default async function TreatmentDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const result = await fetchCatalogItem<Treatment>(`treatments/${encodeURIComponent(params.slug)}`);
  const fallback = treatmentAreas.find((item) => item.slug === params.slug);
  if (!result && !fallback) notFound();
  const title = result?.name ?? fallback!.title;
  const description = result?.summary ?? fallback!.summary;

  return (
    <StaticPage eyebrow="Care information" title={title} description={description}>
      <div className="detail-layout">
        <div className="prose">
          <h2>What to discuss with a clinician</h2>
          <p>{result?.overview ?? "A clinician familiar with your case can explain whether this area of care is relevant, what assessments may be needed, and which alternatives should be considered."}</p>
          <h2>Before comparing options</h2>
          <ul>
            <li>Ask who will assess your case and provide treatment.</li>
            <li>Request the proposed plan, risks, expected recovery needs, and follow-up in writing.</li>
            <li>Confirm what is included in any estimate and which costs may be additional.</li>
          </ul>
          {result?.priceMinUsd != null && result.priceMaxUsd != null ? (
            <p className="notice">Published estimate range: ${result.priceMinUsd.toLocaleString()}–${result.priceMaxUsd.toLocaleString()} USD. Confirm current inclusions directly with the provider.</p>
          ) : (
            <p className="notice">No verified price range is published. Estimates depend on the clinical plan and provider.</p>
          )}
          {result?.hospitals?.length ? <section><h2>Verified hospitals</h2><ul>{result.hospitals.map(({ hospital }) => <li key={hospital.slug}><Link className="text-link" href={`/${params.locale}/hospitals/${hospital.slug}`}>{hospital.name}</Link></li>)}</ul></section> : null}
          {result?.doctors?.length ? <section><h2>Published clinicians</h2><ul>{result.doctors.map(({ doctor }) => <li key={doctor.slug}><Link className="text-link" href={`/${params.locale}/doctors/${doctor.slug}`}>{doctor.name}</Link></li>)}</ul></section> : null}
          {result?.faqs?.length ? <section className="faq-list"><h2>Questions</h2>{result.faqs.map((faq) => <details key={faq.id}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section> : null}
          <p><Link className="text-link" href={`/${params.locale}/treatments`}><ArrowLeft size={15} aria-hidden="true" /> All care areas</Link></p>
        </div>
        <aside className="card quote-card">
          <ClipboardList size={24} color="var(--teal)" aria-hidden="true" />
          <h2>Discuss your options</h2>
          <p className="muted">Share your request for a coordinator to help organize next steps.</p>
          <Button variant="accent" href={`/${params.locale}/quote`}>Request a quote</Button>
        </aside>
      </div>
    </StaticPage>
  );
}
