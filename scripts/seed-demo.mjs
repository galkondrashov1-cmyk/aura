// Seeds (idempotent, runs on every deploy):
//   1. Gal's admin account — galkondrashov1@gmail.com / 52465246, role ADMIN
//   2. Demo business — demo@hila.co.il / demo1234 · public page at /dana
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ── platform admin (Gal) ────────────────────────────────────────────────
const admin = await prisma.business.upsert({
  where: { email: "galkondrashov1@gmail.com" },
  // Keep the account as-is on redeploys, but make sure it stays ADMIN.
  update: { role: "ADMIN" },
  create: {
    email: "galkondrashov1@gmail.com",
    passwordHash: await bcrypt.hash("52465246", 10),
    ownerName: "גל",
    name: "הילה HQ",
    slug: "gal",
    role: "ADMIN",
    plan: "BUSINESS",
    site: {
      create: {
        content: {
          emoji: "😇",
          tagline: "ההילה של העסק שלך",
          about: "",
          ctaText: "לקביעת פגישה",
          phone: "",
          whatsapp: "",
          instagram: "",
          facebook: "",
          address: "",
          showServices: true,
          showHours: true,
          showAbout: true,
        },
        design: {
          theme: "hila-night",
          background: "halo-night",
          accent: "#f0b429",
          font: "secular",
          button: "pill",
          buttonFill: "glow",
          corners: "xl",
          effects: "halo",
        },
      },
    },
    hours: {
      create: [0, 1, 2, 3, 4].map((day) => ({ day, startMin: 540, endMin: 1020 })),
    },
  },
});
console.log(`Seeded admin: ${admin.email} (role=${admin.role}) → /${admin.slug}`);

const biz = await prisma.business.upsert({
  where: { email: "demo@hila.co.il" },
  update: {},
  create: {
    email: "demo@hila.co.il",
    passwordHash: await bcrypt.hash("demo1234", 10),
    ownerName: "דנה כהן",
    name: "הסטודיו של דנה",
    slug: "dana",
    plan: "BUSINESS",
    autoConfirm: true,
    site: {
      create: {
        published: true,
        publishedAt: new Date(),
        content: {
          emoji: "💅",
          tagline: "סטודיו בוטיק לציפורניים ועיצוב גבות בלב העיר",
          about:
            "היי! אני דנה 💛\nכבר עשר שנים שאני עוזרת לנשים להרגיש הכי יפות שיש. בסטודיו מחכים לך קפה טוב, מוזיקה נעימה ותוצאה מושלמת.",
          ctaText: "לקביעת תור אצל דנה",
          phone: "0501234567",
          whatsapp: "0501234567",
          instagram: "dana.studio",
          facebook: "",
          address: "דיזנגוף 100, תל אביב",
          showServices: true,
          showHours: true,
          showAbout: true,
        },
        design: {
          theme: "hila-night",
          background: "halo-night",
          accent: "#f0b429",
          font: "secular",
          button: "pill",
          buttonFill: "glow",
          corners: "xl",
          effects: "halo",
        },
      },
    },
    services: {
      create: [
        { name: "מניקור ג׳ל", durationMin: 60, price: 120, order: 0 },
        { name: "בניית ציפורניים", durationMin: 90, price: 250, order: 1 },
        { name: "עיצוב גבות", durationMin: 30, price: 80, order: 2 },
      ],
    },
    hours: {
      create: [
        { day: 0, startMin: 540, endMin: 1140 },
        { day: 1, startMin: 540, endMin: 1140 },
        { day: 2, startMin: 540, endMin: 1140 },
        { day: 3, startMin: 540, endMin: 1140 },
        { day: 4, startMin: 540, endMin: 900 },
      ],
    },
  },
});

console.log(`Seeded demo business: ${biz.name} → /${biz.slug} (demo@hila.co.il / demo1234)`);
await prisma.$disconnect();
