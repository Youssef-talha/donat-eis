import "./globals.css";
export default function NotFound() {
  return (
    <html lang="de">
      <body>
        <main className="not-found">
          <p className="eyebrow">DONAT EIS</p>
          <h1>Hier ist das Eis schon weg.</h1>
          <p>This page could not be found.</p>
          <a className="primary-button" href="/de/menu/">
            Zur Speisekarte · View menu
          </a>
        </main>
      </body>
    </html>
  );
}
