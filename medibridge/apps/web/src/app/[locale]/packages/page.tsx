import { fetchCatalogList } from "@/lib/catalog";
import { EmptyDirectory } from "@/components/shared/empty-directory";
import { StaticPage } from "@/components/shared/static-page";

export default async function PackagesPage({ params }: { params: { locale: string } }) {
  const result = await fetchCatalogList<{ slug: string; name: string; days: number | null; priceUsd: number | null; inclusions: string[]; exclusions: string[] }>("packages");
  return (
    <StaticPage eyebrow="Travel and care planning" title="Packages" description="We publish travel and care plans only after providers, costs, and inclusions are verified.">
      {result?.data.length ? (
        <div className="grid grid-3">
          {result.data.map((item) => (
            <article className="card" key={item.slug}>
              <h2>{item.name}</h2>
              <p className="muted">{item.days ? `${item.days} days` : "Duration confirmed after planning"}</p>
              <h3>Inclusions</h3><ul>{item.inclusions.map((value) => <li key={value}>{value}</li>)}</ul>
              <h3>Exclusions</h3><ul>{item.exclusions.map((value) => <li key={value}>{value}</li>)}</ul>
              <p>{item.priceUsd ? `$${item.priceUsd.toLocaleString()} USD` : "Price on request"}</p>
            </article>
          ))}
        </div>
      ) : <EmptyDirectory title="No verified packages are available yet" locale={params.locale} />}
      <p className="disclaimer packages-disclaimer">Before payment, confirm all provider charges and terms in writing.</p>
    </StaticPage>
  );
}
