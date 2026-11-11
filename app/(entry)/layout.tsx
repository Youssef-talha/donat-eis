import type { Metadata } from "next";
import "../globals.css";
export const metadata: Metadata = {
  title: "Donat Eis",
  description: "Eisgenuss seit 1978 · Ice cream since 1978",
};
export default function EntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
