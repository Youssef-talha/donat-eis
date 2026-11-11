export type Locale = "de" | "en";
export type Localized<T = string> = Record<Locale, T>;
export type CategoryId =
  | "sundaes"
  | "fruit"
  | "kids"
  | "shakes"
  | "flavours"
  | "hot"
  | "cold"
  | "juices";
export type MenuItem = {
  id: string;
  slug: string;
  categoryId: CategoryId;
  name: Localized;
  description: Localized;
  priceCents: number | null;
  servingSize?: Localized;
  image?: string;
  imageAlt?: Localized;
  ingredients: Localized<string[]>;
  allergenCodes: string[];
  additiveCodes: string[];
  available: boolean;
  sortOrder: number;
  source: string;
  flavourType?: "milk" | "fruit";
};
export const categories: {
  id: CategoryId;
  name: Localized;
  heading: Localized;
}[] = [
  {
    id: "sundaes",
    name: { de: "Eisbecher", en: "Ice Cream Sundaes" },
    heading: { de: "Unsere Eisbecher", en: "Our Ice Cream Sundaes" },
  },
  {
    id: "fruit",
    name: { de: "Fruchtbecher", en: "Fruit Sundaes" },
    heading: { de: "Fruchtig & frisch", en: "Fresh & Fruity" },
  },
  {
    id: "kids",
    name: { de: "Kinder", en: "Kids" },
    heading: { de: "Für unsere kleinen Gäste", en: "For Our Little Guests" },
  },
  {
    id: "shakes",
    name: { de: "Milchshakes", en: "Milkshakes" },
    heading: { de: "Milchshakes", en: "Milkshakes" },
  },
  {
    id: "flavours",
    name: { de: "Eissorten", en: "Ice Cream Flavours" },
    heading: { de: "Unsere Eissorten", en: "Our Ice Cream Flavours" },
  },
  {
    id: "hot",
    name: { de: "Warme Getränke", en: "Hot Drinks" },
    heading: { de: "Warme Getränke", en: "Hot Drinks" },
  },
  {
    id: "cold",
    name: { de: "Kalte Getränke", en: "Cold Drinks" },
    heading: { de: "Kalte Getränke", en: "Cold Drinks" },
  },
  {
    id: "juices",
    name: { de: "Säfte", en: "Juices" },
    heading: { de: "Säfte & Erfrischungen", en: "Juices & Refreshments" },
  },
];
export const allergenDefinitions: Record<string, Localized> = {
  "1": {
    de: "Milch und daraus gewonnene Erzeugnisse (einschließlich Laktose)",
    en: "Milk and milk products (including lactose)",
  },
  "2": {
    de: "Eier und daraus gewonnene Erzeugnisse",
    en: "Eggs and egg products",
  },
  "3": {
    de: "Sojabohnen und daraus gewonnene Erzeugnisse",
    en: "Soybeans and soy products",
  },
  "4": {
    de: "Glutenhaltige Getreide: Weizen, Roggen, Gerste, Hafer oder Hybridstämme sowie daraus hergestellte Erzeugnisse",
    en: "Cereals containing gluten: wheat, rye, barley, oats or hybrid strains, and their products",
  },
  "5": {
    de: "Schalenfrüchte und daraus gewonnene Erzeugnisse",
    en: "Nuts and nut products",
  },
  "6": {
    de: "Erdnüsse und daraus gewonnene Erzeugnisse",
    en: "Peanuts and peanut products",
  },
};
export const additiveDefinitions: Record<string, Localized> = {
  "1": { de: "Mit Farbstoff", en: "Contains colouring" },
  "2": { de: "Mit Konservierungsstoffen", en: "Contains preservatives" },
  "3": { de: "Mit Antioxidationsmittel", en: "Contains antioxidants" },
  "4": { de: "Enthält Sulfite", en: "Contains sulphites" },
  "5": { de: "Mit Milcheiweiß", en: "Contains milk protein" },
  "6": { de: "Mit Taurin", en: "Contains taurine" },
  "7": { de: "Mit Süßungsmitteln", en: "Contains sweeteners" },
  "8": { de: "Koffeinhaltig", en: "Contains caffeine" },
  "9": { de: "Chininhaltig", en: "Contains quinine" },
  "10": { de: "Saisonabhängig", en: "Seasonal" },
};
const items: MenuItem[] = [];
function add(
  id: string,
  categoryId: CategoryId,
  de: string,
  en: string,
  cents: number | null,
  descDe = "",
  descEn = "",
  options: Partial<MenuItem> = {},
) {
  items.push({
    id,
    slug: id,
    categoryId,
    name: { de, en },
    priceCents: cents,
    description: { de: descDe, en: descEn },
    ingredients: { de: [], en: [] },
    allergenCodes: [],
    additiveCodes: [],
    available: true,
    sortOrder: items.length,
    source: "Original printed menu photographs",
    ...options,
  });
}
function dessert(
  id: string,
  cat: CategoryId,
  de: string,
  en: string,
  cents: number,
  scoops: number | null,
  ingredientsDe: string[],
  ingredientsEn: string[],
  image = false,
) {
  const serving = scoops
    ? { de: `${scoops} Kugeln Eis`, en: `${scoops} scoops of ice cream` }
    : undefined;
  add(
    id,
    cat,
    de,
    en,
    cents,
    [...(serving ? [serving.de] : []), ...ingredientsDe].join(", "),
    [...(serving ? [serving.en] : []), ...ingredientsEn].join(", "),
    {
      servingSize: serving,
      ingredients: { de: ingredientsDe, en: ingredientsEn },
      ...(image
        ? {
            image: `/images/${id}.webp`,
            imageAlt: { de: `${de} im Eisglas`, en: `${en} in a sundae glass` },
          }
        : {}),
    },
  );
}
dessert(
  "ananas",
  "sundaes",
  "Ananas Becher",
  "Pineapple Sundae",
  890,
  3,
  ["Sahne", "frische Ananas"],
  ["whipped cream", "fresh pineapple"],
  true,
);
dessert(
  "stracciatella",
  "sundaes",
  "Stracciatella Becher",
  "Stracciatella Sundae",
  850,
  3,
  ["Schokoladenguss", "Sahne"],
  ["chocolate sauce", "whipped cream"],
  true,
);
dessert(
  "haselnuss",
  "sundaes",
  "Haselnuss Becher",
  "Hazelnut Sundae",
  890,
  3,
  ["Haselnusseis", "Sahne", "Haselnusskerne", "Haselnusssauce"],
  ["hazelnut ice cream", "whipped cream", "hazelnuts", "hazelnut sauce"],
  true,
);
dessert(
  "erdbeer",
  "fruit",
  "Erdbeere Becher",
  "Strawberry Sundae",
  950,
  3,
  ["frische Erdbeeren", "Sahne", "Erdbeersauce"],
  ["fresh strawberries", "whipped cream", "strawberry sauce"],
  true,
);
dessert(
  "schoko",
  "sundaes",
  "Schoko Becher",
  "Chocolate Sundae",
  850,
  3,
  ["Schokosauce", "Schokoraspel", "Sahne"],
  ["chocolate sauce", "chocolate shavings", "whipped cream"],
  true,
);
dessert(
  "banane",
  "fruit",
  "Banane Becher",
  "Banana Sundae",
  850,
  3,
  ["frische Banane", "Nutellasauce", "Sahne"],
  ["fresh banana", "Nutella sauce", "whipped cream"],
  true,
);
dessert(
  "walnuss",
  "sundaes",
  "Walnuss Becher",
  "Walnut Sundae",
  890,
  3,
  ["Walnusskerne", "Sahne", "Walnusssauce"],
  ["walnuts", "whipped cream", "walnut sauce"],
);
dessert(
  "krokant",
  "sundaes",
  "Krokant Becher",
  "Brittle Sundae",
  890,
  3,
  ["Krokant", "Sahne", "Karamellsauce"],
  ["brittle", "whipped cream", "caramel sauce"],
);
dessert(
  "klein",
  "fruit",
  "Klein Eis Becher",
  "Small Ice Cream Sundae",
  950,
  2,
  ["gemischtes Obst", "Sahne", "Erdbeersauce"],
  ["mixed fruit", "whipped cream", "strawberry sauce"],
);
dessert(
  "pfirsich",
  "fruit",
  "Pfirsich Becher",
  "Peach Sundae",
  890,
  3,
  ["frische Pfirsiche", "Sahne", "Fruchtsauce"],
  ["fresh peaches", "whipped cream", "fruit sauce"],
);
dessert(
  "melone",
  "fruit",
  "Melone Becher",
  "Melon Sundae",
  1350,
  2,
  ["½ Melone", "frische Früchte", "Sahne", "Erdbeersauce"],
  ["½ melon", "fresh fruit", "whipped cream", "strawberry sauce"],
);
dessert(
  "erdbeeren-sahne",
  "fruit",
  "Erdbeeren mit Sahne",
  "Strawberries & Cream",
  850,
  null,
  ["frische Erdbeeren", "Sahne", "Erdbeersauce"],
  ["fresh strawberries", "whipped cream", "strawberry sauce"],
);
dessert(
  "mexico",
  "fruit",
  "Mexico Becher",
  "Mexico Sundae",
  1350,
  3,
  ["gemischtes Obst", "Sahne", "Erdbeersauce"],
  ["mixed fruit", "whipped cream", "strawberry sauce"],
);
dessert(
  "kiwi",
  "fruit",
  "Kiwi Becher",
  "Kiwi Sundae",
  860,
  3,
  ["frische Kiwi", "Sahne", "Kiwisauce"],
  ["fresh kiwi", "whipped cream", "kiwi sauce"],
);
dessert(
  "raffaello",
  "sundaes",
  "Raffaello Becher",
  "Raffaello Sundae",
  950,
  3,
  ["Raffaelloeis", "Raffaellokugeln", "Raffaellosauce", "Sahne"],
  [
    "Raffaello ice cream",
    "Raffaello sweets",
    "Raffaello sauce",
    "whipped cream",
  ],
);
dessert(
  "himbeere",
  "fruit",
  "Himbeere Becher",
  "Raspberry Sundae",
  1090,
  3,
  ["frische Himbeeren", "Sahne", "Himbeersauce"],
  ["fresh raspberries", "whipped cream", "raspberry sauce"],
);
dessert(
  "heidelbeere",
  "fruit",
  "Heidelbeere Becher",
  "Blueberry Sundae",
  950,
  3,
  ["frische Heidelbeeren", "Sahne", "Sauce"],
  ["fresh blueberries", "whipped cream", "sauce"],
);
dessert(
  "amarena",
  "fruit",
  "Amarena Becher",
  "Amarena Cherry Sundae",
  890,
  3,
  ["Amarenakirschen", "Amarenasauce", "Sahne"],
  ["Amarena cherries", "Amarena sauce", "whipped cream"],
);
dessert(
  "bounty",
  "sundaes",
  "Bounty Becher",
  "Bounty Sundae",
  890,
  3,
  ["Bounty", "Kokosraspeln", "Sahne", "Kinderschokoladensauce"],
  ["Bounty", "shredded coconut", "whipped cream", "Kinder chocolate sauce"],
);
add(
  "orangen-flip",
  "sundaes",
  "Orangen Flip",
  "Orange Float",
  790,
  "1 Kugel Vanilleeis, Orangensaft, Sahne, Kiwisauce",
  "1 scoop of vanilla ice cream, orange juice, whipped cream, kiwi sauce",
  {
    servingSize: { de: "1 Kugel Eis", en: "1 scoop of ice cream" },
    ingredients: {
      de: ["Vanilleeis", "Orangensaft", "Sahne", "Kiwisauce"],
      en: ["vanilla ice cream", "orange juice", "whipped cream", "kiwi sauce"],
    },
  },
);
dessert(
  "banana-split",
  "fruit",
  "Banana Split",
  "Banana Split",
  950,
  3,
  ["Sahne", "Obst", "Erdbeersauce"],
  ["whipped cream", "fruit", "strawberry sauce"],
);
dessert(
  "ferrero",
  "sundaes",
  "Ferrero Becher",
  "Ferrero Sundae",
  950,
  3,
  ["Ferrero Rocher", "Sahne", "Schokoladensauce"],
  ["Ferrero Rocher", "whipped cream", "chocolate sauce"],
);
dessert(
  "donat",
  "fruit",
  "Donat Becher",
  "Donat Sundae",
  1190,
  3,
  ["gemischtes Obst", "Sahne", "Erdbeersauce"],
  ["mixed fruit", "whipped cream", "strawberry sauce"],
);
dessert(
  "kinder-bueno",
  "sundaes",
  "Kinder Bueno Becher",
  "Kinder Bueno Sundae",
  950,
  3,
  ["Kinder Bueno", "Sahne", "Kinderschokoladensauce"],
  ["Kinder Bueno", "whipped cream", "Kinder chocolate sauce"],
);
dessert(
  "oreo",
  "sundaes",
  "Oreo Becher",
  "Oreo Sundae",
  950,
  2,
  ["Oreo-Kekse", "Sahne", "Schokoladensauce"],
  ["Oreo cookies", "whipped cream", "chocolate sauce"],
);
dessert(
  "vier-kugeln",
  "sundaes",
  "4 Kugeln mit Sahne",
  "4 Scoops & Cream",
  800,
  4,
  ["Sahne", "Erdbeersauce"],
  ["whipped cream", "strawberry sauce"],
);
dessert(
  "obstsalat",
  "fruit",
  "Obstsalat",
  "Fruit Salad",
  890,
  null,
  ["frisches Obst", "Sahne", "Erdbeersauce"],
  ["fresh fruit", "whipped cream", "strawberry sauce"],
);
add(
  "eiskaffee",
  "cold",
  "Eiskaffee",
  "Iced Coffee with Ice Cream",
  690,
  "2 Kugeln Eis, Kaffee, Sahne",
  "2 scoops of ice cream, coffee, whipped cream",
  {
    servingSize: { de: "2 Kugeln Eis", en: "2 scoops of ice cream" },
    ingredients: {
      de: ["Eis", "Kaffee", "Sahne"],
      en: ["ice cream", "coffee", "whipped cream"],
    },
  },
);
add("milkshake", "shakes", "Milkshake", "Milkshake", 690);
add(
  "schneemann",
  "kids",
  "Schneemann",
  "Snowman",
  650,
  "1 Kugel Vanilleeis, 1 Kugel Zitroneneis, Deko",
  "1 scoop of vanilla ice cream, 1 scoop of lemon ice cream, decorations",
  {
    servingSize: { de: "2 Kugeln Eis", en: "2 scoops of ice cream" },
    ingredients: {
      de: ["Vanilleeis", "Zitroneneis", "Deko"],
      en: ["vanilla ice cream", "lemon ice cream", "decorations"],
    },
  },
);
add(
  "micky-maus",
  "kids",
  "Micky Maus",
  "Micky Mouse",
  650,
  "1 Kugel Vanilleeis, 1 Kugel Schokoeis, Deko",
  "1 scoop of vanilla ice cream, 1 scoop of chocolate ice cream, decorations",
  {
    servingSize: { de: "2 Kugeln Eis", en: "2 scoops of ice cream" },
    ingredients: {
      de: ["Vanilleeis", "Schokoeis", "Deko"],
      en: ["vanilla ice cream", "chocolate ice cream", "decorations"],
    },
  },
);
type Flavour = [string, string, string, string[], string[]?];
const milkFlavours: Flavour[] = [
  ["vanille", "Vanille", "Vanilla", ["1"]],
  ["schokolade", "Schokolade", "Chocolate", ["1"]],
  ["nuss", "Nuss", "Nut", ["1", "5"]],
  ["caffe-mokka", "Caffè Mokka", "Mocha Coffee", ["1"]],
  ["stracciatella", "Stracciatella", "Stracciatella", ["1", "3"]],
  ["joghurt-waldbeere", "Joghurt-Waldbeere", "Yoghurt & Forest Berries", ["1"]],
  ["cookies", "Cookies", "Cookies", ["1", "2", "3", "4", "5", "6"], ["1"]],
  ["don-vito", "Don Vito", "Don Vito", ["1", "2", "3", "4", "5", "6"], ["1"]],
  ["amarena-kirsch", "Amarena-Kirsch", "Amarena Cherry", ["1"], ["1"]],
  ["pistazie", "Pistazie", "Pistachio", ["1", "2", "5", "6"], ["1"]],
  ["raffaello", "Raffaello", "Raffaello", ["1"]],
  ["giotto", "Giotto", "Giotto", []],
  ["oreo", "Oreo", "Oreo", []],
  ["tiramisu", "Tiramisu", "Tiramisu", []],
  ["pfefferminz", "Pfefferminz", "Peppermint", []],
  ["walnuss", "Walnuss", "Walnut", []],
  ["snickers", "Snickers", "Snickers", []],
];
const fruitFlavours: Flavour[] = [
  ["zitrone", "Zitrone", "Lemon", []],
  ["erdbeer", "Erdbeer", "Strawberry", []],
  ["banane", "Banane", "Banana", ["1"]],
  ["himbeer", "Himbeer", "Raspberry", []],
  ["mango", "Mango", "Mango", []],
  ["melone", "Melone", "Melon", []],
];
for (const [flavourType, flavours] of [
  ["milk", milkFlavours],
  ["fruit", fruitFlavours],
] as const) {
  for (const [id, de, en, allergenCodes, additiveCodes = []] of flavours)
    add(`flavour-${id}`, "flavours", de, en, 200, "", "", {
      flavourType,
      allergenCodes,
      additiveCodes,
      servingSize: { de: "1 Kugel", en: "1 scoop" },
    });
}
for (const [id, de, en, price] of [
  ["espresso", "Espresso", "Espresso", 290],
  ["espresso-macchiato", "Espresso Macchiato", "Espresso Macchiato", 290],
  ["kaffee", "Tasse Kaffee", "Cup of Coffee", 340],
  ["doppelter-espresso", "Doppelter Espresso", "Double Espresso", 420],
  [
    "cappuccino-sahne",
    "Cappuccino (mit Sahne)",
    "Cappuccino (with cream)",
    390,
  ],
  ["latte-macchiato", "Latte Macchiato", "Latte Macchiato", 420],
  [
    "cappuccino-italiano",
    "Cappuccino Italiano (mit Milch)",
    "Italian Cappuccino (with milk)",
    390,
  ],
  ["warme-milch", "Warme Milch", "Warm Milk", 350],
  ["warmer-kakao", "Warmer Kakao", "Hot Chocolate", 390],
  ["kakao-sahne", "Kakao mit Sahne", "Hot Chocolate with Cream", 450],
  ["tee", "Tee", "Tea", 350],
] as const)
  add(id, "hot", de, en, price);
for (const [id, de, en, price, volume] of [
  ["zitronensaft", "Zitronensaft (frisch)", "Fresh Lemon Juice", 350, "0.20 L"],
  ["orangensaft", "Orangensaft (frisch)", "Fresh Orange Juice", 590, "0.20 L"],
  ["coca-cola", "Coca-Cola", "Coca-Cola", 300, "0.20 L"],
  ["coca-cola-light", "Coca-Cola Light", "Diet Coke", 300, "0.20 L"],
  ["coca-cola-zero", "Coca-Cola Zero", "Coca-Cola Zero", 300, "0.20 L"],
  ["fanta", "Fanta", "Fanta", 300, "0.20 L"],
  ["sprite", "Sprite", "Sprite", 300, "0.20 L"],
  ["mezzomix", "Mezzo Mix", "Mezzo Mix", 300, "0.20 L"],
  [
    "ice-tea",
    "Ice Tea (div. Sorten)",
    "Iced Tea (various varieties)",
    300,
    "0.20 L",
  ],
  ["bitter-lemon", "Bitter Lemon", "Bitter Lemon", 300, "0.20 L"],
  ["tonic", "Tonic Water", "Tonic Water", 300, "0.20 L"],
  [
    "apollinaris",
    "Apollinaris Selection",
    "Apollinaris Selection",
    270,
    "0.25 L",
  ],
  [
    "apfelschorle",
    "Apollinaris Apfelschorle",
    "Apollinaris Apple Spritzer",
    300,
    "0.25 L",
  ],
  [
    "stilles-wasser",
    "Apollinaris Vio Stilles",
    "Apollinaris Vio Still Water",
    270,
    "0.25 L",
  ],
  ["redbull", "Redbull", "Red Bull", 350, ""],
] as const)
  add(
    id,
    "cold",
    de,
    en,
    price,
    "",
    "",
    volume ? { servingSize: { de: volume.replace(".", ","), en: volume } } : {},
  );
for (const [id, de, en, price, volume] of [
  [
    "granini-orange",
    "Granini Orangensaft",
    "Granini Orange Juice",
    300,
    "0.20 L",
  ],
  ["granini-apfel", "Granini Apfelsaft", "Granini Apple Juice", 300, "0.20 L"],
  [
    "granini-kirsch",
    "Granini Kirschsaft",
    "Granini Cherry Juice",
    300,
    "0.20 L",
  ],
  ["limonade", "Frische Limonade", "Fresh Lemonade", 250, ""],
  ["kirschsaft", "Kirschsaft", "Cherry Juice", 300, "0.20 L"],
] as const)
  add(
    id,
    "juices",
    de,
    en,
    price,
    "",
    "",
    volume ? { servingSize: { de: volume.replace(".", ","), en: volume } } : {},
  );
const photographGroups: [string, string[]][] = [
  [
    "codex-clipboard-f0931005-5015-43ec-99be-e546f03e25cc.jpg",
    ["ananas", "stracciatella", "haselnuss", "walnuss", "krokant"],
  ],
  [
    "codex-clipboard-28eb47ee-90af-4598-b44d-dd2736459d4f.jpg",
    ["erdbeer", "klein", "pfirsich", "melone", "erdbeeren-sahne", "mexico"],
  ],
  [
    "codex-clipboard-0e02d946-bff2-4e0f-9ad7-619d378abd04.jpg",
    [
      "kiwi",
      "raffaello",
      "himbeere",
      "heidelbeere",
      "schoko",
      "amarena",
      "banane",
    ],
  ],
  [
    "codex-clipboard-ef8d4cf2-5c83-4697-8538-24cd1452f5fe.jpg",
    [
      "bounty",
      "orangen-flip",
      "banana-split",
      "ferrero",
      "donat",
      "kinder-bueno",
    ],
  ],
  [
    "codex-clipboard-498af504-2a30-4553-a4d3-4fac1ea52e8e.jpg",
    ["oreo", "vier-kugeln", "obstsalat", "eiskaffee", "milkshake"],
  ],
  [
    "codex-clipboard-48ad279d-41e7-4d60-829a-ae791f5f4f0a.jpg",
    ["schneemann", "micky-maus"],
  ],
];
const photographedIds = new Set(photographGroups.flatMap(([, ids]) => ids));
export const menu: MenuItem[] = items.map((item) => ({
  ...item,
  source:
    photographGroups.find(([, ids]) => ids.includes(item.id))?.[0] ??
    (item.categoryId === "cold" && item.id !== "redbull"
      ? "codex-clipboard-48ad279d-41e7-4d60-829a-ae791f5f4f0a.jpg"
      : "codex-clipboard-dc5ad23b-72df-4ba0-bbcd-82fbca9a2754.jpg"),
  ...(photographedIds.has(item.id)
    ? {
        image: "/images/" + item.id + ".webp",
        imageAlt: {
          de: item.name.de + " – Dessertpräsentation",
          en: item.name.en + " – dessert presentation",
        },
      }
    : {}),
}));
