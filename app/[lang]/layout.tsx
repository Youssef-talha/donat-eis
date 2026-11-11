import "../globals.css";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return [{ lang: "de" }, { lang: "en" }];
}
export const dynamicParams = false;
export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "de" && lang !== "en") notFound();
  return (
    <html lang={lang} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
