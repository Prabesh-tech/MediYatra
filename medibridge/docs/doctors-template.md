# Doctor profile template

The showcase uses published doctor records when available. If there are no published records, it displays the clearly marked generic entries in `apps/web/src/data/doctors-placeholder.ts`.

## Add or replace a doctor

1. Replace a placeholder entry (or add a record to the existing published-doctor data source) with approved information. Keep the slug URL-safe and stable, and set the display name, role/specialty, and image path. Do not publish unverified credentials, affiliations, experience, or biographies.
2. Add the approved portrait at `apps/web/public/images/doctors/<slug>.png`. The slug in the filename must exactly match the data entry. Transparent PNG or WebP cutouts work best; the component uses `next/image` with `fill`, `object-contain`, and bottom alignment, and uses the silhouette placeholder if the image cannot load.
3. Prepare the image at a 3:4 portrait ratio, with the full upper body visible and transparent space around the subject. Keep the face and shoulders within the image bounds.
4. Remove or replace the generic placeholder data before launch. Confirm that the doctor has approved the profile and image for publication.

For example, a doctor with the slug `sample-doctor` uses `apps/web/public/images/doctors/sample-doctor.png`. The corresponding image path in the data is `/images/doctors/sample-doctor.png`.
