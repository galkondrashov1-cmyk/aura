// Visitor-facing strings on public pages. Hebrew pages (detected from their
// own content) get Hebrew UI text; everything else stays English.
export type Lang = "en" | "he";

const HE = {
  spoiler: "ספוילר — הקישו לחשיפה",
  popular: "הכי פופולרי",
  maps: "מפות",
  watch: "לצפייה בסרטון",
  name: "שם מלא",
  email: "you@email.com",
  message: "ההודעה שלכם",
  join: "הצטרפות",
  send: "שליחה",
  thanks: "תודה! קיבלנו 🙌",
  preview: "תצוגה מקדימה: בעמוד החי זה נשלח לתיבת ההודעות שלכם.",
  days: "ימים",
  hours: "שעות",
  min: "דק׳",
  sec: "שנ׳",
  done: "הגיע הזמן! 🎉",
  dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
  openNow: "פתוח עכשיו",
  closedNow: "סגור עכשיו",
  closesAt: "עד",
  opensAt: "נפתח ב־",
  opensTomorrow: "נפתח מחר ב־",
  opensOn: "נפתח ביום",
  closed: "סגור",
  saveContact: "שמירת איש קשר",
  call: "חיוג",
};

const EN: typeof HE = {
  spoiler: "Spoiler — tap to reveal",
  popular: "Most popular",
  maps: "Maps",
  watch: "Watch video",
  name: "Your name",
  email: "you@email.com",
  message: "Your message",
  join: "Join",
  send: "Send message",
  thanks: "Thanks — you're in!",
  preview: "Preview: on your live page this sends to your Inbox.",
  days: "Days",
  hours: "Hours",
  min: "Min",
  sec: "Sec",
  done: "It's time! 🎉",
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  openNow: "Open now",
  closedNow: "Closed now",
  closesAt: "until",
  opensAt: "Opens at",
  opensTomorrow: "Opens tomorrow at",
  opensOn: "Opens",
  closed: "Closed",
  saveContact: "Save contact",
  call: "Call",
};

export type Strings = typeof HE;

export function strings(lang: Lang): Strings {
  return lang === "he" ? HE : EN;
}

export function detectLang(sample: string): Lang {
  return /[֐-׿]/.test(sample) ? "he" : "en";
}
