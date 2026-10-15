# Site configuration

Edit `apps/web/src/config/site.ts` to update shared public website details.

## What it controls

- Brand name, display name, tagline, description, logo, and canonical site URL.
- Office address, map links and coordinates, phone numbers, email, and WhatsApp number.
- Whether the contact details have been formally confirmed for the quote page.
- Main navigation, service navigation, footer link groups, public routes, and routes disallowed from search crawlers.
- Theme colors used by the web manifest.
- Official social profile links and opening hours when they are verified and ready to publish.

The header, mobile navigation, home contact panel, contact page, floating and mobile contact actions, footer, metadata, manifest, organization JSON-LD, robots file, and sitemap read from this configuration. Internal route links should use `localizedHref` so the active locale is retained.

## Confirm contact details

Keep `contact.detailsConfirmed` set to `false` until an authorized person confirms every public contact detail. When confirmed, set it to `true`; the quote page then replaces the “will be added after confirmation” text with configured call and WhatsApp links. Do not add unverified social profiles or opening hours: leave those arrays empty until the official details are provided.

Set `NEXT_PUBLIC_SITE_URL` to the deployed canonical origin when deploying. It is used for canonical metadata, organization structured data, robots, and sitemap URLs.

## Footer listings and sitemap

The footer fetches only published catalog treatments, verified/published hospitals, and published destinations from the existing catalog endpoints. A listing group is omitted when its result is empty. Catalog reads use the existing 30-second revalidation cache.

The route list in `siteConfig.routes.public` supplies the static public pages to the sitemap and robots file. The sitemap also includes published catalog detail pages and the locally defined treatment-area pages. Update this route list when public static routes are added or removed; private routes belong in `disallowedRobots`, not in the public route list.

## Safe editing

Keep phone display strings and their `tel:` links paired in the configured `phones` array. Keep the WhatsApp number digits-only with its international country code. Update the address coordinates together with the formatted address and generated map URLs. Only add real data after it is approved for publication.
