import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, ClipboardCheck, HeartPulse, Home, Plane, ShieldCheck } from "lucide-react";
import { EmptyDirectory } from "@/components/shared/empty-directory";
import { StaticPage } from "@/components/shared/static-page";
import { Reveal, StaggerGrid } from "@/components/motion";
import { localizedHref } from "@/config/site";
import messages from "@/i18n/messages/en.json";
import { treatmentAreas } from "@/lib/site-content";
import { fetchCatalogList } from "@/lib/catalog";

type Treatment = { slug: string; name: string; summary: string; specialty?: { name: string } };
type TreatmentCard = { slug: string; title: string; summary: string; specialty?: { name: string } };

const coordinationIcons = [ClipboardCheck, CalendarCheck, Plane] as const;
const serviceDetailIcons = [ClipboardCheck, Home, Plane] as const;
const assuranceIcons = [HeartPulse, ShieldCheck, CalendarCheck] as const;

export default async function TreatmentsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string };
}) {
  const locale = params.locale;
  const copy = messages.treatmentsPage;
  const query = searchParams.q?.trim() ?? "";
  const result = await fetchCatalogList<Treatment>("treatments", query);
  const cards: TreatmentCard[] = result?.data.length
    ? result.data.map((item) => ({ slug: item.slug, title: item.name, summary: item.summary, specialty: item.specialty }))
    : treatmentAreas
      .filter((item) => !query || `${item.title} ${item.summary}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
      .map((item) => ({ slug: item.slug, title: item.title, summary: item.summary }));

  return (
    <StaticPage eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
      <div className="treatments-page">
        <section className="treatments-page-section" aria-labelledby="treatments-services-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.services.eyebrow}</p>
            <h2 id="treatments-services-title">{copy.services.heading}</h2>
          </div>
          <StaggerGrid className="grid grid-3 treatments-feature-grid">
            {copy.services.items.map((service) => (
              <Link
                className="card treatments-feature-card"
                href={localizedHref(locale, service.href)}
                key={service.href}
              >
                <span className="treatments-feature-image">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 760px) 90vw, (max-width: 1050px) 45vw, 30vw"
                  />
                </span>
                <span className="treatments-feature-copy">
                  <h3>{service.title}</h3>
                  <span className="muted">{service.description}</span>
                  <span className="text-link">{copy.services.action}<ArrowRight size={15} aria-hidden="true" /></span>
                </span>
              </Link>
            ))}
          </StaggerGrid>
        </section>

        <section className="treatments-detail-section" aria-labelledby="treatments-details-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.details.eyebrow}</p>
            <h2 id="treatments-details-title">{copy.details.heading}</h2>
            <p>{copy.details.description}</p>
          </div>
          <div className="treatments-detail-list">
            {copy.details.items.map((detail, index) => {
              const Icon = serviceDetailIcons[index];
              return (
                <Reveal key={detail.href}>
                  <article className="treatments-detail-panel">
                    <div className="treatments-detail-media">
                      <Image
                        src={detail.image}
                        alt={detail.imageAlt}
                        fill
                        sizes="(max-width: 760px) 90vw, 45vw"
                      />
                    </div>
                    <div className="treatments-detail-copy">
                      <span className="treatment-icon"><Icon size={21} aria-hidden="true" /></span>
                      <p className="eyebrow">{detail.eyebrow}</p>
                      <h3>{detail.title}</h3>
                      <p>{detail.description}</p>
                      <ul>
                        {detail.points.map((point) => <li key={point}>{point}</li>)}
                      </ul>
                      <Link className="text-link" href={localizedHref(locale, detail.href)}>
                        {copy.details.action}<ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal className="treatments-coordination">
          <div className="section-heading">
            <p className="eyebrow">{copy.coordination.eyebrow}</p>
            <h2>{copy.coordination.heading}</h2>
          </div>
          <div className="grid grid-3 treatments-coordination-grid">
            {copy.coordination.steps.map((step, index) => {
              const Icon = coordinationIcons[index];
              return (
                <article className="treatments-coordination-step" key={step.title}>
                  <span className="treatment-icon"><Icon size={21} aria-hidden="true" /></span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>
        </Reveal>

        <section className="treatments-assurance" aria-labelledby="treatments-assurance-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.assurance.eyebrow}</p>
            <h2 id="treatments-assurance-title">{copy.assurance.heading}</h2>
          </div>
          <StaggerGrid className="grid grid-3 treatments-assurance-grid">
            {copy.assurance.items.map((item, index) => {
              const Icon = assuranceIcons[index];
              return (
                <article className="treatments-assurance-card" key={item.title}>
                  <span className="treatment-icon"><Icon size={20} aria-hidden="true" /></span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </StaggerGrid>
        </section>

        <section className="treatments-page-section treatments-specialties" aria-labelledby="treatments-specialties-title">
          <div className="section-heading">
            <p className="eyebrow">{copy.specialties.eyebrow}</p>
            <h2 id="treatments-specialties-title">{copy.specialties.heading}</h2>
            <p>{copy.specialties.description}</p>
          </div>
          <form className="catalog-search" action={`/${locale}/treatments`} method="get" role="search">
            <label className="field">
              <span>{copy.specialties.searchLabel}</span>
              <input name="q" defaultValue={query} placeholder={copy.specialties.searchPlaceholder} />
            </label>
            <button className="button button-primary" type="submit">{copy.specialties.searchAction}</button>
          </form>
          {cards.length ? (
            <StaggerGrid className="grid grid-3 treatments-specialty-grid">
              {cards.map((item) => (
                <Link
                  className="card treatments-specialty-card"
                  href={`/${locale}/treatments/${item.slug}`}
                  key={item.slug}
                >
                  <span className="treatment-icon"><HeartPulse size={20} aria-hidden="true" /></span>
                  <span className="eyebrow">{item.specialty?.name ?? "Care information"}</span>
                  <h3>{item.title}</h3>
                  <span className="muted">{item.summary}</span>
                  <span className="text-link">{copy.specialties.action}<ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              ))}
            </StaggerGrid>
          ) : <EmptyDirectory title={copy.emptyTitle} locale={locale} />}
          <p className="disclaimer treatments-disclaimer">{copy.specialties.notice}</p>
        </section>

        <section className="treatments-page-cta" aria-labelledby="treatments-cta-title">
          <div>
            <p className="eyebrow">MediYatra coordination</p>
            <h2 id="treatments-cta-title">{copy.cta.heading}</h2>
            <p>{copy.cta.description}</p>
          </div>
          <Link className="button button-accent" href={localizedHref(locale, "quote")}>
            {copy.cta.action}<ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </StaticPage>
  );
}
