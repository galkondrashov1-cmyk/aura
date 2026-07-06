import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "הילה — ההילה של העסק שלך",
    template: "%s · הילה",
  },
  description:
    "הילה: אתר מעוצב לעסק שלך בדקות — עמוד נחיתה בחינם, ערימות של אפשרויות עיצוב, וזימון תורים ופגישות אונליין.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
