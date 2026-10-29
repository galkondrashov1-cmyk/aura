import { ImageResponse } from "next/og";
import type { PublicPage } from "@/lib/public-page";
import { heroOf } from "@/lib/blocks";
import { toPlain } from "@/lib/richtext";
import { secondaryAccent } from "@/lib/design";

export const OG_SIZE = { width: 1200, height: 630 };

const HEBREW = /[֐-׿]/;

/** Satori has no bidi support: lay Hebrew runs out visually (right-to-left). */
function visual(text: string): string {
  if (!HEBREW.test(text)) return text;
  const runs = text.match(/[֐-׿\s"'׳״.,!?-]+|[^֐-׿]+/g) ?? [text];
  return runs
    .reverse()
    .map((r) => (HEBREW.test(r) ? [...r].reverse().join("") : r))
    .join("");
}

async function hebrewFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Heebo:wght@700&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype|woff)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The share card for a public page: photo, name, tagline, address — in the page's own colors. */
export async function ogImage(data: PublicPage | null, path: string) {
  const hero = data ? heroOf(data.content) : undefined;
  const name = (hero ? toPlain(hero.name) : "") || data?.username || "AURA";
  const tagline = hero ? [toPlain(hero.tagline), hero.words?.[0]].filter(Boolean).join(" ") : "";
  const accent = data?.content.design?.accent ?? "#00E5A0";
  const c2 = secondaryAccent(accent) ?? "#A855F7";
  const avatar = hero?.avatarUrl && /^https:\/\//.test(hero.avatarUrl) ? hero.avatarUrl : null;
  const font = HEBREW.test(name + tagline) ? await hebrewFont(name + tagline) : null;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => [...w][0] ?? "")
    .join("")
    .toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff",
          background: `radial-gradient(60% 80% at 15% 10%, ${accent}66, transparent 70%), radial-gradient(60% 80% at 90% 90%, ${c2}55, transparent 70%), #07080c`,
          // Satori splits fontFamily — the key must be absent, not undefined.
          ...(font ? { fontFamily: "Heebo" } : {}),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" width={200} height={200} style={{ borderRadius: 999, objectFit: "cover", border: `6px solid ${accent}` }} />
          ) : (
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 84,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${accent}, ${c2})`,
              }}
            >
              {visual(initials)}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
            <div style={{ fontSize: name.length > 18 ? 64 : 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{visual(name)}</div>
            {tagline && <div style={{ marginTop: 18, fontSize: 34, color: "rgba(255,255,255,0.72)", lineHeight: 1.3 }}>{visual(tagline.slice(0, 90))}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(255,255,255,0.85)" }}>
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke={accent}>
              <circle cx="24" cy="24" r="21" strokeWidth="2" opacity="0.55" />
              <circle cx="24" cy="24" r="14.5" strokeWidth="2.2" opacity="0.8" />
              <circle cx="24" cy="24" r="8.5" strokeWidth="2.4" />
              <circle cx="24" cy="24" r="3" fill={accent} />
            </svg>
            useaura.me{path}
          </div>
          <div style={{ display: "flex", padding: "12px 28px", borderRadius: 999, background: accent, color: "#04120c", fontWeight: 700 }}>
            Visit page →
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: font ? [{ name: "Heebo", data: font, weight: 700, style: "normal" }] : undefined },
  );
}
