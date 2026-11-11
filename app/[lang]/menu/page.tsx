import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MenuBrowser from "@/components/menu-browser";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  const base = origin ? new URL(origin) : undefined;
  return {
    title:
      lang === "en" ? "Our Menu | Donat Eis" : "Unsere Speisekarte | Donat Eis",
    description:
      lang === "en"
        ? "Discover our ice cream sundaes, fruit desserts, milkshakes and drinks. Ice cream since 1978."
        : "Entdecken Sie unsere Eisbecher, Fruchtkreationen, Milchshakes und Getränke. Eisgenuss seit 1978.",
    ...(base
      ? {
          metadataBase: base,
          alternates: {
            canonical: `/${lang}/menu/`,
            languages: {
              de: "/de/menu/",
              en: "/en/menu/",
              "x-default": "/de/menu/",
            },
          },
        }
      : {}),
    openGraph: {
      locale: lang === "en" ? "en_GB" : "de_DE",
      siteName: "Donat Eis",
      type: "website",
    },
  };
}
export default async function MenuPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "de" && lang !== "en") notFound();
  return <MenuBrowser locale={lang} />;
}
