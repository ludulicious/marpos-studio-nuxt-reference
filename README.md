# Marpos Studio + Nuxt Content reference

A Nuxt 4 / Nuxt Content 3 adaptation of the [Marpos Studio Astro reference](https://github.com/ludulicious/marpos-studio-astro-reference), retaining its design, manual, fictional contributors, topics, 24 local photographs, and three attributed video lessons. MDX and Markdoc examples have been converted to native MDC components.

Follow the current [Marpos Studio integration documentation](https://github.com/ludulicious/marpos-studio-releases/blob/main/docs/README.md) and [Nuxt Content guide](https://github.com/ludulicious/marpos-studio-releases/blob/main/docs/nuxt-content.md). Nuxt Studio is not required.

## Run locally

Use Node 22.22.3+ (or a compatible Node 24/26 release) and npm 10. `.nvmrc` selects the latest Node 22 release.

```sh
npm ci
npm run dev
```

Open the URL printed by Nuxt (normally http://localhost:3000). In Marpos Studio, choose **Open local repository** and select this directory. Studio manages its own preview server; do not put a fixed localhost port in preview mappings.

```sh
npm run check     # Vue / TypeScript checks
npm run generate  # Static output in .output/public, including optimized images
npm test          # Verify generated routes, content, relationships and local assets
npm run build    # Optional Nitro server build
npm run preview  # Preview the Nitro server build
```

For static hosting, deploy `.output/public` at the domain root after `npm run generate`. For Node hosting, run `.output/server/index.mjs` after `npm run build`. Set `NUXT_PUBLIC_SITE_URL` to the real origin **before generating/building** for canonical URLs, social images, RSS and sitemap; the development default is `https://example.com`. Hosting is intentionally not tied to the source Astro repository or its GitHub Pages deployment.

## Content and routes

| Collection | Local source | Public destination |
| --- | --- | --- |
| Pages | `content/pages/**/*.md` | Explicit frontmatter `path`, or the numeric-prefix-free filename at `/` |
| Manual | `content/blog/**/*.md` | `/blog/<slug>/` |
| Contributors | `content/authors/*.json` | `/team/#<slug>` |
| Topics | `content/categories/*.yml` | `/topics/#<slug>` |
| Photos | `content/photos/*.json` | `/library/<slug>/` |
| Videos | `content/videos/*.json` | `/library/<slug>/` |

`content.config.ts` declares non-overlapping local sources and explicit schemas. Keep `slug` values unique within a collection, and also across photos and videos, which share one public route. Stable `slug` fields are used by Studio's reference pickers and resolved by the website. A new manual record needs a unique slug, title, description, publication date (`YYYY-MM-DD`), status, author, at least one topic, and reading time. Optional fields can stay absent.

Manual chapters sort by `chapter`, then title. Drafts appear in development for local preview and are excluded from production pages, listings, related chapters, RSS and sitemap. Media galleries include only `visible: true` records and sort by `order`, then title. Hidden assets remain usable as direct image/video references inside content; visibility governs their public library listing and detail route. Changing a photo's thumbnail changes card rendering without changing the full asset.

Page bodies use `ContentRenderer`. New ordinary pages are rendered by the catch-all route. The home, manual index, contributors and topics use their dedicated layouts. Author names, topic links, related posts and lesson videos resolve saved slugs against the corresponding collections.

## Studio authoring examples

- Folder `.navigation.yml` files provide labels, filters, media views, image/video library settings and link suggestions.
- `studio.preview.json` maps existing files to real routes; folder fallbacks cover new shared data. Add a mapping when introducing a custom destination. For a newly created chapter, use **Set preview page** with `/blog/<slug>/` if Studio cannot infer its destination from the shared queries.
- `studio.components.json` exposes `callout` and `story-sections` with `syntax: "mdc"`. Renderers live in `app/components/content/`.
- Chapter 7 demonstrates scalar callout properties, tones, spacing and Markdown content.
- Chapter 8 demonstrates named MDC slots and page-specific `studio.blocks` editing tabs.
- `studio.images.json` exposes compact, normal and wide image formats. `ProseImg.vue` renders these saved MDC attributes and custom widths responsively.

The Nuxt apps `vdzmediation` and `amstelgospelchoir` informed the collection/editor setup, media schemas and block-tab pattern. This reference has no external CMS, mail service, or account requirement.

## Handover checks

Use the installed Studio version on the authors' actual platform:

1. Open this folder and confirm all six collections appear; metadata files should not appear as editable records.
2. Edit a title, a required field, a nested image, an author reference and a topic reference. Check validation, save, reopen, and preview the actual route.
3. Create a new published chapter with a unique slug and references. Confirm it appears in the manual and renders at its URL. Switch it to draft and verify it is absent after a production generation.
4. Create a page and check its generated or explicit path. Update an author name and a topic description and check the directory and byline.
5. Upload a photo, set its alt text and credit, reorder it, test a separate thumbnail, filter the library and toggle visibility. Add a valid YouTube ID and test click-to-play playback.
6. Edit and insert a Callout, change its tone and compact spacing, then save and reopen. Edit both chapter 8 tabs and verify the named slots remain intact.
7. Change a Markdown image size and custom width; verify desktop and mobile previews.
8. Run the checks above. Review changes through normal Git tools; connected GitHub publishing should be tested on a test repository before use on a live site.

Studio's save/reopen/publish UI round trip is a separate acceptance check; a successful website build cannot prove it. There is no minimum Studio version claimed for every feature.

## Credits

The site retains `LICENSE.upstream`, the source project's media files and attribution data. Contributor profiles use fictional names and licensed portrait photographs. Each library detail page links to the original source and license. WordPress video lessons demonstrate general CMS concepts; the written guides describe Marpos Studio. See `/about/` and `/library/` for the full credits.
