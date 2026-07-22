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
        {/* First-paint splash. Created AND removed entirely by this inline
            script so the node never exists in React's tree — a React-rendered
            splash that the script later removes breaks hydration on slow
            loads (React finds DOM that doesn't match the server HTML and
            falls back to a full client re-render with an error flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.createElement("div");d.id="aura-splash";d.setAttribute("aria-hidden","true");d.innerHTML='<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="1.5" opacity="0.3"/><circle cx="24" cy="24" r="13" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="24" cy="24" r="6.5" stroke="currentColor" stroke-width="1.5"/><circle cx="24" cy="24" r="2.5" fill="currentColor"/></svg><span class="splash-word">AURA</span>';document.body.appendChild(d);var t=Date.now(),done=false;function hide(){if(done)return;done=true;var w=Math.max(0,450-(Date.now()-t));setTimeout(function(){d.classList.add("done");setTimeout(function(){d.remove()},500)},w)}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",hide);else hide();setTimeout(hide,2500)}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
