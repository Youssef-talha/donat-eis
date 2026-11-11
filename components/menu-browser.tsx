"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { categories, menu, type Locale, type MenuItem } from "@/lib/menu";
import {
  filterMenu,
  formatPrice,
  menuUrl,
  validCategory,
} from "@/lib/menu-utils";
import { SearchIcon, ArrowIcon, CloseIcon, ScoopIcon } from "./icons";
import ProductDialog from "./product-dialog";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("menu:url", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("menu:url", callback);
  };
}
const snapshot = () => window.location.search;
const serverSnapshot = () => "";
export default function MenuBrowser({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const searchParams = new URLSearchParams(
    useSyncExternalStore(subscribe, snapshot, serverSnapshot),
  );
  const query = searchParams.get("q") ?? "";
  const category = validCategory(searchParams.get("category"));
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const filtered = useMemo(
    () => filterMenu(menu, locale, query, category),
    [locale, query, category],
  );
  function update(q: string, cat: string, push = false) {
    window.history[push ? "pushState" : "replaceState"](
      null,
      "",
      menuUrl(locale, q, cat),
    );
    window.dispatchEvent(new Event("menu:url"));
  }
  function reset() {
    update("", "all");
  }
  const allDesserts = category === "all";
  const sections = allDesserts
    ? [
        {
          id: "desserts",
          heading: { de: "Unsere Eisbecher", en: "Our Ice Cream Sundaes" },
          items: filtered.filter(
            (i) => i.categoryId === "sundaes" || i.categoryId === "fruit",
          ),
        },
        ...categories
          .filter((c) => c.id !== "sundaes" && c.id !== "fruit")
          .map((c) => ({
            ...c,
            items: filtered.filter((i) => i.categoryId === c.id),
          })),
      ]
    : categories
        .filter((c) => c.id === category)
        .map((c) => ({
          ...c,
          items: filtered.filter((i) => i.categoryId === c.id),
        }));
  return (
    <>
      <a className="skip-link" href="#menu">
        {de ? "Zur Speisekarte springen" : "Skip to menu"}
      </a>
      <div className="site-shell">
        <header className="site-header">
          <Link
            href={menuUrl(locale, "", "all")}
            className="wordmark"
            aria-label="Donat Eis"
            onClick={() => update("", "all")}
          >
            DONAT EIS
          </Link>
          <span className="header-divider" />
          <nav
            className="desktop-nav"
            aria-label={de ? "Hauptnavigation" : "Main navigation"}
          >
            <a className="nav-active" href="#menu">
              {de ? "Speisekarte" : "Menu"}
            </a>
            <a href="#about">{de ? "Über uns" : "About us"}</a>
          </nav>
          <nav
            className="language-nav"
            aria-label={de ? "Sprache" : "Language"}
          >
            <Link
              lang="de"
              href={menuUrl("de", query, category)}
              aria-current={de ? "page" : undefined}
            >
              DE
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              lang="en"
              href={menuUrl("en", query, category)}
              aria-current={!de ? "page" : undefined}
            >
              EN
            </Link>
          </nav>
          <button
            className="mobile-toggle icon-button"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={de ? "Navigation öffnen" : "Open navigation"}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <CloseIcon />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
          {mobileOpen && (
            <nav
              className="mobile-nav"
              id="mobile-nav"
              aria-label={de ? "Hauptnavigation" : "Main navigation"}
            >
              <a href="#menu" onClick={() => setMobileOpen(false)}>
                {de ? "Speisekarte" : "Menu"}
              </a>
              <a href="#about" onClick={() => setMobileOpen(false)}>
                {de ? "Über uns" : "About us"}
              </a>
            </nav>
          )}
        </header>
        <main>
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                {de
                  ? "Ein kleiner Moment. Pures Glück."
                  : "A little moment. Pure happiness."}
              </p>
              <h1 id="hero-title">{de ? "Unsere Speisekarte" : "Our Menu"}</h1>
              <div className="hero-subtitle">
                <span />
                <p>{de ? "Eisgenuss seit 1978" : "Ice cream since 1978"}</p>
                <span />
              </div>
              <p className="hero-intro">
                {de
                  ? "Lieblingsbecher finden, zurücklehnen und genießen."
                  : "Find your favourite, sit back and enjoy."}
              </p>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-glow" />
              <Image
                className="hero-dessert"
                src="/images/erdbeer.webp"
                alt=""
                width={700}
                height={700}
                priority
                sizes="(max-width: 700px) 1px, 480px"
              />
              <span className="hero-seal">
                {de ? "seit" : "since"}
                <br />
                <b>1978</b>
              </span>
            </div>
          </section>
          <div className="menu-controls" id="menu">
            <div className="search-row">
              <div className="search-field">
                <SearchIcon />
                <label className="sr-only" htmlFor="menu-search">
                  {de ? "Speisekarte durchsuchen" : "Search the menu"}
                </label>
                <input
                  id="menu-search"
                  type="search"
                  autoComplete="off"
                  placeholder={
                    de ? "Lieblingseis suchen…" : "Find your favourite…"
                  }
                  value={query}
                  onChange={(e) => update(e.target.value, category)}
                />
                {query && (
                  <button
                    className="icon-button clear-search"
                    aria-label={de ? "Suche löschen" : "Clear search"}
                    onClick={() => update("", category)}
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
              <span className="browse-hint">
                {de
                  ? "Für jeden Geschmack ein Glücksmoment."
                  : "A little happiness for every taste."}
              </span>
            </div>
            <div className="category-scroller">
              <nav
                className="category-chips"
                aria-label={de ? "Menükategorien" : "Menu categories"}
              >
                {[
                  { id: "all", name: { de: "Alle", en: "All" } },
                  ...categories,
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={category === c.id}
                    onClick={() => update(query, c.id, true)}
                    className={category === c.id ? "chip selected" : "chip"}
                  >
                    {c.name[locale]}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          <div className="menu-content">
            {(query || category !== "all") && (
              <div className="results-line">
                <p role="status">
                  {filtered.length}{" "}
                  {de
                    ? filtered.length === 1
                      ? "Ergebnis"
                      : "Ergebnisse"
                    : filtered.length === 1
                      ? "result"
                      : "results"}
                  {query && (
                    <>
                      {" "}
                      {de ? "für" : "for"} „{query}“
                    </>
                  )}
                </p>
                <button className="text-button" onClick={reset}>
                  {de ? "Filter zurücksetzen" : "Reset filters"}
                </button>
              </div>
            )}
            {filtered.length === 0 ? (
              <section className="empty-state">
                <ScoopIcon />
                <h2>
                  {de
                    ? "Noch nicht das Richtige dabei?"
                    : "No favourites found just yet."}
                </h2>
                <p>
                  {de
                    ? "Versuchen Sie einen anderen Suchbegriff oder entdecken Sie die ganze Karte."
                    : "Try another search or explore the full menu."}
                </p>
                <button className="primary-button" onClick={reset}>
                  {de
                    ? "Alle Köstlichkeiten entdecken"
                    : "Explore the full menu"}
                  <ArrowIcon />
                </button>
              </section>
            ) : (
              sections
                .filter((s) => s.items.length)
                .map((section) => {
                  const compact = [
                    "hot",
                    "cold",
                    "juices",
                    "flavours",
                  ].includes(section.id);
                  return (
                    <section
                      className="menu-section"
                      key={section.id}
                      aria-labelledby={`heading-${section.id}`}
                    >
                      <div className="section-heading">
                        <h2 id={`heading-${section.id}`}>
                          {section.heading[locale]}
                        </h2>
                        <span className="section-line" />
                        <span className="section-count">
                          {String(section.items.length).padStart(2, "0")}
                        </span>
                      </div>
                      {section.id === "flavours" && (
                        <p className="section-note">
                          {de
                            ? "Eine Kugel, ein Lieblingsmoment."
                            : "One scoop, one happy moment."}{" "}
                          <strong>
                            {de ? "1 Kugel" : "1 scoop"} ·{" "}
                            {formatPrice(200, locale)}
                          </strong>
                        </p>
                      )}
                      <div
                        className={compact ? "compact-grid" : "product-grid"}
                      >
                        {section.items.map((item, index) => (
                          <button
                            type="button"
                            key={item.id}
                            className={
                              compact
                                ? "menu-row"
                                : `product-card ${item.image ? "" : "no-image"}`
                            }
                            onClick={() => setSelected(item)}
                            aria-label={`${item.name[locale]}, ${formatPrice(item.priceCents, locale)}. ${de ? "Details ansehen" : "View details"}`}
                          >
                            {!compact && (
                              <div
                                className={`card-image ${item.image ? "" : "placeholder-image"}`}
                              >
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={
                                      item.imageAlt?.[locale] ??
                                      item.name[locale]
                                    }
                                    width={440}
                                    height={440}
                                    sizes="(max-width: 600px) 100vw, (max-width: 1000px) 25vw, 18vw"
                                    loading={index < 3 ? "eager" : "lazy"}
                                  />
                                ) : (
                                  <>
                                    <ScoopIcon />
                                    <span>DONAT EIS</span>
                                  </>
                                )}
                              </div>
                            )}
                            <div className="card-copy">
                              <h3>{item.name[locale]}</h3>
                              {item.description[locale] && (
                                <p className="card-description">
                                  {item.description[locale]}
                                </p>
                              )}
                              {compact && item.servingSize && (
                                <p className="row-size">
                                  {item.servingSize[locale]}
                                </p>
                              )}
                              {item.flavourType && (
                                <span className="flavour-type">
                                  {item.flavourType === "milk"
                                    ? de
                                      ? "Milchspeiseeis"
                                      : "Milk ice cream"
                                    : de
                                      ? "Fruchtspeiseeis"
                                      : "Fruit ice cream"}
                                </span>
                              )}
                              <div className="card-bottom">
                                <span className="price">
                                  {formatPrice(item.priceCents, locale)}
                                </span>
                                <span className="card-arrow">
                                  <ArrowIcon />
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  );
                })
            )}
            <section className="about-section" id="about">
              <div className="about-year">
                1978
                <span>
                  {de
                    ? "Der Anfang unserer Geschichte"
                    : "Where our story began"}
                </span>
              </div>
              <div>
                <p className="eyebrow">
                  {de ? "Tradition, die man schmeckt" : "A taste of tradition"}
                </p>
                <h2>
                  {de
                    ? "Ein Stück Familiengeschichte."
                    : "A little family history."}
                </h2>
                <p>
                  {de
                    ? "Unsere Geschichte begann 1978 als Familienbetrieb in Zadar, Kroatien. Auch als nächste Generation stellen wir unser Eis aus ausgewählten Naturprodukten nach traditioneller Rezeptur her."
                    : "Our story began in 1978 as a family business in Zadar, Croatia. As the next generation, we continue to make our ice cream with selected natural ingredients, following traditional recipes."}
                </p>
                <p className="signature">
                  {de ? "Ihr Team von Donat Eis" : "Your Donat Eis team"}
                </p>
              </div>
            </section>
          </div>
        </main>
        <footer className="site-footer">
          <div>
            <span className="footer-wordmark">DONAT EIS</span>
            <p>
              {de ? "Vielen Dank für Ihren Besuch." : "Thank you for visiting."}
            </p>
          </div>
          <p className="footer-note">
            {de
              ? "Alle Preise in Euro. Bei Fragen zu Allergenen und Zusatzstoffen hilft Ihnen unser Personal gerne weiter."
              : "All prices in euros. Our staff will be happy to help with questions about allergens and additives."}
          </p>
          <a className="back-top" href="#hero-title">
            {de ? "Nach oben" : "Back to top"} ↑
          </a>
        </footer>
      </div>
      {selected && (
        <ProductDialog
          key={selected.id}
          item={selected}
          locale={locale}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
