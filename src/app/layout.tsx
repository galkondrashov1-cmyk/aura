import { BRAND } from "@/lib/brand";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// One family for the whole product: IBM Plex Sans Hebrew (Hebrew by Liron
// Lavi Turkenich). Headlines are the same face, heavier, so the UI reads as
// one voice. Covers Latin too.
const plex = IBM_Plex_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Config (not file-based) icons, so a Pro page can swap in its own.
  icons: { icon: { url: "/icon.png", sizes: "64x64", type: "image/png" }, apple: "/apple-icon.png" },
  title: `${BRAND.name} — עמוד נחיתה שלא דומה לאף אחד אחר`,
  description: "הדרך היפה ביותר לבנות עמוד נחיתה אישי: מיני־אתרים מעוצבים ומרשימים בכמה דקות, בלי קוד.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: BRAND.name },
};

export const viewport: Viewport = {
  themeColor: "#141312",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: browser extensions / dark-mode tools (and dev
    // proxies) inject attributes onto <html> before React hydrates, which would
    // otherwise surface a harmless attribute-mismatch warning. This only relaxes
    // the check for <html>'s own attributes, not the rest of the tree.
    <html lang="he" dir="rtl" className={plex.variable} suppressHydrationWarning>
      {/* The PWA launch splash is pure CSS (body::before/::after, installed
          app only — see globals.css). It used to be a <div> injected by an
          inline script, which landed in <body> ahead of React's streamed
          markup and made hydration fail on every single page load. */}
      <body className="min-h-screen bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
