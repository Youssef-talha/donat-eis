# Validation notes

- 85 readable source menu entries, including 23 named ice cream flavours. Two covered flavour names are recorded separately in `content-review.md`.
- Source dessert prices and scoop counts checked against all menu photos. Notable values retained: Kiwi €8.60; Himbeere €10.90; Donat €11.90; Melone and Mexico €13.50; the small sundae €9.50; two scoops in Oreo; €2.00 per individual scoop.
- Nine automated tests cover content integrity, documented prices and volumes, localized search and accent normalization, combined filters, URL encoding, hidden availability, currency formatting and local image existence.
- Browser checks: search by ingredient with accents (`NUTÉLLA`), filters combined with search, empty state and reset, DE/EN switching with query/category, browser Back, root redirect, modal autofocus, Escape close and focus restoration.
- Responsive checks: no document overflow at 320px and 390px (one product column), 820px (two columns), and 1366px (three columns). Category chips scroll independently.
- Dependency audit on 11 November 2026 found no runtime dependency advisories. Eight moderate development-only findings stem from a transitive `minimatch` advisory in the ESLint/TypeScript-ESLint chain. The suggested automatic remedy would downgrade Next's ESLint config across a major version, so it was not applied. The deployed static export contains none of those linting packages.
- Final production static export served successfully over local HTTP. Its product dialog opened with the correct content and Escape restored focus. All 31 product asset files exist; visible production images loaded without errors.
- Hosting was not published: automatic approval review rejected the external source upload because the destination/source-photo transfer was not explicitly authorized. The runnable local project and static export are complete.
