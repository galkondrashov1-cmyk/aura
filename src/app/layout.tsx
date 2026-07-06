import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// Brand hero visual — generated with Higgsfield (a glowing golden halo in
// dark space); served from their CDN and used as the social share image.
const OG_IMAGE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3FlUfdYGRvCXgioEhTq1KAiBaEx/hf_20260706_220740_b8b3b52a-5e81-4413-851d-3ce7273e9c51.png";

export const metadata: Metadata = {
  title: {
    default: "הילה — ההילה של העסק שלך",
    template: "%s · הילה",
  },
  description:
    "לכל עסק יש אור. אנחנו שמים לו הילה: עמוד מעוצב לעסק + זימון תורים אונליין, בעברית, בשלוש דקות.",
  openGraph: {
    title: "הילה — ההילה של העסק שלך",
    description: "עמוד מהמם לעסק שלך + לקוחות שקובעים תור לבד. מתחילים בחינם.",
    locale: "he_IL",
    type: "website",
    images: [{ url: OG_IMAGE, width: 2752, height: 1536, alt: "הילה — טבעת אור זהובה" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "הילה — ההילה של העסק שלך",
    description: "עמוד מהמם לעסק שלך + לקוחות שקובעים תור לבד. מתחילים בחינם.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
