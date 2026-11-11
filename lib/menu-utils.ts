import { categories, type Locale, type MenuItem } from "./menu";
export function normalize(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ß/g, "ss");
}
export function filterMenu(
  items: MenuItem[],
  locale: Locale,
  query: string,
  category: string,
): MenuItem[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return items.filter(
    (item) =>
      item.available &&
      (category === "all" || item.categoryId === category) &&
      terms.every((term) =>
        normalize(
          [
            item.name[locale],
            item.description[locale],
            ...item.ingredients[locale],
          ].join(" "),
        ).includes(term),
      ),
  );
}
export function validCategory(value: string | null) {
  return categories.some((c) => c.id === value) ? value! : "all";
}
export function formatPrice(cents: number | null, locale: Locale): string {
  return cents === null
    ? locale === "de"
      ? "Preis auf Anfrage"
      : "Ask for price"
    : new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-IE", {
        style: "currency",
        currency: "EUR",
      }).format(cents / 100);
}
export function menuUrl(locale: Locale, query: string, category: string) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category !== "all") params.set("category", category);
  return `/${locale}/menu/${params.size ? `?${params}` : ""}`;
}
