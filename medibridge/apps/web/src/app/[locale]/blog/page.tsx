import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { StaticPage } from "@/components/shared/static-page";
import { fetchCatalogList } from "@/lib/catalog";

const starterGuides = [
  { slug: "questions-for-a-provider", title: "Questions to ask when comparing providers", excerpt: "A general checklist for credentials, scope, written estimates, and follow-up." },
  { slug: "organizing-medical-records", title: "Organizing records for a consultation", excerpt: "Ways to prepare relevant reports and keep copies available to your care team." },
  { slug: "planning-follow-up-care", title: "Planning follow-up care before travel", excerpt: "Topics to discuss with your treating clinician before making travel plans." },
];

export default async function BlogPage({ params, searchParams }: { params: { locale: string }; searchParams: { q?: string } }) {
  const result = await fetchCatalogList<{ slug: string; title: string; excerpt: string; publishedAt: string | null }>("blog", searchParams.q ?? "");
  const articles = result?.data.length ? result.data : starterGuides;
  return (
    <StaticPage eyebrow="Patient guides" title="Information for informed questions" description="General planning content only. Medical information should be discussed with a qualified clinician who knows your case.">
      <form className="catalog-search" action={`/${params.locale}/blog`} method="get">
        <label className="field"><span>Search articles</span><input name="q" defaultValue={searchParams.q ?? ""} /></label>
        <button className="button button-primary" type="submit">Search</button>
      </form>
      <div className="grid grid-3">
        {articles.map((article) => (
          <article className="card" key={article.slug}>
            <BookOpenText size={22} color="var(--teal)" aria-hidden="true" />
            <h2 style={{ marginTop: "0.8rem" }}>{article.title}</h2>
            <p className="muted">{article.excerpt}</p>
            <Link className="text-link" href={`/${params.locale}/blog/${article.slug}`}>Read guide</Link>
          </article>
        ))}
      </div>
      <p className="disclaimer" style={{ marginTop: "2rem" }}>These guides are informational and do not offer diagnosis, treatment recommendations, or guarantees.</p>
    </StaticPage>
  );
}
