import type { PageContent } from "@/lib/blocks";

export type TemplateId = "creator" | "coach" | "freelancer" | "minimal";

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
  content: PageContent;
};

const link = (label: string, url = "https://", highlighted = false) => ({
  label,
  url,
  highlighted,
});

export const templates: Template[] = [
  {
    id: "creator",
    name: "Creator",
    description: "Links, socials, and your latest content.",
    content: {
      theme: "vivid",
      blocks: [
        { id: "hero", type: "hero", name: "Your Name", tagline: "Creator · storyteller" },
        {
          id: "links",
          type: "links",
          items: [link("Latest video", "https://", true), link("Shop my gear"), link("Newsletter")],
        },
        { id: "text", type: "text", heading: "About", body: "A line or two about who you are and what you make." },
        {
          id: "socials",
          type: "socials",
          items: [
            { platform: "instagram", url: "https://" },
            { platform: "youtube", url: "https://" },
            { platform: "tiktok", url: "https://" },
          ],
        },
      ],
    },
  },
  {
    id: "coach",
    name: "Coach",
    description: "Booking, programs, and testimonials.",
    content: {
      theme: "vivid",
      blocks: [
        { id: "hero", type: "hero", name: "Your Name", tagline: "Coach · online training" },
        {
          id: "links",
          type: "links",
          items: [link("Book a free session", "https://", true), link("Watch my program"), link("Join the newsletter")],
        },
        { id: "text", type: "text", heading: "About", body: "How you help people, and why they should work with you." },
        {
          id: "faq",
          type: "faq",
          items: [{ question: "How does it work?", answer: "Describe your process here." }],
        },
      ],
    },
  },
  {
    id: "freelancer",
    name: "Freelancer",
    description: "Portfolio, services, and contact.",
    content: {
      theme: "muted",
      blocks: [
        { id: "hero", type: "hero", name: "Your Name", tagline: "Designer · available for work" },
        {
          id: "links",
          type: "links",
          items: [link("View portfolio", "https://", true), link("Book a call"), link("Email me", "mailto:you@email.com")],
        },
        { id: "text", type: "text", heading: "Services", body: "What you offer, and who you work with best." },
      ],
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Just the essentials — name and a few links.",
    content: {
      theme: "vivid",
      blocks: [
        { id: "hero", type: "hero", name: "Your Name", tagline: "What you do" },
        {
          id: "links",
          type: "links",
          items: [link("My website", "https://", true), link("Say hello", "mailto:you@email.com")],
        },
      ],
    },
  },
];

export const blankTemplate: PageContent = {
  theme: "vivid",
  blocks: [
    { id: "hero", type: "hero", name: "Your Name", tagline: "What you do" },
    { id: "links", type: "links", items: [link("My website", "https://", true)] },
  ],
};

export function getTemplate(id: string): PageContent {
  return templates.find((t) => t.id === id)?.content ?? blankTemplate;
}
