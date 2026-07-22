import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { fontVars } from "@/lib/fonts";
import "./globals.css";

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
      <body className={`min-h-screen bg-bg text-text antialiased ${fontVars}`}>
        <div id="aura-splash" aria-hidden>
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <circle cx="24" cy="24" r="13" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <circle cx="24" cy="24" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="24" r="2.5" fill="currentColor" />
          </svg>
          <span className="splash-word">AURA</span>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=Date.now();function hide(){var s=document.getElementById("aura-splash");if(!s)return;var w=Math.max(0,450-(Date.now()-t));setTimeout(function(){s.classList.add("done");setTimeout(function(){s.remove()},500)},w)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",hide);else hide();setTimeout(hide,2500)})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
