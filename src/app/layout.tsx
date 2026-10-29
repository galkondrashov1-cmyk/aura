import { BRAND } from "@/lib/brand";
import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Hebrew-first type: Frank Ruhl Libre (the classic Israeli newspaper serif)
// for headlines, Heebo for everything else. Both cover Latin.
const body = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-body", display: "swap" });
const display = Frank_Ruhl_Libre({ subsets: ["hebrew", "latin"], variable: "--font-head", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Config (not file-based) icons, so a Pro page can swap in its own.
  icons: { icon: { url: "/icon.png", sizes: "64x64", type: "image/png" }, apple: "/apple-icon.png" },
  title: `${BRAND.name} — עמוד נחיתה שלא דומה לאף אחד אחר`,
  description: "הדרך היפה ביותר לבנות עמוד נחיתה אישי: מיני־אתרים מעוצבים ומרשימים בכמה דקות, בלי קוד.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: BRAND.name },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
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
    <html lang="he" dir="rtl" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
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
