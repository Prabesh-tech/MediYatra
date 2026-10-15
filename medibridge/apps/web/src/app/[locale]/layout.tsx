import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { supportedLocaleSchema } from "@medibridge/shared";
import { SiteShell } from "@/components/layout/site-shell";
import { siteConfig } from "@/config/site";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.brand.name,
  alternateName: siteConfig.brand.displayName,
  url: siteConfig.brand.siteUrl,
  logo: new URL(siteConfig.brand.logoPath, siteConfig.brand.siteUrl).toString(),
  description: siteConfig.brand.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.address.streetAddress,
    addressLocality: siteConfig.contact.address.city,
    addressRegion: siteConfig.contact.address.region,
    ...(siteConfig.contact.address.postalCode ? { postalCode: siteConfig.contact.address.postalCode } : {}),
    addressCountry: siteConfig.contact.address.country,
  },
  contactPoint: [{
    "@type": "ContactPoint",
    contactType: "customer support",
    telephone: siteConfig.contact.phones[0].display,
    email: siteConfig.contact.email,
  }],
  ...(siteConfig.socialLinks.length > 0 ? { sameAs: siteConfig.socialLinks.map(({ href }) => href) } : {}),
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  const { locale } = params;
  const parsedLocale = supportedLocaleSchema.safeParse(locale);
  if (!parsedLocale.success) notFound();

  return (
    <NextIntlClientProvider locale={parsedLocale.data} messages={await getMessages()}>
      <SiteShell locale={parsedLocale.data}>
        <div id="main-content">{children}</div>
      </SiteShell>
      <script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }}
      />
    </NextIntlClientProvider>
  );
}
