"use client";

import { useMemo, useRef, useState, useTransition, createContext, useContext } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Star,
  Layers,
  Palette,
  Eye,
  Lock,
} from "lucide-react";
import { AuraLogo } from "@/components/aura-logo";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { savePage, publishPage, deletePage } from "@/lib/actions/pages";
import type {
  Block,
  BlockType,
  LinkItem,
  PageContent,
  PageDesign,
  SocialPlatform,
} from "@/lib/blocks";
import { DesignPanel } from "./design-panel";
import { PlanLock } from "./plan-lock";
import { SOCIAL_OPTIONS, SocialIcon } from "@/lib/socials";
import { AVATAR_IDLE, ICON_FX, ICON_IDLE, BUTTON_FX } from "@/lib/design";
import { SIZE_OPTS, ASPECT_OPTS, RADIUS_OPTS } from "@/lib/image";
import type { ImageConfig } from "@/lib/image";
import { RichTextInput } from "./rich-text-input";
import { caps, type Caps, type Plan } from "@/lib/plans";

// Plan capabilities for the whole editor tree (block editors read this).
const CapsContext = createContext<Caps>(caps("PRO"));
const useCaps = () => useContext(CapsContext);

const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero",
  links: "Links",
  text: "Text",
  socials: "Socials",
  image: "Image",
  gallery: "Gallery",
  video: "Video",
  faq: "FAQ",
  divider: "Divider",
};

// Hero is a fixed, single block (every page has exactly one) — not addable.
const ADDABLE: BlockType[] = [
  "links",
  "text",
  "socials",
  "image",
  "gallery",
  "video",
  "faq",
  "divider",
];

function newBlock(type: BlockType): Block {
  const id = crypto.randomUUID();
  switch (type) {
    case "hero":
      return { id, type, name: "Your Name", tagline: "" };
    case "links":
      return { id, type, items: [{ label: "New link", url: "https://" }] };
    case "text":
      return { id, type, heading: "Heading", body: "Some text…" };
    case "socials":
      return { id, type, items: [{ platform: "instagram", url: "https://" }] };
    case "image":
      return { id, type, url: "", alt: "" };
    case "gallery":
      return { id, type, images: [] };
    case "video":
      return { id, type, url: "", title: "" };
    case "faq":
      return { id, type, items: [{ question: "Question?", answer: "Answer." }] };
    case "divider":
      return { id, type };
  }
}

export function Editor({
  pageId,
  username,
  published: initialPublished,
  plan,
  initialContent,
}: {
  pageId: string;
  username: string;
  published: boolean;
  plan: Plan;
  initialContent: PageContent;
}) {
  const c = caps(plan);
  const [blocks, setBlocks] = useState<Block[]>(initialContent.blocks);
  const [design, setDesign] = useState<PageDesign>(initialContent.design ?? {});
  const [published, setPublished] = useState(initialPublished);
  const [saved, setSaved] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [tab, setTab] = useState<"content" | "design" | "preview">("content");

  const content: PageContent = useMemo(
    () => ({ blocks, design }),
    [blocks, design],
  );

  const patch = (id: string, p: Record<string, unknown>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? ({ ...b, ...p } as Block) : b)));
  const removeBlock = (id: string) =>
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  const moveBlock = (id: string, dir: -1 | 1) =>
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= bs.length) return bs;
      const c = [...bs];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  const addBlock = (type: BlockType) =>
    setBlocks((bs) => [...bs, newBlock(type)]);
  const dropBefore = (srcId: string, targetId: string) =>
    setBlocks((bs) => {
      if (srcId === targetId) return bs;
      const src = bs.find((b) => b.id === srcId);
      if (!src) return bs;
      const without = bs.filter((b) => b.id !== srcId);
      const ti = without.findIndex((b) => b.id === targetId);
      if (ti < 0) return bs;
      return [...without.slice(0, ti), src, ...without.slice(ti)];
    });

  const onSave = () =>
    start(async () => {
      await savePage(pageId, content);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  const onPublish = () =>
    start(async () => {
      await publishPage(pageId, content);
      setPublished(true);
    });

  return (
    <CapsContext.Provider value={c}>
    <div data-mode="muted" className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur sm:gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-text-muted transition-colors hover:text-text">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="hidden sm:block">
            <AuraLogo />
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {published && (
            <Link href={`/${username}`} target="_blank" className={buttonClasses("ghost", "sm")}>
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </Link>
          )}
          <form
            action={deletePage.bind(null, pageId)}
            onSubmit={(e) => {
              if (!confirm("Delete this page? This can't be undone.")) e.preventDefault();
            }}
          >
            <button type="submit" className={buttonClasses("ghost", "sm")}>
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </form>
          <button onClick={onSave} disabled={pending} className={buttonClasses("secondary", "sm")}>
            {saved ? (
              <>
                <Check className="h-4 w-4" /> Saved
              </>
            ) : (
              <>
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">Save draft</span>
              </>
            )}
          </button>
          <button onClick={onPublish} disabled={pending} className={buttonClasses("primary", "sm")}>
            <span className="sm:hidden">Publish</span>
            <span className="hidden sm:inline">{published ? "Publish changes" : "Publish"}</span>
          </button>
        </div>
      </header>

      {/* Tab bar — switch the editing panel; Preview tab shows on mobile only */}
      <div className="sticky top-[57px] z-10 border-b border-border bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 py-2">
          <TabButton active={tab === "content"} onClick={() => setTab("content")} icon={Layers}>
            Content
          </TabButton>
          <TabButton active={tab === "design"} onClick={() => setTab("design")} icon={Palette}>
            Design
          </TabButton>
          <TabButton
            active={tab === "preview"}
            onClick={() => setTab("preview")}
            icon={Eye}
            mobileOnly
          >
            Preview
          </TabButton>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        {/* Editing panel: Content (blocks) or Design */}
        <div className={cn("min-w-0 space-y-3", tab === "preview" ? "hidden lg:block" : "block")}>
          {tab === "design" ? (
            <DesignPanel
              design={design}
              plan={plan}
              onChange={(patch) => setDesign((d) => ({ ...d, ...patch }))}
            />
          ) : (
            <>
              {blocks.map((block, i) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  index={i}
                  total={blocks.length}
                  dragId={dragId}
                  setDragId={setDragId}
                  onPatch={patch}
                  onRemove={removeBlock}
                  onMove={moveBlock}
                  onDropBlock={dropBefore}
                />
              ))}

              {blocks.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-text-muted">
                  No blocks yet. Add one below.
                </p>
              )}

              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="mb-3 text-sm font-medium">Add block</p>
                <div className="flex flex-wrap gap-2">
                  {ADDABLE.map((t) => (
                    <button
                      key={t}
                      onClick={() => addBlock(t)}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-primary/50 hover:text-text"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {BLOCK_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live preview: always docked on desktop; on mobile only when Preview tab active */}
        <div
          className={cn(
            "min-w-0 lg:sticky lg:top-28 lg:block lg:self-start",
            tab === "preview" ? "block" : "hidden",
          )}
        >
          <p className="mb-3 truncate text-center text-xs text-text-muted lg:text-left">
            Live preview · useaura.me/{username}
          </p>
          <div className="mx-auto max-w-sm overflow-hidden rounded-[34px] border-[6px] border-surface-2 shadow-2xl ring-1 ring-border">
            <PageRenderer content={content} embedded hideBadge={c.removeBadge} />
          </div>
        </div>
      </div>
    </div>
    </CapsContext.Provider>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  mobileOnly,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  mobileOnly?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:flex-none",
        mobileOnly && "lg:hidden",
        active
          ? "bg-surface-2 text-text"
          : "text-text-muted hover:bg-surface hover:text-text",
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function BlockCard({
  block,
  index,
  total,
  dragId,
  setDragId,
  onPatch,
  onRemove,
  onMove,
  onDropBlock,
}: {
  block: Block;
  index: number;
  total: number;
  dragId: string | null;
  setDragId: (id: string | null) => void;
  onPatch: (id: string, patch: Record<string, unknown>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onDropBlock: (srcId: string, targetId: string) => void;
}) {
  return (
    <div
      onDragOver={(e) => {
        if (dragId) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        const src = e.dataTransfer.getData("text/plain");
        if (src) onDropBlock(src, block.id);
      }}
      className={cn(
        "rounded-2xl border bg-surface p-4 transition-colors",
        dragId === block.id ? "border-primary opacity-60" : "border-border",
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", block.id);
              e.dataTransfer.effectAllowed = "move";
              setDragId(block.id);
            }}
            onDragEnd={() => setDragId(null)}
            className="cursor-grab text-text-muted active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium">{BLOCK_LABELS[block.type]}</span>
        </div>
        <div className="flex items-center gap-1 text-text-muted">
          <button
            onClick={() => onMove(block.id, -1)}
            disabled={index === 0}
            aria-label="Move up"
            className="p-1 transition-colors hover:text-text disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => onMove(block.id, 1)}
            disabled={index === total - 1}
            aria-label="Move down"
            className="p-1 transition-colors hover:text-text disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => onRemove(block.id)}
            aria-label="Delete block"
            className="p-1 transition-colors hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <BlockFields block={block} onPatch={onPatch} />
    </div>
  );
}

function BlockFields({
  block,
  onPatch,
}: {
  block: Block;
  onPatch: (id: string, patch: Record<string, unknown>) => void;
}) {
  const c = useCaps();
  switch (block.type) {
    case "hero":
      return <HeroEditor block={block} onPatch={(p) => onPatch(block.id, p)} />;
    case "text":
      return <TextEditor block={block} onPatch={onPatch} />;
    case "image":
      return (
        <div className="space-y-2">
          {block.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.url}
              alt=""
              className="max-h-40 w-full rounded-xl border border-border object-cover"
            />
          )}
          <div className="flex gap-2">
            <Input
              value={block.url}
              onChange={(e) => onPatch(block.id, { url: e.target.value })}
              placeholder="Image URL or upload →"
              className="bg-surface-2"
            />
            <ImageUploader onUploaded={(url) => onPatch(block.id, { url })} />
          </div>
          <RichTextInput
            value={block.caption}
            onChange={(caption) => onPatch(block.id, { caption })}
            placeholder="Caption (optional)"
          />
          <div className="rounded-xl border border-border bg-surface-2 p-2.5">
            <ImageControls value={block.img} onChange={(img) => onPatch(block.id, { img })} />
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className="space-y-2">
          <div className="flex overflow-hidden rounded-lg border border-border">
            {(["grid", "carousel"] as const).map((l) => {
              const locked = l === "carousel" && !c.gallerySlideshow;
              return (
                <button
                  key={l}
                  onClick={() =>
                    locked
                      ? (window.location.href = "/dashboard/upgrade")
                      : onPatch(block.id, { layout: l })
                  }
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 px-3 py-1.5 text-xs capitalize",
                    (block.layout ?? "grid") === l
                      ? "bg-surface-2 text-text"
                      : "text-text-muted hover:text-text",
                  )}
                >
                  {l === "carousel" ? "Slideshow" : "Grid"}
                  {locked && <Lock className="h-3 w-3 text-primary" />}
                </button>
              );
            })}
          </div>
          <GalleryEditor
            images={block.images}
            img={block.img}
            onChange={(images) => onPatch(block.id, { images })}
            onConfig={(img) => onPatch(block.id, { img })}
          />
        </div>
      );
    case "video":
      return (
        <div className="space-y-2">
          <Input
            value={block.url}
            onChange={(e) => onPatch(block.id, { url: e.target.value })}
            placeholder="YouTube URL"
            className="bg-surface-2"
          />
          <RichTextInput
            value={block.title}
            onChange={(title) => onPatch(block.id, { title })}
            placeholder="Title (optional)"
          />
        </div>
      );
    case "links":
      return (
        <LinksEditor
          items={block.items}
          onChange={(items) => onPatch(block.id, { items })}
        />
      );
    case "socials":
      return <SocialsEditor block={block} onPatch={onPatch} />;
    case "faq":
      return (
        <FaqEditor
          items={block.items}
          onChange={(items) => onPatch(block.id, { items })}
        />
      );
    case "divider":
      return <DividerEditor block={block} onPatch={onPatch} />;
  }
}

function TextEditor({
  block,
  onPatch,
}: {
  block: Extract<Block, { type: "text" }>;
  onPatch: (id: string, p: Record<string, unknown>) => void;
}) {
  const aligns: { id: "left" | "center" | "right"; label: string }[] = [
    { id: "left", label: "Left" },
    { id: "center", label: "Center" },
    { id: "right", label: "Right" },
  ];
  const sizes: { id: "sm" | "md" | "lg"; label: string }[] = [
    { id: "sm", label: "S" },
    { id: "md", label: "M" },
    { id: "lg", label: "L" },
  ];
  const c = useCaps();
  return (
    <div className="space-y-2.5">
      <RichTextInput
        value={block.heading}
        onChange={(heading) => onPatch(block.id, { heading })}
        placeholder="Heading (optional)"
      />
      <RichTextInput
        value={block.body}
        onChange={(body) => onPatch(block.id, { body })}
        placeholder="Text"
        multiline
      />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-border">
          {aligns.map((a) => (
            <button
              key={a.id}
              onClick={() => onPatch(block.id, { align: a.id })}
              className={cn(
                "px-2.5 py-1.5 text-xs",
                (block.align ?? "left") === a.id
                  ? "bg-surface-2 text-text"
                  : "text-text-muted hover:text-text",
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-lg border border-border">
          {sizes.map((s) => (
            <button
              key={s.id}
              onClick={() => onPatch(block.id, { size: s.id })}
              className={cn(
                "px-2.5 py-1.5 text-xs",
                (block.size ?? "md") === s.id
                  ? "bg-surface-2 text-text"
                  : "text-text-muted hover:text-text",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <PlanLock locked={!c.perElement}>
          <label className="flex items-center gap-1.5 text-xs text-text-muted">
            <input
              type="color"
              value={block.color || "#9aa3af"}
              onChange={(e) => onPatch(block.id, { color: e.target.value })}
              className="h-7 w-8 cursor-pointer rounded border border-border bg-surface-2"
              aria-label="Text color"
            />
            Color
            {block.color && (
              <button
                onClick={() => onPatch(block.id, { color: undefined })}
                className="text-text-muted hover:text-text"
              >
                ✕
              </button>
            )}
          </label>
        </PlanLock>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs text-text-muted select-none">
          <input
            type="checkbox"
            checked={!!block.spoiler}
            onChange={(e) => onPatch(block.id, { spoiler: e.target.checked || undefined })}
            className="h-3.5 w-3.5 accent-primary"
          />
          Spoiler (tap to reveal)
        </label>
      </div>
    </div>
  );
}

function DividerEditor({
  block,
  onPatch,
}: {
  block: Extract<Block, { type: "divider" }>;
  onPatch: (id: string, p: Record<string, unknown>) => void;
}) {
  const styles: { id: "line" | "dashed" | "dotted" | "glow"; label: string }[] = [
    { id: "line", label: "Line" },
    { id: "dashed", label: "Dashed" },
    { id: "dotted", label: "Dotted" },
    { id: "glow", label: "Glow" },
  ];
  const c = useCaps();
  return (
    <div className="space-y-3">
      <PlanLock locked={!c.perElement}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={block.color || "#2a2f3a"}
          onChange={(e) => onPatch(block.id, { color: e.target.value })}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-border bg-surface-2"
          aria-label="Divider color"
        />
        <span className="text-xs text-text-muted">{block.color ?? "Default"}</span>
        {block.color && (
          <button
            onClick={() => onPatch(block.id, { color: undefined })}
            className="ml-auto text-xs text-text-muted hover:text-text"
          >
            Reset
          </button>
        )}
      </div>
      </PlanLock>
      <div className="grid grid-cols-4 gap-2">
        {styles.map((s) => (
          <button
            key={s.id}
            onClick={() => onPatch(block.id, { style: s.id })}
            className={cn(
              "rounded-lg border px-2 py-1.5 text-xs",
              (block.style ?? "line") === s.id
                ? "border-primary text-text"
                : "border-border text-text-muted hover:text-text",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ImageUploader({ onUploaded }: { onUploaded: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) onUploaded(json.url);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={onPick}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="shrink-0 rounded-xl border border-border px-3 text-sm text-text-muted transition-colors hover:text-text disabled:opacity-50"
      >
        {busy ? "…" : "Upload"}
      </button>
    </>
  );
}

type HeroBlockT = Extract<Block, { type: "hero" }>;

function SegBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg border px-2 py-1.5 text-xs transition-colors",
        active ? "border-primary text-text" : "border-border text-text-muted hover:text-text",
      )}
    >
      {children}
    </button>
  );
}

function ControlRow<T extends string>({
  label,
  opts,
  active,
  onPick,
}: {
  label: string;
  opts: { id: T; label: string }[];
  active: T;
  onPick: (id: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-12 shrink-0 text-[11px] text-text-muted">{label}</span>
      <div className="flex flex-1 flex-wrap gap-1">
        {opts.map((o) => (
          <SegBtn key={o.id} active={active === o.id} onClick={() => onPick(o.id)}>
            {o.label}
          </SegBtn>
        ))}
      </div>
    </div>
  );
}

/** One identical image-control UI shared by every image-bearing element. */
function ImageControls({
  value,
  onChange,
  showSize = true,
  defaults,
}: {
  value?: ImageConfig;
  onChange: (v: ImageConfig) => void;
  showSize?: boolean;
  defaults?: ImageConfig;
}) {
  const v = value ?? {};
  const d = defaults ?? {};
  return (
    <div className="space-y-1.5">
      {showSize && (
        <ControlRow
          label="Size"
          opts={SIZE_OPTS}
          active={v.size ?? d.size ?? "full"}
          onPick={(size) => onChange({ ...v, size })}
        />
      )}
      <ControlRow
        label="Aspect"
        opts={ASPECT_OPTS}
        active={v.aspect ?? d.aspect ?? "auto"}
        onPick={(aspect) => onChange({ ...v, aspect })}
      />
      <ControlRow
        label="Corners"
        opts={RADIUS_OPTS}
        active={v.radius ?? d.radius ?? "md"}
        onPick={(radius) => onChange({ ...v, radius })}
      />
    </div>
  );
}

function HeroEditor({
  block,
  onPatch,
}: {
  block: HeroBlockT;
  onPatch: (p: Partial<HeroBlockT>) => void;
}) {
  return (
    <div className="space-y-3">
      <RichTextInput
        value={block.name}
        onChange={(name) => onPatch({ name })}
        placeholder="Name"
      />
      <RichTextInput
        value={block.tagline}
        onChange={(tagline) => onPatch({ tagline })}
        placeholder="Tagline"
      />

      <div className="space-y-2 rounded-xl border border-border bg-surface-2 p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-text-muted">Profile image</p>
          {block.avatarUrl && (
            <button
              onClick={() => onPatch({ avatarUrl: null })}
              className="text-xs text-text-muted hover:text-text"
            >
              Remove
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {block.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.avatarUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
            />
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border text-[10px] text-text-muted">
              Logo
            </span>
          )}
          <Input
            value={block.avatarUrl ?? ""}
            onChange={(e) => onPatch({ avatarUrl: e.target.value })}
            placeholder="Image URL or upload →"
            className="bg-bg"
          />
          <ImageUploader onUploaded={(url) => onPatch({ avatarUrl: url })} />
        </div>
        <ImageControls
          value={block.avatar}
          onChange={(avatar) => onPatch({ avatar })}
          defaults={{ aspect: "square", radius: "full" }}
        />
        <select
          value={block.avatarIdle ?? ""}
          onChange={(e) => onPatch({ avatarIdle: e.target.value || undefined })}
          className="h-9 w-full rounded-lg border border-border bg-bg px-2 text-sm text-text"
        >
          <option value="">Idle animation: None</option>
          {AVATAR_IDLE.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-surface-2 p-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-text-muted">Banner (behind image)</p>
          {block.bannerUrl && (
            <button
              onClick={() => onPatch({ bannerUrl: null })}
              className="text-xs text-text-muted hover:text-text"
            >
              Remove
            </button>
          )}
        </div>
        {block.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={block.bannerUrl}
            alt=""
            className="h-16 w-full rounded-lg border border-border object-cover"
          />
        )}
        <div className="flex items-center gap-2">
          <Input
            value={block.bannerUrl ?? ""}
            onChange={(e) => onPatch({ bannerUrl: e.target.value })}
            placeholder="Banner URL or upload →"
            className="bg-bg"
          />
          <ImageUploader onUploaded={(url) => onPatch({ bannerUrl: url })} />
        </div>
        <ImageControls
          value={block.banner}
          onChange={(banner) => onPatch({ banner })}
          showSize={false}
          defaults={{ aspect: "wide", radius: "lg" }}
        />
      </div>
    </div>
  );
}

function GalleryEditor({
  images,
  img,
  onChange,
  onConfig,
}: {
  images: { url: string; alt?: string }[];
  img?: ImageConfig;
  onChange: (images: { url: string; alt?: string }[]) => void;
  onConfig: (img: ImageConfig) => void;
}) {
  const update = (i: number, patch: Partial<{ url: string; alt?: string }>) =>
    onChange(images.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-border bg-surface-2 p-2.5">
        <ImageControls
          value={img}
          onChange={onConfig}
          showSize={false}
          defaults={{ aspect: "square", radius: "sm" }}
        />
      </div>
      {images.map((image, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-border bg-surface-2 p-2.5">
          {image.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.url}
              alt=""
              className="max-h-28 w-full rounded-lg object-cover"
            />
          )}
          <div className="flex gap-2">
            <Input
              value={image.url}
              onChange={(e) => update(i, { url: e.target.value })}
              placeholder="Image URL"
              className="bg-bg"
            />
            <ImageUploader onUploaded={(url) => update(i, { url })} />
            <RemoveBtn onClick={() => onChange(images.filter((_, j) => j !== i))} />
          </div>
        </div>
      ))}
      <AddItemBtn onClick={() => onChange([...images, { url: "" }])} />
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Remove item"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-text-muted transition-colors hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function AddItemBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text"
    >
      <Plus className="h-4 w-4" /> Add item
    </button>
  );
}

function LinksEditor({
  items,
  onChange,
}: {
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
}) {
  const c = useCaps();
  const update = (i: number, p: Partial<LinkItem>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...p } : it)));
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-border bg-surface-2 p-2.5">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <RichTextInput
                value={it.label}
                onChange={(label) => update(i, { label })}
                placeholder="Label"
              />
            </div>
            <button
              onClick={() => update(i, { highlighted: !it.highlighted })}
              aria-label="Highlight"
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors",
                it.highlighted
                  ? "border-primary text-primary"
                  : "border-border text-text-muted hover:text-text",
              )}
            >
              <Star className="h-4 w-4" />
            </button>
            <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
          <Input
            value={it.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="https://"
            className="bg-bg"
          />
          {/* Per-button override (the Design tab sets the default for all buttons) */}
          <PlanLock locked={!c.perElement}>
            <div className="flex items-center gap-2 border-t border-border/60 pt-2">
              <span className="shrink-0 text-[11px] text-text-muted">This button</span>
              <label className="flex items-center gap-1" title="Override this button's fill color">
                <input
                  type="color"
                  value={it.color || "#00e5a0"}
                  onChange={(e) => update(i, { color: e.target.value })}
                  className="h-7 w-8 cursor-pointer rounded border border-border bg-bg"
                  aria-label="Button fill color"
                />
                {it.color && (
                  <button onClick={() => update(i, { color: undefined })} className="text-text-muted hover:text-text" title="Reset to default">✕</button>
                )}
              </label>
              <select
                value={it.fx ?? ""}
                onChange={(e) => update(i, { fx: e.target.value || undefined })}
                className="h-7 flex-1 rounded-lg border border-border bg-bg px-2 text-xs text-text"
                aria-label="Button effect override"
                title="Override this button's hover effect"
              >
                <option value="">Effect: use default</option>
                {BUTTON_FX.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </PlanLock>
        </div>
      ))}
      <AddItemBtn onClick={() => onChange([...items, { label: "New link", url: "https://" }])} />
    </div>
  );
}

function SocialsEditor({
  block,
  onPatch,
}: {
  block: Extract<Block, { type: "socials" }>;
  onPatch: (id: string, p: Record<string, unknown>) => void;
}) {
  const items = block.items;
  const c = useCaps();
  const onChange = (next: { platform: SocialPlatform; url: string }[]) =>
    onPatch(block.id, { items: next });
  const update = (i: number, p: Partial<{ platform: SocialPlatform; url: string }>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...p } : it)));
  return (
    <div className="space-y-3">
      {/* Centralized icon styling for this Socials block */}
      <PlanLock locked={!c.perElement}>
      <div className="space-y-2 rounded-xl border border-border bg-surface-2 p-2.5">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={block.iconColor || "#9aa3af"}
            onChange={(e) => onPatch(block.id, { iconColor: e.target.value })}
            className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-border bg-bg"
            aria-label="Icon color"
          />
          <span className="text-xs text-text-muted">Icon color</span>
          {block.iconColor && (
            <button
              onClick={() => onPatch(block.id, { iconColor: undefined })}
              className="ml-auto text-xs text-text-muted hover:text-text"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-[11px] text-text-muted">
            Hover effect
            <select
              value={block.iconFx ?? ""}
              onChange={(e) => onPatch(block.id, { iconFx: e.target.value || undefined })}
              className="h-8 rounded-lg border border-border bg-bg px-2 text-xs text-text"
            >
              <option value="">Default</option>
              {ICON_FX.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-[11px] text-text-muted">
            Idle motion
            <select
              value={block.iconIdle ?? ""}
              onChange={(e) => onPatch(block.id, { iconIdle: e.target.value || undefined })}
              className="h-8 rounded-lg border border-border bg-bg px-2 text-xs text-text"
            >
              <option value="">None</option>
              {ICON_IDLE.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      </PlanLock>
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 text-text">
            <SocialIcon platform={it.platform} className="h-4 w-4" />
          </span>
          <select
            value={it.platform}
            onChange={(e) => update(i, { platform: e.target.value as SocialPlatform })}
            className="h-9 shrink-0 rounded-lg border border-border bg-surface-2 px-2 text-sm text-text"
          >
            {SOCIAL_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <Input
            value={it.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder={
              it.platform === "email"
                ? "you@example.com"
                : it.platform === "phone"
                  ? "+1 555 123 4567"
                  : "https://"
            }
            className="bg-surface-2"
          />
          <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddItemBtn
        onClick={() => onChange([...items, { platform: "instagram", url: "https://" }])}
      />
    </div>
  );
}

type FaqItem = Extract<Block, { type: "faq" }>["items"][number];

function FaqEditor({
  items,
  onChange,
}: {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}) {
  const update = (i: number, p: Partial<FaqItem>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...p } : it)));
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-border bg-surface-2 p-2.5">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <RichTextInput
                value={it.question}
                onChange={(question) => update(i, { question })}
                placeholder="Question"
              />
            </div>
            <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
          <RichTextInput
            value={it.answer}
            onChange={(answer) => update(i, { answer })}
            placeholder="Answer"
            multiline
          />
        </div>
      ))}
      <AddItemBtn
        onClick={() => onChange([...items, { question: "Question?", answer: "Answer." }])}
      />
    </div>
  );
}
