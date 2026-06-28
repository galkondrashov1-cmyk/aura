import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "node:crypto";
import type { Block, PageContent } from "@/lib/blocks";
import { asPageContent } from "@/lib/blocks";

const SYSTEM = `You are AURA's page designer. Given a short description of a person or business, design a beautiful personal landing page as a JSON document.

Output ONLY a single JSON object — no markdown, no backticks, no commentary — matching this TypeScript type:

type PageContent = {
  theme: "vivid" | "muted";
  blocks: Block[];
};
type Block =
  | { id: string; type: "hero"; name: string; tagline?: string }
  | { id: string; type: "links"; items: { label: string; url: string; highlighted?: boolean }[] }
  | { id: string; type: "text"; heading?: string; body: string }
  | { id: string; type: "socials"; items: { platform: "instagram"|"youtube"|"tiktok"|"x"|"website"|"email"; url: string }[] }
  | { id: string; type: "faq"; items: { question: string; answer: string }[] }
  | { id: string; type: "divider" };

Rules:
- Start with a "hero" block: a real-sounding name and a concise, specific tagline.
- Include a "links" block with 3-5 relevant calls to action; mark the single most important one "highlighted": true. Use plausible https:// URLs, or mailto: for email.
- Add a short "text" block with heading "About" describing them in 1-2 sentences.
- Optionally add a "socials" block and a small "faq" (1-2 items) when they fit.
- Give every block a unique short "id".
- Default to "vivid"; use "muted" for luxury, professional, or minimal vibes.
- Keep copy tasteful and specific to the description. Do not invent contact details beyond placeholders.`;

function ensureIds(content: PageContent): PageContent {
  const blocks = content.blocks.map((b): Block => (b.id ? b : { ...b, id: randomUUID() }));
  return { ...content, blocks };
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    return null;
  }
}

/** Generate a page from a natural-language description using Claude. */
export async function generatePageContent(prompt: string): Promise<PageContent> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AI page builder isn't configured yet — add ANTHROPIC_API_KEY to .env to enable it.",
    );
  }

  const client = new Anthropic({ apiKey });
  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4000,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Describe me: ${prompt}\n\nReturn the JSON page now.`,
      },
    ],
  });

  const textBlock = res.content.find((b) => b.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "";
  const parsed = extractJson(raw);
  return ensureIds(asPageContent(parsed));
}
