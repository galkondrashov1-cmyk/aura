import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Config (not file-based) icons, so a Pro page can swap in its own.
  icons: { icon: { url: "/icon.png", sizes: "64x64", type: "image/png" }, apple: "/apple-icon.png" },
  title: "AURA — Create your aura",
  description:
    "The most beautiful way to build a personal landing page. Stunning, premium mini-sites in minutes — no code.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "AURA" },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
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
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
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
