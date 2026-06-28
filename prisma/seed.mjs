import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the SQLite file next to this script so it hits the same DB as the app,
// regardless of the current working directory.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient({
  datasources: { db: { url: "file:" + path.join(__dirname, "dev.db") } },
});

const content = {
  theme: "vivid",
  blocks: [
    { id: "b1", type: "hero", name: "Maya Rivera", tagline: "Fitness coach · online training" },
    {
      id: "b2",
      type: "links",
      items: [
        { label: "Book a free session", url: "https://cal.com/maya", highlighted: true },
        { label: "Watch my program", url: "https://youtube.com/@maya" },
        { label: "Join the newsletter", url: "https://maya.substack.com" },
      ],
    },
    {
      id: "b3",
      type: "text",
      heading: "About",
      body: "I help busy people build strength and energy with simple, sustainable online training. 10+ years coaching, hundreds of clients, zero gym intimidation.",
    },
    {
      id: "b4",
      type: "faq",
      items: [
        { question: "Do I need a gym?", answer: "Nope — most clients train at home with minimal equipment." },
        { question: "How does coaching work?", answer: "Weekly check-ins, a custom plan, and 24/7 chat support." },
      ],
    },
    {
      id: "b5",
      type: "socials",
      items: [
        { platform: "instagram", url: "https://instagram.com/maya" },
        { platform: "youtube", url: "https://youtube.com/@maya" },
        { platform: "tiktok", url: "https://tiktok.com/@maya" },
      ],
    },
  ],
};

async function main() {
  const passwordHash = await bcrypt.hash("supersecret123", 10);
  const user = await prisma.user.upsert({
    where: { email: "maya@example.com" },
    update: { name: "Maya Rivera" },
    create: {
      email: "maya@example.com",
      username: "maya",
      name: "Maya Rivera",
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@aura.app" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@aura.app",
      username: "admin",
      name: "AURA Admin",
      passwordHash: await bcrypt.hash("admin12345", 10),
      role: "ADMIN",
    },
  });

  const page = await prisma.page.upsert({
    where: { userId_slug: { userId: user.id, slug: "home" } },
    update: {
      title: "Maya Rivera",
      status: "PUBLISHED",
      isPrimary: true,
      theme: "vivid",
      draftContent: content,
      publishedContent: content,
      publishedAt: new Date(),
    },
    create: {
      userId: user.id,
      slug: "home",
      title: "Maya Rivera",
      status: "PUBLISHED",
      isPrimary: true,
      theme: "vivid",
      draftContent: content,
      publishedContent: content,
      publishedAt: new Date(),
    },
  });

  // Demo analytics across the last 14 days (idempotent).
  await prisma.pageView.deleteMany({ where: { pageId: page.id } });
  await prisma.linkClick.deleteMany({ where: { pageId: page.id } });
  const labels = ["Book a free session", "Watch my program", "Join the newsletter"];
  const views = [];
  const clicks = [];
  const now = Date.now();
  for (let d = 13; d >= 0; d--) {
    const base = now - d * 86400000;
    const vCount = 8 + Math.floor(Math.random() * 22);
    for (let i = 0; i < vCount; i++) {
      const roll = Math.random();
      views.push({
        pageId: page.id,
        device: roll < 0.55 ? "mobile" : roll < 0.85 ? "desktop" : "tablet",
        createdAt: new Date(base + Math.random() * 86400000),
      });
    }
    const cCount = Math.floor(vCount * (0.15 + Math.random() * 0.25));
    for (let i = 0; i < cCount; i++) {
      clicks.push({
        pageId: page.id,
        label: labels[Math.floor(Math.random() * labels.length)],
        url: "https://example.com",
        device: "mobile",
        createdAt: new Date(base + Math.random() * 86400000),
      });
    }
  }
  await prisma.pageView.createMany({ data: views });
  await prisma.linkClick.createMany({ data: clicks });

  console.log(
    `Seeded: useaura.me/${user.username} (${views.length} views, ${clicks.length} clicks)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
