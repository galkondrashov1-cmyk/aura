// Starter templates — complete pages (blocks + a full design) that show off
// what the studio can do. Every piece stays editable; content is placeholder
// copy the creator overwrites. createPage() fits the result to the user's plan.
import type { Block, PageContent, PageDesign } from "@/lib/blocks";
import type { Plan } from "@/lib/plans";

export type Template = {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Suggested page address for additional pages. */
  slug: string;
  tier: Plan;
};

export const TEMPLATES: Template[] = [
  { id: "creator", name: "יוצרים", category: "Creators", description: "רשת ניאון, כתיבה מונפשת, מספרים וניוזלטר", slug: "links", tier: "PLUS" },
  { id: "portfolio", name: "תיק עבודות", category: "Freelancers", description: "מסך מפוצל, סריף מגזיני ורקע נוזלי", slug: "work", tier: "PRO" },
  { id: "coach", name: "מאמן/ת", category: "Services", description: "שירותים, המלצות, מחירון וכפתור וואטסאפ", slug: "coaching", tier: "PLUS" },
  { id: "cafe", name: "בית קפה", category: "Local business", description: "ערכה בהירה וחמה, שער, מפה ושעות פתיחה", slug: "visit", tier: "PLUS" },
  { id: "musician", name: "מוזיקאים", category: "Creators", description: "טיפוגרפיית פוסטר, מסע בחלל וספירה להופעה", slug: "music", tier: "PRO" },
  { id: "launch", name: "השקה", category: "Events", description: "כרטיס צף, כותרת מותכת, קונפטי ורשימת המתנה", slug: "launch", tier: "PRO" },
  { id: "hebrew", name: "סטודיו לעיצוב", category: "Local business", description: "עמוד עסקי עם מחירון בשקלים", slug: "studio", tier: "PLUS" },
  { id: "classic", name: "קלאסי", category: "Everyone", description: "הלינק־בביו הנצחי, בביצוע מושלם", slug: "links", tier: "FREE" },
  { id: "minimal", name: "מינימלי", category: "Everyone", description: "מונוכרום, חד ושקט", slug: "about", tier: "FREE" },
];

const id = () => crypto.randomUUID();

type Recipe = { design: PageDesign; blocks: Omit<Block, "id">[] };

const RECIPES: Record<string, () => Recipe> = {
  creator: () => ({
    design: {
      accent: "#F472B6",
      bgCustom: { type: "mesh", colors: ["#5b21b6", "#9d174d", "#1e1b4b"], angle: 150 },
      bgAnimate: true,
      bgFx: "grain",
      titleFx: "aurora",
      font: "heebo",
      headingFont: "rubik",
      headingWeight: "bold",
      card: "glass-frost",
      buttonShape: "pill",
      buttonFx: "growglow",
      reveal: "rise",
      spacing: "cozy",
    },
    blocks: [
      { type: "hero", name: "השם שלכם", tagline: "היי, אני", words: ["יוצר/ת", "מספר/ת סיפורים", "הערוץ האהוב הבא שלכם"], badge: "סרטון חדש בכל שישי", layout: "center" },
      { type: "socials", iconStyle: "brand", items: [
        { platform: "instagram", url: "https://instagram.com/" },
        { platform: "tiktok", url: "https://tiktok.com/" },
        { platform: "youtube", url: "https://youtube.com/" },
      ] },
      { type: "links", layout: "list", items: [
        { label: "לסרטון האחרון שלי", url: "https://youtube.com/", highlighted: true, icon: "auto" },
        { label: "המוצרים שאני אוהב/ת", sub: "ציוד שאני באמת משתמש/ת בו", url: "https://", icon: "🛍️" },
        { label: "לעבוד איתי", sub: "שיתופי פעולה ומותגים", url: "mailto:hello@example.com", icon: "auto" },
      ] },
      { type: "stats", items: [
        { value: "120K", label: "עוקבים" },
        { value: "4.8M", label: "צפיות" },
        { value: "300+", label: "סרטונים" },
      ] },
      { type: "marquee", text: "פתוח/ה לשיתופי פעולה — בואו ניצור משהו", style: "band", speed: "normal" },
      { type: "form", kind: "newsletter", heading: "העדכון השבועי", text: "מייל אחד בכל שישי. מאחורי הקלעים וגישה מוקדמת.", button: "הצטרפות" },
    ],
  }),

  portfolio: () => ({
    design: {
      layout: "split",
      accent: "#A78BFA",
      bgCustom: { type: "mesh", colors: ["#312e81", "#4c1d95", "#0f172a"], angle: 150 },
      liveBg: "liquid",
      titleFx: "holo",
      font: "heebo",
      headingFont: "frankruhl",
      headingWeight: "normal",
      headingTracking: "tight",
      card: "glass-soft",
      buttonShape: "rounded",
      buttonFx: "lift",
      section: "glass",
      reveal: "blur",
      contentWidth: "wide",
    },
    blocks: [
      { type: "hero", name: "השם שלכם", tagline: "מעצב/ת עצמאי/ת למותגים, אתרים ותנועה.", badge: "פנוי/ה לפרילנס", layout: "split" },
      { type: "text", heading: "קצת עליי", body: "עשר שנים של הפיכת רעיונות מעורפלים למותגים ברורים שזוכרים. עובד/ת עם יזמים שאכפת להם מהפרטים בדיוק כמו לי.", align: "left" },
      { type: "features", heading: "מה אני עושה", cols: 2, items: [
        { icon: "✦", title: "זהות מותג", text: "לוגו, טיפוגרפיה ומערכות צבע שגדלות איתכם." },
        { icon: "◐", title: "עיצוב אתרים", text: "אתרים מהירים ויפים שממירים." },
        { icon: "▶", title: "תנועה", text: "סרטוני השקה ומיקרו־אינטראקציות." },
        { icon: "◇", title: "ארט דירקשן", text: "קמפיינים וצילומים עם נקודת מבט." },
      ] },
      { type: "testimonials", heading: "מילים טובות", layout: "carousel", items: [
        { quote: "השותף הקריאייטיבי הכי טוב שהיה לנו. ההשקה הכפילה את ההרשמות.", name: "דנה כהן", role: "מייסדת, Lumen", rating: 5 },
        { quote: "מהיר/ה, מדויק/ת ומוכשר/ת באמת. כבר הזמנו שוב.", name: "עומר לוי", role: "סמנכ״ל שיווק, Northwind", rating: 5 },
      ] },
      { type: "links", layout: "cards", items: [
        { label: "עבודות נבחרות", sub: "סיפורי מקרה", url: "https://dribbble.com/", icon: "auto" },
        { label: "Behance", sub: "תיק העבודות המלא", url: "https://behance.net/", icon: "auto" },
        { label: "הורדת קורות חיים", sub: "PDF · שני עמודים", url: "https://", icon: "📄" },
      ] },
      { type: "form", kind: "contact", heading: "מתחילים פרויקט", text: "ספרו לי קצת — אני עונה תוך יום.", button: "שליחה" },
    ],
  }),

  coach: () => ({
    design: {
      accent: "#4ADE80",
      bgCustom: { type: "radial", colors: ["#14532d", "#052e16", "#020617"], angle: 150 },
      bgFx: "topglow",
      titleFx: "gradient",
      font: "assistant",
      headingFont: "rubik",
      headingWeight: "semibold",
      card: "glass-soft",
      buttonShape: "rounded",
      buttonFx: "magnetic",
      section: "glass",
      reveal: "rise",
      fab: { kind: "whatsapp", value: "+972500000000", label: "צ׳אט" },
    },
    blocks: [
      { type: "hero", name: "השם שלכם", tagline: "אימוני כוח אונליין לאנשים עסוקים.", badge: "נשארו 3 מקומות החודש", layout: "center" },
      { type: "links", items: [
        { label: "שיחת היכרות חינם", url: "https://cal.com/", highlighted: true, icon: "📅" },
        { label: "לצפייה באימון לדוגמה", url: "https://youtube.com/", icon: "auto" },
      ] },
      { type: "features", heading: "איך זה עובד", cols: 2, items: [
        { icon: "🏋️", title: "תוכנית אישית", text: "בנויה סביב הלו״ז והציוד שלכם." },
        { icon: "📱", title: "צ׳ק־אין יומי", text: "מחויבות בלי רגשות אשם." },
        { icon: "🥗", title: "תזונה פשוטה", text: "בלי דיאטות מטורפות. אוכל אמיתי." },
        { icon: "📈", title: "תוצאות אמיתיות", text: "מעקב התקדמות כל שבוע." },
      ] },
      { type: "testimonials", heading: "הצלחות של מתאמנים", items: [
        { quote: "ירדתי 9 ק״ג ואני סוף סוף נהנית מהאימונים. שינוי חיים.", name: "נועה", role: "מתאמנת מ־2024", rating: 5 },
        { quote: "שלושה אימונים בשבוע מהבית. אף פעם לא הייתי חזק כל כך.", name: "דניאל", role: "מתאמן מ־2023", rating: 5 },
      ] },
      { type: "pricing", heading: "מסלולי אימון", items: [
        { name: "מתחילים", price: "$69", period: "/חודש", features: "תוכנית אימונים אישית\nפגישת מעקב חודשית\nגישה לאפליקציה", cta: "להתחיל עכשיו", url: "https://" },
        { name: "ליווי אישי 1:1", price: "$149", period: "/חודש", features: "כל מה שיש במתחילים\nשיחת וידאו שבועית\nהכוונה תזונתית\nתמיכה בוואטסאפ", cta: "להגשת מועמדות", url: "https://", featured: true },
      ] },
      { type: "faq", items: [
        { question: "צריך חדר כושר?", answer: "ממש לא — רוב המתאמנים מתאמנים בבית עם מעט ציוד." },
        { question: "אפשר לבטל בכל זמן?", answer: "כן. בלי חוזים ובלי עמלות נסתרות." },
      ] },
    ],
  }),

  cafe: () => ({
    design: {
      accent: "#B45309",
      bgCustom: { type: "linear", colors: ["#fdf6ec", "#f1e4cf"], angle: 160 },
      titleFx: "none",
      font: "assistant",
      headingFont: "frankruhl",
      headingWeight: "semibold",
      card: "solid-surface",
      buttonShape: "soft",
      buttonFx: "lift",
      section: "solid",
      reveal: "fade",
      fab: { kind: "phone", value: "+972300000000" },
    },
    blocks: [
      { type: "hero", name: "קפה טקס הבוקר", tagline: "קפה ספשלטי · מאפים שנאפים עם שחר", badge: "פתוח עכשיו", layout: "cover" },
      { type: "links", layout: "cards", items: [
        { label: "הזמנה לאיסוף", sub: "מוכן תוך 10 דקות", url: "https://", icon: "🥡" },
        { label: "הזמנת שולחן", sub: "בסופי שבוע מתמלא מהר", url: "https://", icon: "🪑" },
        { label: "לתפריט", url: "https://", icon: "📖" },
      ] },
      { type: "features", cols: 2, items: [
        { icon: "☕", title: "קפה ממקור יחיד" },
        { icon: "🥐", title: "נאפה כל יום" },
        { icon: "🌱", title: "אפשרויות טבעוניות" },
        { icon: "📶", title: "Wi‑Fi חינם" },
      ] },
      { type: "text", heading: "שעות פתיחה", body: "א׳–ה׳ · 7:00–19:00\nו׳ · 7:00–15:00\nשבת · 9:00–18:00", align: "center" },
      { type: "map", query: "שדרות רוטשילד 1, תל אביב", height: "md" },
      { type: "socials", iconStyle: "chip", items: [
        { platform: "instagram", url: "https://instagram.com/" },
        { platform: "whatsapp", url: "https://wa.me/" },
      ] },
    ],
  }),

  musician: () => ({
    design: {
      accent: "#22D3EE",
      bgCustom: { type: "linear", colors: ["#0b0118", "#1e0b3b"], angle: 170 },
      liveBg: "warp",
      titleFx: "neon",
      font: "rubik",
      headingFont: "karantina",
      headingCase: "upper",
      headingTracking: "wide",
      card: "neon-cyber",
      buttonShape: "sharp",
      buttonFx: "neonflicker",
      reveal: "slide",
      cursor: "trail",
    },
    blocks: [
      { type: "hero", name: "השם שלכם", tagline: "DJ · מפיק · סטים של לילה", badge: "בסיבוב הופעות הקיץ", layout: "big" },
      { type: "marquee", text: "סינגל חדש בחוץ", style: "outline", speed: "fast" },
      { type: "links", items: [
        { label: "להאזנה בספוטיפיי", url: "https://open.spotify.com/", highlighted: true, icon: "auto" },
        { label: "מיקסים בסאונדקלאוד", url: "https://soundcloud.com/", icon: "auto" },
        { label: "הזמנת הופעות", sub: "מועדונים · פסטיבלים · אירועים פרטיים", url: "mailto:booking@example.com", icon: "auto" },
      ] },
      { type: "countdown", target: "2027-06-20T22:00", label: "ההופעה הבאה מתחילה בעוד" },
      { type: "socials", iconStyle: "chip", items: [
        { platform: "instagram", url: "https://instagram.com/" },
        { platform: "tiktok", url: "https://tiktok.com/" },
        { platform: "soundcloud", url: "https://soundcloud.com/" },
      ] },
    ],
  }),

  launch: () => ({
    design: {
      layout: "card",
      accent: "#FB923C",
      bgCustom: { type: "conic", colors: ["#1c0a00", "#431407", "#0c0a09"], angle: 200 },
      liveBg: "confetti",
      titleFx: "fire",
      font: "heebo",
      headingFont: "secular",
      headingWeight: "black",
      card: "grad-sunset",
      buttonShape: "pill",
      buttonFx: "bounce",
      reveal: "zoom",
    },
    blocks: [
      { type: "hero", name: "משהו גדול", tagline: "נוחת בקרוב. תהיו הראשונים לדעת.", badge: "משיקים בקרוב", layout: "center" },
      { type: "countdown", target: "2027-01-01T10:00", label: "הדלתות נפתחות בעוד" },
      { type: "form", kind: "newsletter", heading: "הצטרפו לרשימת ההמתנה", text: "המקדימים מקבלים 40% הנחה בהשקה.", button: "עדכנו אותי" },
      { type: "stats", items: [
        { value: "2,400+", label: "ברשימה" },
        { value: "40%", label: "הנחת מקדימים" },
      ] },
      { type: "marquee", text: "מקומות מוגבלים · גישה מוקדמת · מחיר השקה", style: "tilt", speed: "normal" },
    ],
  }),

  hebrew: () => ({
    design: {
      dir: "rtl",
      accent: "#38BDF8",
      bgCustom: { type: "mesh", colors: ["#0c4a6e", "#1e3a8a", "#0f172a"], angle: 150 },
      titleFx: "gradient",
      font: "heebo",
      headingFont: "secular",
      card: "glass-frost",
      buttonShape: "rounded",
      buttonFx: "lift",
      section: "glass",
      reveal: "rise",
      fab: { kind: "whatsapp", value: "+972500000000", label: "וואטסאפ" },
    },
    blocks: [
      { type: "hero", name: "סטודיו נועה", tagline: "עיצוב פנים שמרגיש", words: ["בית", "שלכם", "בדיוק נכון"], badge: "זמינים לפרויקטים חדשים", layout: "center" },
      { type: "links", items: [
        { label: "לקביעת פגישת ייעוץ", url: "https://", highlighted: true, icon: "📅" },
        { label: "לתיק העבודות", url: "https://instagram.com/", icon: "auto" },
      ] },
      { type: "features", heading: "מה אנחנו עושים", cols: 2, items: [
        { icon: "🛋️", title: "תכנון חללים", text: "פתרונות חכמים לכל מטר" },
        { icon: "🎨", title: "קונספט וצבע", text: "פלטה שמספרת את הסיפור שלכם" },
        { icon: "🪴", title: "הלבשת בית", text: "רהיטים, טקסטיל ותאורה" },
        { icon: "🔑", title: "ליווי עד המפתח", text: "מהסקיצה ועד הכניסה" },
      ] },
      { type: "testimonials", heading: "לקוחות מספרים", items: [
        { quote: "הבית שלנו פשוט השתנה. מקצועיות ורגישות ברמה אחרת.", name: "מיכל ויונתן", role: "דירה בתל אביב", rating: 5 },
      ] },
      { type: "pricing", heading: "חבילות", items: [
        { name: "ייעוץ חד-פעמי", price: "₪650", features: "פגישה של שעתיים\nסקיצה ראשונית\nהמלצות צבע וחומרים", cta: "לתיאום", url: "https://" },
        { name: "פרויקט מלא", price: "₪180", period: "/מ״ר", features: "תכנון מלא\nהדמיות תלת-ממד\nליווי ספקים\nפיקוח עד הסוף", cta: "בואו נדבר", url: "https://", featured: true },
      ] },
      { type: "form", kind: "contact", heading: "דברו איתנו", text: "השאירו פרטים ונחזור אליכם עוד היום", button: "שליחה" },
    ],
  }),

  classic: () => ({
    design: {
      accent: "#00E5A0",
      background: "aurora-1",
      bgFx: "topglow",
      titleFx: "glow",
      font: "heebo",
      card: "glass-frost",
      buttonShape: "pill",
      buttonFx: "growglow",
      reveal: "rise",
    },
    blocks: [
      { type: "hero", name: "השם שלכם", tagline: "מה אתם עושים, בשורה אחת.", layout: "center" },
      { type: "links", items: [
        { label: "האתר שלי", url: "https://", highlighted: true, icon: "auto" },
        { label: "הפרויקט האחרון", url: "https://", icon: "✨" },
        { label: "להגיד שלום", url: "mailto:you@email.com", icon: "auto" },
      ] },
      { type: "socials", iconStyle: "plain", items: [
        { platform: "instagram", url: "https://instagram.com/" },
        { platform: "x", url: "https://x.com/" },
        { platform: "linkedin", url: "https://linkedin.com/" },
      ] },
    ],
  }),

  minimal: () => ({
    design: {
      accent: "#E5E7EB",
      background: "mono-2",
      font: "heebo",
      headingWeight: "semibold",
      headingTracking: "tight",
      card: "out-hair",
      buttonShape: "sharp",
      buttonSize: "sm",
      buttonFx: "slide",
      reveal: "fade",
      spacing: "roomy",
      textScale: "compact",
    },
    blocks: [
      { type: "hero", name: "השם שלכם", tagline: "מעצבת וכותבת. גרה איפשהו שמשי.", layout: "left" },
      { type: "divider", style: "line" },
      { type: "text", body: "יוצרת דברים שקטים ושימושיים לאינטרנט. כרגע חוקרת טיפוגרפיה, כלים ותוכנה איטית.", align: "left" },
      { type: "links", layout: "list", items: [
        { label: "כתיבה", url: "https://" },
        { label: "פרויקטים", url: "https://" },
        { label: "מייל", url: "mailto:you@email.com" },
      ] },
    ],
  }),
};

/** A fresh, ready-to-edit page. "blank" = just a header; unknown = Classic. */
export function templateContent(templateId?: string): PageContent {
  if (templateId === "blank") {
    return { design: { reveal: "rise" }, blocks: [{ id: id(), type: "hero", name: "השם שלכם", tagline: "" }] };
  }
  const recipe = (templateId && RECIPES[templateId]?.()) || RECIPES.classic();
  return {
    design: recipe.design,
    blocks: recipe.blocks.map((b) => ({ ...b, id: id() }) as Block),
  };
}
