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
  { id: "creator", name: "Creator", category: "Creators", description: "Neon mesh, typewriter intro, stats & newsletter", slug: "links", tier: "PLUS" },
  { id: "portfolio", name: "Portfolio", category: "Freelancers", description: "Split screen, editorial serif, liquid WebGL", slug: "work", tier: "PRO" },
  { id: "coach", name: "Coach", category: "Services", description: "Services, reviews, pricing & WhatsApp button", slug: "coaching", tier: "PLUS" },
  { id: "cafe", name: "Café", category: "Local business", description: "Warm light theme, cover header, map & hours", slug: "visit", tier: "PLUS" },
  { id: "musician", name: "Musician", category: "Creators", description: "Poster type, hyperspace, countdown to the show", slug: "music", tier: "PRO" },
  { id: "launch", name: "Launch", category: "Events", description: "Floating card, molten title, confetti & waitlist", slug: "launch", tier: "PRO" },
  { id: "hebrew", name: "עסק בעברית", category: "Local business", description: "Right-to-left Hebrew page with pricing in ₪", slug: "studio", tier: "PLUS" },
  { id: "classic", name: "Classic", category: "Everyone", description: "The timeless link-in-bio, beautifully done", slug: "links", tier: "FREE" },
  { id: "minimal", name: "Minimal", category: "Everyone", description: "Monochrome, sharp and quiet", slug: "about", tier: "FREE" },
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
      font: "inter",
      headingFont: "syne",
      headingWeight: "bold",
      card: "glass-frost",
      buttonShape: "pill",
      buttonFx: "growglow",
      reveal: "rise",
      spacing: "cozy",
    },
    blocks: [
      { type: "hero", name: "Your Name", tagline: "Hey, I'm", words: ["a creator", "a storyteller", "your next favorite channel"], badge: "New video every Friday", layout: "center" },
      { type: "socials", iconStyle: "brand", items: [
        { platform: "instagram", url: "https://instagram.com/" },
        { platform: "tiktok", url: "https://tiktok.com/" },
        { platform: "youtube", url: "https://youtube.com/" },
      ] },
      { type: "links", layout: "list", items: [
        { label: "Watch my latest video", url: "https://youtube.com/", highlighted: true, icon: "auto" },
        { label: "Shop my favorites", sub: "Gear I actually use", url: "https://", icon: "🛍️" },
        { label: "Work with me", sub: "Brand deals & collabs", url: "mailto:hello@example.com", icon: "auto" },
      ] },
      { type: "stats", items: [
        { value: "120K", label: "Followers" },
        { value: "4.8M", label: "Views" },
        { value: "300+", label: "Videos" },
      ] },
      { type: "marquee", text: "Collabs open — let's make something", style: "band", speed: "normal" },
      { type: "form", kind: "newsletter", heading: "Get the weekly drop", text: "One email, every Friday. Behind the scenes and early access.", button: "Join" },
    ],
  }),

  portfolio: () => ({
    design: {
      layout: "split",
      accent: "#A78BFA",
      bgCustom: { type: "mesh", colors: ["#312e81", "#4c1d95", "#0f172a"], angle: 150 },
      liveBg: "liquid",
      titleFx: "holo",
      font: "inter",
      headingFont: "instrument",
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
      { type: "hero", name: "Your Name", tagline: "Independent designer crafting brands, sites & motion.", badge: "Available for freelance", layout: "split" },
      { type: "text", heading: "About", body: "Ten years of turning fuzzy ideas into clear, memorable brands. I work with founders who care about the details as much as I do.", align: "left" },
      { type: "features", heading: "What I do", cols: 2, items: [
        { icon: "✦", title: "Brand identity", text: "Logos, type and color systems that scale." },
        { icon: "◐", title: "Web design", text: "Fast, beautiful sites that convert." },
        { icon: "▶", title: "Motion", text: "Launch videos and micro-interactions." },
        { icon: "◇", title: "Art direction", text: "Campaigns and shoots with a point of view." },
      ] },
      { type: "testimonials", heading: "Kind words", layout: "carousel", items: [
        { quote: "The best creative partner we've had. Our launch doubled sign-ups.", name: "Dana Cohen", role: "Founder, Lumen", rating: 5 },
        { quote: "Fast, thoughtful and genuinely talented. Already booked again.", name: "Marcus Lee", role: "CMO, Northwind", rating: 5 },
      ] },
      { type: "links", layout: "cards", items: [
        { label: "Selected work", sub: "Case studies", url: "https://dribbble.com/", icon: "auto" },
        { label: "Behance", sub: "Full portfolio", url: "https://behance.net/", icon: "auto" },
        { label: "Download CV", sub: "PDF · 2 pages", url: "https://", icon: "📄" },
      ] },
      { type: "form", kind: "contact", heading: "Start a project", text: "Tell me a little about it — I reply within a day.", button: "Send" },
    ],
  }),

  coach: () => ({
    design: {
      accent: "#4ADE80",
      bgCustom: { type: "radial", colors: ["#14532d", "#052e16", "#020617"], angle: 150 },
      bgFx: "topglow",
      titleFx: "gradient",
      font: "manrope",
      headingFont: "unbounded",
      headingWeight: "semibold",
      card: "glass-soft",
      buttonShape: "rounded",
      buttonFx: "magnetic",
      section: "glass",
      reveal: "rise",
      fab: { kind: "whatsapp", value: "+972500000000", label: "Chat" },
    },
    blocks: [
      { type: "hero", name: "Your Name", tagline: "Online strength coaching for busy people.", badge: "3 spots left this month", layout: "center" },
      { type: "links", items: [
        { label: "Book a free intro call", url: "https://cal.com/", highlighted: true, icon: "📅" },
        { label: "Watch a sample workout", url: "https://youtube.com/", icon: "auto" },
      ] },
      { type: "features", heading: "How it works", cols: 2, items: [
        { icon: "🏋️", title: "Custom plan", text: "Built around your schedule & equipment." },
        { icon: "📱", title: "Daily check-ins", text: "Accountability without the guilt." },
        { icon: "🥗", title: "Simple nutrition", text: "No crazy diets. Real food." },
        { icon: "📈", title: "Real results", text: "Progress tracked every week." },
      ] },
      { type: "testimonials", heading: "Client wins", items: [
        { quote: "Down 9kg and finally enjoying training. Life-changing.", name: "Noa", role: "Client since 2024", rating: 5 },
        { quote: "Three sessions a week from home. Strongest I've ever been.", name: "Daniel", role: "Client since 2023", rating: 5 },
      ] },
      { type: "pricing", heading: "Coaching plans", items: [
        { name: "Starter", price: "$69", period: "/month", features: "Custom training plan\nMonthly check-in\nApp access", cta: "Start now", url: "https://" },
        { name: "1:1 Coaching", price: "$149", period: "/month", features: "Everything in Starter\nWeekly video calls\nNutrition guidance\nWhatsApp support", cta: "Apply", url: "https://", featured: true },
      ] },
      { type: "faq", items: [
        { question: "Do I need a gym?", answer: "Nope — most clients train at home with minimal equipment." },
        { question: "Can I cancel anytime?", answer: "Yes. No contracts, no hidden fees." },
      ] },
    ],
  }),

  cafe: () => ({
    design: {
      accent: "#B45309",
      bgCustom: { type: "linear", colors: ["#fdf6ec", "#f1e4cf"], angle: 160 },
      titleFx: "none",
      font: "dmsans",
      headingFont: "fraunces",
      headingWeight: "semibold",
      card: "solid-surface",
      buttonShape: "soft",
      buttonFx: "lift",
      section: "solid",
      reveal: "fade",
      fab: { kind: "phone", value: "+972300000000" },
    },
    blocks: [
      { type: "hero", name: "Morning Ritual Café", tagline: "Specialty coffee · pastries baked at dawn", badge: "Open now", layout: "cover" },
      { type: "links", layout: "cards", items: [
        { label: "Order for pickup", sub: "Ready in 10 minutes", url: "https://", icon: "🥡" },
        { label: "Book a table", sub: "Weekends fill up fast", url: "https://", icon: "🪑" },
        { label: "See the menu", url: "https://", icon: "📖" },
      ] },
      { type: "features", cols: 2, items: [
        { icon: "☕", title: "Single-origin coffee" },
        { icon: "🥐", title: "Baked daily" },
        { icon: "🌱", title: "Vegan options" },
        { icon: "📶", title: "Free Wi-Fi" },
      ] },
      { type: "text", heading: "Opening hours", body: "Sun–Thu · 7:00–19:00\nFri · 7:00–15:00\nSat · 9:00–18:00", align: "center" },
      { type: "map", query: "Rothschild Blvd 1, Tel Aviv", height: "md" },
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
      font: "grotesk",
      headingFont: "monoton",
      headingCase: "upper",
      headingTracking: "wide",
      card: "neon-cyber",
      buttonShape: "sharp",
      buttonFx: "neonflicker",
      reveal: "slide",
      cursor: "trail",
    },
    blocks: [
      { type: "hero", name: "Your Name", tagline: "DJ · producer · late-night sets", badge: "On tour this summer", layout: "big" },
      { type: "marquee", text: "NEW SINGLE OUT NOW", style: "outline", speed: "fast" },
      { type: "links", items: [
        { label: "Listen on Spotify", url: "https://open.spotify.com/", highlighted: true, icon: "auto" },
        { label: "SoundCloud mixes", url: "https://soundcloud.com/", icon: "auto" },
        { label: "Bookings", sub: "Clubs · festivals · private", url: "mailto:booking@example.com", icon: "auto" },
      ] },
      { type: "countdown", target: "2027-06-20T22:00", label: "Next show starts in" },
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
      font: "outfit",
      headingFont: "bricolage",
      headingWeight: "black",
      card: "grad-sunset",
      buttonShape: "pill",
      buttonFx: "bounce",
      reveal: "zoom",
    },
    blocks: [
      { type: "hero", name: "Something big", tagline: "is landing. Be the first to know.", badge: "Launching soon", layout: "center" },
      { type: "countdown", target: "2027-01-01T10:00", label: "Doors open in" },
      { type: "form", kind: "newsletter", heading: "Join the waitlist", text: "Early birds get 40% off at launch.", button: "Notify me" },
      { type: "stats", items: [
        { value: "2,400+", label: "On the list" },
        { value: "40%", label: "Early-bird off" },
      ] },
      { type: "marquee", text: "Limited spots · early access · launch pricing", style: "tilt", speed: "normal" },
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
      font: "sora",
      card: "glass-frost",
      buttonShape: "pill",
      buttonFx: "growglow",
      reveal: "rise",
    },
    blocks: [
      { type: "hero", name: "Your Name", tagline: "What you do, in one line.", layout: "center" },
      { type: "links", items: [
        { label: "My website", url: "https://", highlighted: true, icon: "auto" },
        { label: "Latest project", url: "https://", icon: "✨" },
        { label: "Say hello", url: "mailto:you@email.com", icon: "auto" },
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
      font: "inter",
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
      { type: "hero", name: "Your Name", tagline: "Designer & writer. Based somewhere sunny.", layout: "left" },
      { type: "divider", style: "line" },
      { type: "text", body: "I make quiet, useful things for the internet. Currently exploring type, tools and slow software.", align: "left" },
      { type: "links", layout: "list", items: [
        { label: "Writing", url: "https://" },
        { label: "Projects", url: "https://" },
        { label: "Email", url: "mailto:you@email.com" },
      ] },
    ],
  }),
};

/** A fresh, ready-to-edit page. "blank" = just a header; unknown = Classic. */
export function templateContent(templateId?: string): PageContent {
  if (templateId === "blank") {
    return { design: { reveal: "rise" }, blocks: [{ id: id(), type: "hero", name: "Your Name", tagline: "" }] };
  }
  const recipe = (templateId && RECIPES[templateId]?.()) || RECIPES.classic();
  return {
    design: recipe.design,
    blocks: recipe.blocks.map((b) => ({ ...b, id: id() }) as Block),
  };
}
