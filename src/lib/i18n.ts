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
};

export type Strings = typeof HE;

export function strings(lang: Lang): Strings {
  return lang === "he" ? HE : EN;
}

export function detectLang(sample: string): Lang {
  return /[֐-׿]/.test(sample) ? "he" : "en";
}
