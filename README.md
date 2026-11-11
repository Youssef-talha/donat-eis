# Donat Eis

A complete bilingual QR-table menu built with Next.js App Router, TypeScript, React and Tailwind CSS. German and English routes, 85 readable menu entries, search, category filters, accessible product details, local images, and responsive layouts. No accounts, ordering, database or paid service is required to run the application.

## Requirements and setup

Node.js 22 LTS or newer supported LTS. Install the exact dependency versions from `package-lock.json`:

```sh
npm ci
npm run dev
```

Open [the German menu](http://localhost:3000/de/menu/) or [the English menu](http://localhost:3000/en/menu/). `/` redirects to `/de/menu/`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Production and deployment

The default config produces a static export in `out/`. Deploy the entire `out/` folder to a static host with directory index support (Cloudflare Pages, Netlify, GitHub Pages with appropriate path configuration, nginx, or equivalent). No runtime server is required. Each menu route has its own generated HTML. `/` contains an immediate HTML refresh redirect that works on static hosts and without JavaScript. Configure an HTTP 308 redirect from `/` to `/de/menu/` on your host if HTTP-level redirects are preferred.

To serve the export locally, use any static HTTP server, e.g. `npx serve out`. For a Node.js/Vercel deployment, remove `output: 'export'` from `next.config.ts`, run `npm run build`, then `npm start` (or let Vercel build it). `next start` does not serve static export mode.

Set the actual public origin as `NEXT_PUBLIC_SITE_URL` before building to emit canonical and alternate-language metadata. Copy `.env.example` to `.env.local` and configure your real URL. When the variable is absent, absolute canonical URLs are intentionally omitted. No production domain is assumed. Future table QR codes should point to `${NEXT_PUBLIC_SITE_URL}/de/menu/`.

The optional Sites publication is configured by `.openai/hosting.json`; it does not affect ordinary static hosting. Keep the assigned project ID if updating the same Site.

## Editing the menu

`lib/menu.ts` contains the typed `MenuItem` records, categories and separate footnote definition maps. Prices are integer euro cents (`890` = €8.90); use `null` for an unresolved price. `available: false` hides an item. Keep IDs stable: they identify assets and content in checks. Add German and English names/descriptions/ingredients together. Set `servingSize` only when documented. Sorting follows the data order; `sortOrder` is available for later editorial sorting.

The `dessert()` helper builds descriptions from documented scoop counts and ingredients; `add()` handles drinks, flavours and other items. `milkFlavours` and `fruitFlavours` are source-transcribed lists at €2 per scoop. Fruit ice cream is a printed category, **not** a vegan or dairy-free claim; the banana flavour explicitly retains its milk marker.

Use `allergenCodes` and `additiveCodes` only for confirmed source mappings. They have separate namespaces even when numbers coincide. An empty list means no confirmed mapping in this transcription, not absence of allergens. The details dialog directs customers to staff. The original spelling is normalized only for ordinary German orthography (e.g. Umlauts and sauce spelling); menu products and prices come from the printed photographs, not the design mockup.

The three unnamed milkshake photos are one €6.90 listing. Two covered flavour names are intentionally omitted. All unresolved transcription issues are in `content-review.md`, which is not served to customers.

## Images and owner review

All dessert product images in `public/images/` are AI-generated reconstructions made with the built-in imagegen tool, based on the original menu's documented ingredients and presentation. They are illustrative, not photographs of the café's actual servings, and need owner review before public customer use. No photo was extracted from the website mockup, no whole menu page is used as a card, and no stock or remote image URL is used. Generated prompts and provenance are recorded in `docs/image-prompts.json`.

Local WebP assets are resized and compressed at build-authoring time and rendered with `next/image` with fixed dimensions and responsive `sizes`. Static export uses `images.unoptimized` because no image optimization server is deployed. Replace each `/images/<id>.webp` with an approved real product photo to update the appearance. Missing optional images use a neutral café placeholder; drinks/flavours use text rows without unrelated photos.

## Behaviour and implementation

Layouts, route validation and metadata are server components. The interactive menu browser owns the local dataset, search and selection state; product details use a native modal `dialog` (focus containment, Escape, close control, focus restoration). Search is localized, case/diacritic-insensitive and combines all terms with the active category. Query parameters `q` and `category` preserve state on reload, history navigation and language switching. No client requests leave the application.

Mobile navigation uses a compact menu, sticky single-row scrolling category chips, and one-column cards; tablet uses two columns, desktop three. Reduced-motion preferences disable transitions and smooth scrolling. Fonts are system Georgia/Arial, avoiding third-party font requests.

## Content source

The nine original printed-menu photographs supplied with the project brief are authoritative and retained in `docs/source-menu/` for owner review; they are not included in the public export. The cover and family-history page support the wordmark, 1978 heritage and Zadar origin. The visual mockup guides colours, typography and layout only. No address, hours, phone number, reviews or social links have been invented.
