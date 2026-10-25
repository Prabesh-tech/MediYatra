# Cleanup audit report

**Status:** Approved Group 2 cleanup has been applied. All other candidates remain unchanged and require separate approval.

## Audit scope and safety notes

- Reviewed the project README design, image, and wording rules (sections 17-19), the current `/en` homepage accessibility snapshot, the web source tree, public assets, package scripts, Git status, and `.gitignore`.
- The Git repository is initialized at `D:\Medical Tourism` and has baseline commit `0354c09` (`Add MediYatra project`). Cleanup is on branch `cleanup-and-redesign`. The worktree was already dirty with substantial tracked and untracked changes; those unrelated changes have been preserved and excluded from the cleanup commit.
- The root `.env` was not opened. This audit did not change any `apps/api` source, Prisma schema/migrations, package manifest, lockfile, README, or referenced image; any pre-existing dirty changes in those areas were left untouched.
- The full homepage snapshot includes the hero, trust strip, service panels, coordination cards, seven-step journey, specialties, doctor showcase, reasons, country and nursing sections, empty success-story state, FAQs, CTA, contact/review areas, and footer. Other routes were inventoried from the App Router source; this was not a route-by-route visual review.
- `npx --no-install knip`, `npx --no-install ts-prune`, and `npx --no-install depcheck` could not run because those tools are not present locally. `npx` declined to fetch missing packages; no package was installed. Unused-code and dependency findings below therefore rely on repository searches and are limited to high-confidence candidates.

## 1. Junk and generated files

| Candidate | Status | Why it may be unused | Recommendation |
|---|---|---|---|
| `nul` (monorepo root) | Untracked, 31 bytes | Root-level stray file; not source, configuration, or a tracked project file. | Remove only if approved. |
| `next3102.log` (monorepo root) | Untracked, 80 bytes | Development log; not source or configuration. | Remove only if approved. |
| `.turbo/` (monorepo root) | Ignored generated directory | Turborepo cache; can be regenerated. It is not tracked. | Optional cache cleanup only if approved. |
| `apps/web/.next/` | Ignored generated directory | Next.js build/development output; can be regenerated. It is not tracked. | Optional cache cleanup only if approved. |

The tracked-file scan found no committed `nul`, log, `.tsbuildinfo`, `dist/`, `.next/`, backup, OS metadata, or scratch files. No tracked generated build directory is proposed for removal.

Current `.gitignore` already covers `node_modules/`, `.next/`, `.next-dev/`, `.turbo/`, `dist/`, `coverage/`, `*.tsbuildinfo`, `.env`, and `.env.*.local`. It does **not** cover all requested patterns. After approval, update it to cover `.env*` while explicitly allowing `.env.example`, `*.log`, `.DS_Store`, and `Thumbs.db`. No environment file will be removed or edited.

## 2. Unused code

| Candidate | Evidence | Recommendation |
|---|---|---|
| `apps/web/src/components/home/home-content.tsx` | Search found no import or use of `HomeContent`. The active locale route imports `MediYatraHomeContent` from `mediyatra-home-content.tsx` instead. This unused component also contains a remote Unsplash image URL, contrary to the repository's local/user-supplied image rule. | Removed as approved. Its exclusive `.hero-visual` and `.hero-search*` rules were also removed. |
| `apps/web/src/components/home/hero-exploded-mark.tsx` and the `useHeroScrollProgress` export/provider in `hero-interactions.tsx` | No current route imports `HeroExplodedMark`; the current homepage uses the photo carousel and `HeroIntro`. Search found the progress hook used only by this unused component. | Removed from the working tree as approved, together with its exclusive styles. The component and hook were worktree-only changes; they were not added to the cleanup commit. |
| `apps/web/src/components/shared/animated-counter.tsx` | `AnimatedCounter` has no current imports/usages. | Unused today, but the requested upcoming redesign explicitly calls for counters. Recommend retaining it for reuse rather than deleting and recreating it. |

The `HomeContent`, `HeroExplodedMark`, and `AnimatedCounter` checks were source searches, not Knip/ts-prune results. `AnimatedCounter` is retained. No route or translation key is proposed for removal: the existing App Router pages remain public routes, and English is the only file under `apps/web/src/i18n/messages/` (no Nepali message file was found). No dependency removal is justified without a successful depcheck run.

## 3. Unused assets

### Removal candidates

| Candidate | Evidence | Recommendation |
|---|---|---|
| `apps/web/public/icons/medibridge.svg` | No source reference to this path or filename was found. | Candidate for removal after confirming it is not consumed by external deployment tooling. |
| `apps/web/public/icons/mediyatra-logo.svg` | No source reference to this path or filename was found. | Candidate for removal after confirming it is not consumed by external deployment tooling. |

### Referenced images to preserve

All files under `apps/web/public/images/` have source/config references, including all nine `slide-01.png` through `slide-09.png` images, `hero-medical-team.png`, `doctor-white-coat.png`, both nursing images, and `mediyatra-wordmark.png`. No image is proposed for deletion.

`slide-01.png` and `doctor-white-coat.png` are exact byte-for-byte duplicates (both 150,059 bytes and the same SHA-256 hash), but both filenames are referenced. Do not delete either under the current safety rule; consider deduplicating references only after the redesign has settled.

### Images over the 300 KB compression threshold

These referenced image assets exceed 300 KB and should be considered for lossless or visually reviewed compression. Compression is not deletion and should be checked for image quality and layout impact.

| File | Size |
|---|---:|
| `apps/web/public/images/slide-03.png` | 1,246,678 bytes |
| `apps/web/public/images/slide-06.png` | 1,020,413 bytes |
| `apps/web/public/images/hero-medical-team.png` | 925,794 bytes |
| `apps/web/public/images/nurse-care.png` | 654,551 bytes |
| `apps/web/public/images/slide-09.png` | 502,765 bytes |
| `apps/web/public/images/mediyatra-wordmark.png` | 398,683 bytes |
| `apps/web/public/images/slide-02.png` | 398,423 bytes |
| `apps/web/public/images/slide-04.png` | 358,935 bytes |

## 4. Unused dependencies

No dependency is recommended for removal. `npx --no-install depcheck` could not run because depcheck is not installed locally, and package fetching was declined. The package manifests were not changed; dependency removals require a successful analyzer run and validation.

## 5. Duplicate or conflicting CSS

### Approved unused-style cleanup

- Removed the legacy `.hero-visual`, `.hero-search-wrap`, and `.hero-search` rules associated exclusively with `home-content.tsx`.
- Removed the `.hero-object` and `.hero-mark-*` rules associated with `hero-exploded-mark.tsx` from the working tree. Unrelated, pre-existing hero styling changes were not included in the cleanup commit.

### Conflicting/overridden style areas

- Homepage hero styling is layered across the original rules around lines 532-674, responsive overrides around lines 1028-1108, the earlier story/mark rules around lines 1710-1791, and the newer photo-led hero rules later in the same file. Repeated selectors include `.hero`, `.hero::before`, `.hero::after`, `.hero-layout`, `.hero-content`, `.hero-visual`, and responsive hero selectors.
- Some later declarations intentionally override earlier declarations; wholesale deletion of an earlier block is not safe based on duplicate selector names alone. Consolidate after the visual redesign, preserving shared classes still used by the active hero and other pages. The code-search utility audit was manual; no automated unused-CSS checker was run.

## Remaining approval-gated candidates

Only Group 2 was approved and applied. Junk/generated-file cleanup, `.gitignore` changes, unused SVG removal, image compression, and broader CSS consolidation remain untouched pending approval. The existing dirty worktree remains preserved and excluded from the cleanup commit. Web typecheck and production build passed; build-time requests to the unavailable API logged `ECONNREFUSED` but did not fail the build.
