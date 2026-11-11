import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import {
  menu,
  categories,
  allergenDefinitions,
  additiveDefinitions,
} from "../lib/menu";
import {
  filterMenu,
  formatPrice,
  menuUrl,
  normalize,
  validCategory,
} from "../lib/menu-utils";
test("all readable menu entries are represented with unique identifiers and valid cents", () => {
  assert.equal(menu.length, 85);
  assert.equal(new Set(menu.map((i) => i.id)).size, menu.length);
  for (const i of menu) {
    assert.ok(categories.some((c) => c.id === i.categoryId));
    assert.ok(i.priceCents === null || Number.isInteger(i.priceCents));
    assert.ok(i.name.de && i.name.en);
  }
});
test("original photographed dessert prices and scoop counts remain accurate", () => {
  const photographed: Record<string, number> = {
    ananas: 890,
    stracciatella: 850,
    haselnuss: 890,
    erdbeer: 950,
    schoko: 850,
    banane: 850,
    walnuss: 890,
    krokant: 890,
    klein: 950,
    pfirsich: 890,
    melone: 1350,
    "erdbeeren-sahne": 850,
    mexico: 1350,
    kiwi: 860,
    raffaello: 950,
    himbeere: 1090,
    heidelbeere: 950,
    amarena: 890,
    bounty: 890,
    "orangen-flip": 790,
    "banana-split": 950,
    ferrero: 950,
    donat: 1190,
    "kinder-bueno": 950,
    oreo: 950,
    "vier-kugeln": 800,
    obstsalat: 890,
    eiskaffee: 690,
    milkshake: 690,
    schneemann: 650,
    "micky-maus": 650,
  };
  for (const [id, cents] of Object.entries(photographed))
    assert.equal(menu.find((i) => i.id === id)?.priceCents, cents, id);
  assert.equal(
    menu.find((i) => i.id === "oreo")?.servingSize?.de,
    "2 Kugeln Eis",
  );
  assert.equal(
    menu.find((i) => i.id === "melone")?.servingSize?.de,
    "2 Kugeln Eis",
  );
});
test("flavours cost two euros per scoop and footnote references resolve", () => {
  assert.equal(menu.filter((i) => i.categoryId === "flavours").length, 23);
  for (const i of menu) {
    if (i.categoryId === "flavours") assert.equal(i.priceCents, 200);
    for (const c of i.allergenCodes) assert.ok(allergenDefinitions[c]);
    for (const c of i.additiveCodes) assert.ok(additiveDefinitions[c]);
  }
  assert.deepEqual(menu.find((i) => i.id === "flavour-banane")?.allergenCodes, [
    "1",
  ]);
  assert.deepEqual(menu.find((i) => i.id === "banane")?.allergenCodes, []);
});
test("search handles case, diacritics, sharp s, ingredients and all search terms", () => {
  assert.equal(normalize("SÄFTE Weiß"), "safte weiss");
  assert.deepEqual(
    filterMenu(menu, "de", "NUTÉLLA", "all").map((i) => i.id),
    ["banane"],
  );
  assert.deepEqual(
    filterMenu(menu, "en", "fresh pineapple", "all").map((i) => i.id),
    ["ananas"],
  );
  assert.equal(filterMenu(menu, "en", "Kiwisauce", "all").length, 0);
});
test("category and search combine; unavailable entries are omitted", () => {
  assert.equal(filterMenu(menu, "de", "Nutella", "sundaes").length, 0);
  assert.equal(filterMenu(menu, "de", "Nutella", "fruit").length, 1);
  assert.equal(
    filterMenu([{ ...menu[0], available: false }], "de", "", "all").length,
    0,
  );
  assert.equal(filterMenu(menu, "de", "zzzzxx", "all").length, 0);
});
test("URLs round-trip reserved characters and preserve language/filter state", () => {
  const url = menuUrl("en", "cream & café", "fruit");
  const p = new URL(url, "https://example.test").searchParams;
  assert.equal(p.get("q"), "cream & café");
  assert.equal(p.get("category"), "fruit");
  assert.ok(url.startsWith("/en/menu/"));
  assert.equal(menuUrl("de", "", "all"), "/de/menu/");
  assert.equal(validCategory("invalid"), "all");
});
test("currency uses localized euro formatting and supports unresolved prices", () => {
  assert.equal(formatPrice(890, "de"), "8,90\u00a0€");
  assert.equal(formatPrice(890, "en"), "€8.90");
  assert.equal(formatPrice(null, "de"), "Preis auf Anfrage");
  assert.equal(formatPrice(null, "en"), "Ask for price");
});
test("all referenced product assets exist locally", () => {
  for (const i of menu) {
    if (i.image) assert.ok(existsSync(`public${i.image}`), i.image);
  }
});
test("documented drink sizes and unnamed milkshake are preserved", () => {
  assert.equal(
    menu.find((i) => i.id === "coca-cola")?.servingSize?.en,
    "0.20 L",
  );
  assert.equal(
    menu.find((i) => i.id === "stilles-wasser")?.servingSize?.en,
    "0.25 L",
  );
  assert.equal(menu.find((i) => i.id === "redbull")?.servingSize, undefined);
  assert.equal(menu.filter((i) => i.categoryId === "shakes").length, 1);
  assert.deepEqual(menu.find((i) => i.id === "milkshake")?.ingredients, {
    de: [],
    en: [],
  });
});
