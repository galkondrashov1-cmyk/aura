"use client";

import { useActionState, useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudOff,
  Copy,
  Eye,
  GripVertical,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  Monitor,
  Palette,
  Plus,
  Redo2,
  Smartphone,
  Sparkles,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { AuraMark } from "@/components/aura-logo";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { cn } from "@/lib/utils";
import { savePage, publishPage, deletePage, unpublishPage, setPrimaryPage, updatePageSlug, type SlugState } from "@/lib/actions/pages";
import { asPageContent, heroOf, type Block, type BlockType, type PageContent, type PageDesign } from "@/lib/blocks";
import { caps, type Plan } from "@/lib/plans";
import { allowed, BLOCK_TIER, fitToPlanReport, looksRtl } from "@/lib/studio";
import { toPlain } from "@/lib/richtext";
import { DesignPanel } from "./design-panel";
import { BLOCK_META, BlockFields, blockSummary, newBlock } from "./block-editors";
import { PublishDialog } from "./publish-dialog";
import { Modal, TierPill, UpgradeContext, fieldCls } from "./ui";
import { Upsell } from "./upsell";

type Panel = "blocks" | "design";
type SaveState = "saved" | "dirty" | "saving" | "error";

const HISTORY_LIMIT = 120;
const COALESCE_MS = 700;

export function Editor({
  pageId,
  username,
  slug,
  isPrimary: initialPrimary,
  published: initialPublished,
  publishedContent,
  plan,
  payments,
  draftToken,
  initialContent,
}: {
  pageId: string;
  username: string;
  slug: string;
  isPrimary: boolean;
  published: boolean;
  publishedContent: PageContent | null;
  plan: Plan;
  /** PayPal is live — paid plans are bought, not claimed. */
  payments: boolean;
  draftToken: string;
  initialContent: PageContent;
}) {
  const c = caps(plan);

  // ── Document + history ──
  const [doc, setDoc] = useState<PageContent>(() => ({
    blocks: initialContent.blocks,
    design: initialContent.design ?? {},
  }));
  const docRef = useRef(doc);
  const past = useRef<PageContent[]>([]);
  const future = useRef<PageContent[]>([]);
  const lastPush = useRef(0);
  const [version, setVersion] = useState(0); // remounts uncontrolled inputs after undo/redo
  const [hist, setHist] = useState({ undo: 0, redo: 0 });
  const syncHist = () => setHist({ undo: past.current.length, redo: future.current.length });

  const commit = useCallback((recipe: (d: PageContent) => PageContent) => {
    const prev = docRef.current;
    const next = recipe(prev);
    if (next === prev) return;
    const now = Date.now();
    if (now - lastPush.current > COALESCE_MS) {
      past.current.push(prev);
      if (past.current.length > HISTORY_LIMIT) past.current.shift();
    }
    lastPush.current = now;
    future.current = [];
    docRef.current = next;
    setDoc(next);
    syncHist();
  }, []);

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(docRef.current);
    docRef.current = prev;
    lastPush.current = 0;
    setDoc(prev);
    setVersion((v) => v + 1);
    syncHist();
  }, []);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(docRef.current);
    docRef.current = next;
    lastPush.current = 0;
    setDoc(next);
    setVersion((v) => v + 1);
    syncHist();
  }, []);

  const patchDesign = useCallback(
    (p: Partial<PageDesign>) => commit((d) => ({ ...d, design: { ...(d.design ?? {}), ...p } })),
    [commit],
  );
  const patchBlock = useCallback(
    (id: string, p: Record<string, unknown>) =>
      commit((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === id ? ({ ...b, ...p } as Block) : b)) })),
    [commit],
  );

  // ── UI state ──
  const [selected, setSelected] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null); // mobile sheet (null = closed)
  const [deskPanel, setDeskPanel] = useState<Panel>("blocks");
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedBlock = selected ? doc.blocks.find((b) => b.id === selected) : undefined;

  const select = useCallback((id: string | null, scroll: "center" | "nearest" | false = false) => {
    setSelected(id);
    if (id) setPanel((p) => p ?? "blocks");
    if (id && scroll) {
      // After the panel opens (the canvas shrinks on phones), keep the block in view.
      setTimeout(
        () =>
          canvasRef.current
            ?.querySelector(`[data-block-id="${CSS.escape(id)}"]`)
            ?.scrollIntoView({ block: scroll, behavior: "smooth" }),
        60,
      );
    }
  }, []);

  // ── Autosave ──
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const savedJson = useRef(JSON.stringify(doc));
  const json = useMemo(() => JSON.stringify(doc), [doc]);
  const [retry, setRetry] = useState(0);
  const saveNow = useCallback(async () => {
    const current = JSON.stringify(docRef.current);
    if (current === savedJson.current) return true;
    setSaveState("saving");
    try {
      await savePage(pageId, JSON.parse(current));
      savedJson.current = current;
      setSaveState(JSON.stringify(docRef.current) === current ? "saved" : "dirty");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }, [pageId]);
  useEffect(() => {
    if (json === savedJson.current) return;
    setSaveState("dirty");
    const t = setTimeout(async () => {
      // A failed save (offline, server hiccup) retries on its own every few seconds.
      if (!(await saveNow())) setTimeout(() => setRetry((n) => n + 1), 4000);
    }, 900);
    return () => clearTimeout(t);
  }, [json, saveNow, retry]);

  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (JSON.stringify(docRef.current) !== savedJson.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, []);

  // ── Publish ──
  const [published, setPublished] = useState(initialPublished);
  const [publishedJson, setPublishedJson] = useState(() =>
    publishedContent ? JSON.stringify(asPageContent(publishedContent)) : null,
  );
  const [publishing, startPublish] = useTransition();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [overLimit, setOverLimit] = useState<number | null>(null);
  const [isPrimary, setIsPrimary] = useState(initialPrimary);
  const [pageSlug, setPageSlug] = useState(slug);
  const unpublishedChanges = published && publishedJson !== JSON.stringify(asPageContent(doc));

  // Premium touches the page uses that the current plan won't show live.
  const locked = useMemo(() => fitToPlanReport(doc, plan).locked, [doc, plan]);
  const [upsell, setUpsell] = useState<null | { tier: Plan; mode: "unlock" | "publish" }>(null);
  const upgradeCtx = useMemo(() => ({ openUpsell: (tier: Plan) => setUpsell({ tier, mode: "unlock" }) }), []);

  const onPublish = (force = false) => {
    if (!force && locked.length > 0) {
      setUpsell({ tier: "PLUS", mode: "publish" });
      return;
    }
    doPublish();
  };

  const doPublish = () =>
    startPublish(async () => {
      const snapshot = docRef.current;
      const res = await publishPage(pageId, snapshot);
      if (!res.ok) return;
      const s = JSON.stringify(snapshot);
      savedJson.current = s;
      setSaveState("saved");
      setPublishedJson(JSON.stringify(asPageContent(snapshot)));
      setPublished(true);
      setShareUrl(`${window.location.origin}${res.url}`);
      setOverLimit(res.offline ? res.maxPages : null);
    });

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el?.closest("input, textarea, select, [contenteditable=true]");
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z" && !typing) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (mod && e.key.toLowerCase() === "y" && !typing) {
        e.preventDefault();
        redo();
      } else if (mod && e.key.toLowerCase() === "s") {
        // Habitual ⌘S saves — publishing is always a deliberate click.
        e.preventDefault();
        void saveNow();
      } else if (e.key === "Escape" && !typing) {
        setSelected(null);
        setAdding(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, saveNow]);

  // ── Block operations ──
  const addBlock = (type: BlockType) => {
    const b = newBlock(type);
    commit((d) => {
      const i = selected ? d.blocks.findIndex((x) => x.id === selected) : -1;
      const blocks = [...d.blocks];
      blocks.splice(i >= 0 ? i + 1 : blocks.length, 0, b);
      return { ...d, blocks };
    });
    setAdding(false);
    select(b.id, "center");
  };
  const removeBlock = (id: string) => {
    commit((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }));
    if (selected === id) setSelected(null);
  };
  const duplicateBlock = (id: string) => {
    const copyId = crypto.randomUUID();
    commit((d) => {
      const i = d.blocks.findIndex((b) => b.id === id);
      if (i < 0) return d;
      const blocks = [...d.blocks];
      blocks.splice(i + 1, 0, { ...structuredClone(d.blocks[i]), id: copyId });
      return { ...d, blocks };
    });
    select(copyId, "center");
  };
  const moveBlock = (from: number, to: number) =>
    commit((d) => {
      if (to < 0 || to >= d.blocks.length || from === to) return d;
      const blocks = [...d.blocks];
      const [b] = blocks.splice(from, 1);
      blocks.splice(to, 0, b);
      return { ...d, blocks };
    });

  const rtl = useMemo(() => {
    if (doc.design?.dir === "rtl") return true;
    if (doc.design?.dir === "ltr") return false;
    const h = heroOf(doc);
    return looksRtl(`${toPlain(h?.name)} ${toPlain(h?.tagline)}`);
  }, [doc]);

  const publicPath = isPrimary ? `/${username}` : `/${username}/${pageSlug}`;
  const view: "block" | Panel = selectedBlock ? "block" : (panel ?? deskPanel);
  const mobileOpen = !!selectedBlock || panel !== null;

  const panelBody =
    view === "block" && selectedBlock ? (
      <div className="space-y-4">
        <div className="flex items-center gap-1">
          <IconBtn label="Move up" onClick={() => moveBlock(doc.blocks.indexOf(selectedBlock), doc.blocks.indexOf(selectedBlock) - 1)}>
            <ChevronUp className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Move down" onClick={() => moveBlock(doc.blocks.indexOf(selectedBlock), doc.blocks.indexOf(selectedBlock) + 1)}>
            <ChevronDown className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Duplicate" onClick={() => duplicateBlock(selectedBlock.id)}>
            <Copy className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Delete block" danger onClick={() => removeBlock(selectedBlock.id)}>
            <Trash2 className="h-4 w-4" />
          </IconBtn>
          {!allowed(BLOCK_TIER[selectedBlock.type], plan) && (
            <span className="ml-auto">
              <TierPill tier={BLOCK_TIER[selectedBlock.type]} />
            </span>
          )}
        </div>
        <BlockFields
          key={`${selectedBlock.id}:${version}`}
          block={selectedBlock}
          plan={plan}
          onPatch={(p) => patchBlock(selectedBlock.id, p)}
        />
      </div>
    ) : view === "design" ? (
      <DesignPanel
        design={doc.design ?? {}}
        plan={plan}
        rtl={rtl}
        avatarUrl={heroOf(doc)?.avatarUrl}
        onChange={patchDesign}
      />
    ) : (
      <Outline
        blocks={doc.blocks}
        plan={plan}
        selected={selected}
        onSelect={(id) => select(id, "center")}
        onMove={moveBlock}
        onDuplicate={duplicateBlock}
        onDelete={removeBlock}
        onAdd={() => setAdding(true)}
        footer={
          <PageSettings
            pageId={pageId}
            username={username}
            slug={pageSlug}
            isPrimary={isPrimary}
            published={published}
            onSlug={setPageSlug}
            onPrimary={() => setIsPrimary(true)}
            onUnpublished={() => setPublished(false)}
          />
        }
      />
    );

  const panelTitle =
    view === "block" && selectedBlock ? BLOCK_META[selectedBlock.type].label : view === "design" ? "Design studio" : "Blocks";

  return (
    <UpgradeContext.Provider value={upgradeCtx}>
    <div data-mode="muted" className="flex h-[100dvh] flex-col bg-bg text-text">
      {/* ── Header ── */}
      <header className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
        <Link href="/dashboard" aria-label="Back to dashboard" className="grid h-9 w-9 place-items-center rounded-xl text-text-muted hover:bg-surface hover:text-text">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="hidden min-w-0 items-center gap-2 sm:flex">
          <AuraMark className="h-6 w-6 text-primary" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium">{toPlain(heroOf(doc)?.name) || "Untitled"}</p>
            <p className="truncate text-[11px] text-text-muted">useaura.me{publicPath}</p>
          </div>
        </div>
        <SaveBadge state={saveState} />

        <div className="ml-auto flex items-center gap-1">
          <div className="mr-1 hidden items-center rounded-xl border border-border p-0.5 lg:flex">
            <button
              onClick={() => setDevice("mobile")}
              aria-label="Phone preview"
              className={cn("grid h-8 w-8 place-items-center rounded-lg", device === "mobile" ? "bg-surface-2 text-text" : "text-text-muted")}
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice("desktop")}
              aria-label="Desktop preview"
              className={cn("grid h-8 w-8 place-items-center rounded-lg", device === "desktop" ? "bg-surface-2 text-text" : "text-text-muted")}
            >
              <Monitor className="h-4 w-4" />
            </button>
          </div>
          <IconBtn label="Undo (⌘Z)" onClick={undo} disabled={hist.undo === 0} className="hidden sm:grid">
            <Undo2 className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Redo (⇧⌘Z)" onClick={redo} disabled={hist.redo === 0} className="hidden sm:grid">
            <Redo2 className="h-4 w-4" />
          </IconBtn>
          <a
            href={`/d/${draftToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-sm text-text-muted hover:bg-surface hover:text-text sm:inline-flex"
          >
            <Eye className="h-4 w-4" /> Preview
          </a>
          <button
            onClick={() => onPublish()}
            disabled={publishing}
            className="relative inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-ink transition hover:brightness-110 disabled:opacity-60"
          >
            {publishing && <Loader2 className="h-4 w-4 animate-spin" />}
            {published ? (unpublishedChanges ? "Update" : "Published") : "Publish"}
            {unpublishedChanges && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-bg" />}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* ── Canvas ── */}
        <div
          ref={canvasRef}
          className="relative min-h-0 flex-1 overflow-y-auto"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)", backgroundSize: "22px 22px" }}
        >
          {locked.length > 0 && (
            <button
              onClick={() => setUpsell({ tier: "PLUS", mode: "unlock" })}
              className="sticky top-0 z-30 flex w-full items-center gap-2 border-b border-primary/25 bg-bg/90 px-3 py-2 text-start text-xs backdrop-blur"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 truncate text-text-muted">
                <span className="text-text">Previewing {locked.length} premium {locked.length === 1 ? "touch" : "touches"}</span> — your live page shows
                them once unlocked: {locked.map((f) => f.label).join(", ")}
              </span>
              <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 font-medium text-primary-ink">Unlock</span>
            </button>
          )}
          <div className={cn("mx-auto flex min-h-full items-start justify-center p-3 sm:p-6", device === "desktop" ? "max-w-none" : "max-w-[440px]")}>
            <CanvasFrame device={device}>
              <div
                data-mode="vivid"
                className={cn("flex flex-col *:flex-1", device === "desktop" ? "min-h-[800px]" : "min-h-[720px]")}
                onClickCapture={(e) => {
                  // Tap a block to edit it; links don't navigate in the editor.
                  e.preventDefault();
                  e.stopPropagation();
                  const el = (e.target as HTMLElement).closest<HTMLElement>("[data-block-id]");
                  if (el?.dataset.blockId) select(el.dataset.blockId, "nearest");
                }}
              >
                <PageRenderer content={doc} embedded editable selectedId={selected ?? undefined} hideBadge={c.removeBadge} />
              </div>
            </CanvasFrame>
          </div>
        </div>

        {/* ── Panel: side column on desktop, docked sheet on phones ── */}
        <aside
          className={cn(
            "shrink-0 flex-col border-border bg-bg lg:flex lg:h-auto lg:w-[420px] lg:border-l",
            mobileOpen ? "flex border-t" : "hidden",
            expanded ? "h-[82dvh]" : "h-[56dvh]",
          )}
        >
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
            {view === "block" ? (
              <button onClick={() => setSelected(null)} aria-label="Back to blocks" className="grid h-8 w-8 place-items-center rounded-lg text-text-muted hover:text-text">
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div className="hidden rounded-xl bg-surface-2 p-0.5 lg:flex">
                {(["blocks", "design"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setDeskPanel(p);
                      setPanel((x) => (x ? p : x));
                    }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-sm capitalize",
                      view === p ? "bg-bg text-text shadow-sm" : "text-text-muted",
                    )}
                  >
                    {p === "blocks" ? <Layers className="h-4 w-4" /> : <Palette className="h-4 w-4" />}
                    {p}
                  </button>
                ))}
              </div>
            )}
            <p className={cn("flex-1 truncate font-display text-base font-medium", view !== "block" && "lg:hidden")}>{panelTitle}</p>
            <button
              onClick={() => setExpanded((x) => !x)}
              aria-label={expanded ? "Shrink panel" : "Expand panel"}
              className="grid h-8 w-8 place-items-center rounded-lg text-text-muted hover:text-text lg:hidden"
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                setSelected(null);
                setPanel(null);
              }}
              aria-label="Close panel"
              className="grid h-8 w-8 place-items-center rounded-lg text-text-muted hover:text-text lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{panelBody}</div>
        </aside>
      </div>

      {/* ── Phone toolbar ── */}
      <nav
        className="flex shrink-0 items-stretch justify-around gap-1 border-t border-border bg-bg px-2 pt-1.5 lg:hidden"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        <ToolBtn icon={Plus} label="Add" onClick={() => setAdding(true)} />
        <ToolBtn
          icon={Layers}
          label="Blocks"
          active={mobileOpen && view === "blocks"}
          onClick={() => {
            setSelected(null);
            setPanel((p) => (p === "blocks" && !selected ? null : "blocks"));
          }}
        />
        <ToolBtn
          icon={Palette}
          label="Design"
          active={mobileOpen && view === "design"}
          onClick={() => {
            setSelected(null);
            setPanel((p) => (p === "design" && !selected ? null : "design"));
          }}
        />
        <ToolBtn icon={Undo2} label="Undo" onClick={undo} disabled={hist.undo === 0} />
        <ToolBtn icon={Eye} label="Preview" href={`/d/${draftToken}`} />
      </nav>

      {adding && <AddBlockModal plan={plan} hasHero={doc.blocks.some((b) => b.type === "hero")} onPick={addBlock} onClose={() => setAdding(false)} />}
      {shareUrl && <PublishDialog url={shareUrl} overLimit={overLimit} onClose={() => setShareUrl(null)} />}
      {upsell && (
        <Upsell
          tier={upsell.tier}
          plan={plan}
          payments={payments}
          locked={locked}
          mode={upsell.mode}
          onClose={() => setUpsell(null)}
          onUnlocked={upsell.mode === "publish" ? doPublish : undefined}
          onPublishAnyway={() => {
            setUpsell(null);
            doPublish();
          }}
        />
      )}
    </div>
    </UpgradeContext.Provider>
  );
}

// ─────────────────────────── Canvas frame ───────────────────────────

const DESKTOP_W = 1280;

function CanvasFrame({ device, children }: { device: "mobile" | "desktop"; children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (device !== "desktop") return;
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, o.clientWidth / DESKTOP_W));
      setHeight(i.offsetHeight);
    });
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [device]);

  if (device === "desktop") {
    return (
      <div ref={outer} className="w-full overflow-hidden rounded-2xl border border-border shadow-2xl" style={{ height: height * scale || undefined }}>
        <div ref={inner} style={{ width: DESKTOP_W, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-hidden rounded-[36px] border-[7px] border-surface-2 shadow-2xl ring-1 ring-border">
      {children}
    </div>
  );
}

// ─────────────────────────── Outline (drag to reorder) ───────────────────────────

function Outline({
  blocks,
  plan,
  selected,
  onSelect,
  onMove,
  onDuplicate,
  onDelete,
  onAdd,
  footer,
}: {
  blocks: Block[];
  plan: Plan;
  selected: string | null;
  onSelect: (id: string) => void;
  onMove: (from: number, to: number) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  footer: React.ReactNode;
}) {
  const rows = useRef(new Map<string, HTMLDivElement>());
  const [dragging, setDragging] = useState<string | null>(null);

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(id);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const from = blocks.findIndex((b) => b.id === dragging);
    let to = from;
    blocks.forEach((b, i) => {
      const r = rows.current.get(b.id)?.getBoundingClientRect();
      if (!r) return;
      if (i < from && e.clientY < r.top + r.height / 2) to = Math.min(to, i);
      if (i > from && e.clientY > r.top + r.height / 2) to = Math.max(to, i);
    });
    if (to !== from) onMove(from, to);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5" onPointerMove={onPointerMove} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}>
        {blocks.map((b) => {
          const meta = BLOCK_META[b.type];
          const Icon = meta.icon;
          return (
            <div
              key={b.id}
              ref={(el) => {
                if (el) rows.current.set(b.id, el);
                else rows.current.delete(b.id);
              }}
              className={cn(
                "group flex items-center gap-1 rounded-xl border bg-surface-2/70 py-1 pr-1 pl-0.5 transition-shadow",
                selected === b.id ? "border-primary" : "border-border",
                dragging === b.id && "relative z-10 shadow-2xl ring-2 ring-primary/40",
              )}
            >
              <span
                onPointerDown={(e) => onPointerDown(e, b.id)}
                className="grid h-9 w-7 shrink-0 cursor-grab touch-none place-items-center text-text-muted active:cursor-grabbing"
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </span>
              <button onClick={() => onSelect(b.id)} className="flex min-w-0 flex-1 items-center gap-2.5 py-1 text-start">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-bg text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm text-text">
                    {meta.label}
                    {!allowed(BLOCK_TIER[b.type], plan) && <TierPill tier={BLOCK_TIER[b.type]} />}
                  </span>
                  <span className="block truncate text-[11px] text-text-muted">{blockSummary(b) || meta.description}</span>
                </span>
              </button>
              <IconBtn label="Duplicate" onClick={() => onDuplicate(b.id)} className="opacity-60 group-hover:opacity-100">
                <Copy className="h-3.5 w-3.5" />
              </IconBtn>
              <IconBtn label="Delete" danger onClick={() => onDelete(b.id)} className="opacity-60 group-hover:opacity-100">
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            </div>
          );
        })}
        {blocks.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-text-muted">An empty canvas. Add your first block.</p>
        )}
      </div>
      <button
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/50 bg-primary/5 py-3 text-sm text-text transition-colors hover:bg-primary/10"
      >
        <Plus className="h-4 w-4 text-primary" /> Add a block
      </button>
      {footer}
    </div>
  );
}

// ─────────────────────────── Page settings ───────────────────────────

function PageSettings({
  pageId,
  username,
  slug,
  isPrimary,
  published,
  onSlug,
  onPrimary,
  onUnpublished,
}: {
  pageId: string;
  username: string;
  slug: string;
  isPrimary: boolean;
  published: boolean;
  onSlug: (s: string) => void;
  onPrimary: () => void;
  onUnpublished: () => void;
}) {
  const [state, action, pending] = useActionState<SlugState, FormData>(updatePageSlug.bind(null, pageId), undefined);
  const [busy, start] = useTransition();
  useEffect(() => {
    if (state?.ok && state.slug) onSlug(state.slug);
  }, [state, onSlug]);

  return (
    <details className="group rounded-xl border border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm text-text-muted select-none">
        Page settings
        <span className="text-[11px] transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="space-y-3 border-t border-border p-3">
        {isPrimary ? (
          <p className="text-xs text-text-muted">
            This is your <span className="text-text">main page</span> — it lives at useaura.me/{username}.
          </p>
        ) : (
          <>
            <form action={action} className="flex items-center gap-2">
              <span className="shrink-0 text-xs text-text-muted">/{username}/</span>
              <input name="slug" defaultValue={slug} className={cn(fieldCls, "h-9")} aria-label="Page address" />
              <button disabled={pending} className="h-9 shrink-0 rounded-lg border border-border px-3 text-xs text-text hover:bg-surface-2">
                {pending ? "…" : "Save"}
              </button>
            </form>
            {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
            {state?.ok && <p className="text-xs text-primary">Address updated.</p>}
            <button
              disabled={busy}
              onClick={() =>
                start(async () => {
                  await setPrimaryPage(pageId);
                  onPrimary();
                })
              }
              className="w-full rounded-lg border border-border py-2 text-xs text-text hover:bg-surface-2"
            >
              Make this my main page
            </button>
          </>
        )}
        <div className="flex gap-2">
          {published && (
            <button
              disabled={busy}
              onClick={() =>
                start(async () => {
                  await unpublishPage(pageId);
                  onUnpublished();
                })
              }
              className="flex-1 rounded-lg border border-border py-2 text-xs text-text-muted hover:text-text"
            >
              Unpublish
            </button>
          )}
          <form
            action={deletePage.bind(null, pageId)}
            className="flex-1"
            onSubmit={(e) => {
              if (!confirm("Delete this page? This can't be undone.")) e.preventDefault();
            }}
          >
            <button className="w-full rounded-lg border border-red-500/30 py-2 text-xs text-red-400 hover:bg-red-500/10">Delete page</button>
          </form>
        </div>
      </div>
    </details>
  );
}

// ─────────────────────────── Add block ───────────────────────────

function AddBlockModal({
  plan,
  hasHero,
  onPick,
  onClose,
}: {
  plan: Plan;
  hasHero: boolean;
  onPick: (t: BlockType) => void;
  onClose: () => void;
}) {
  const groups: ("Essentials" | "Sections" | "Flair")[] = ["Essentials", "Sections", "Flair"];
  return (
    <Modal title="Add a block" onClose={onClose}>
      <div className="space-y-5">
        {groups.map((g) => (
          <section key={g}>
            <p className="mb-2 text-[11px] font-semibold tracking-wider text-text-muted uppercase">{g}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(BLOCK_META) as BlockType[])
                .filter((t) => BLOCK_META[t].group === g && (t !== "hero" || !hasHero))
                .map((t) => {
                  const meta = BLOCK_META[t];
                  const Icon = meta.icon;
                  const tier = BLOCK_TIER[t];
                  return (
                    <button
                      key={t}
                      onClick={() => onPick(t)}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-2xl border border-border bg-surface-2/70 p-3 text-start transition-colors hover:border-primary/50",
                      )}
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/12 text-primary">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span>
                        <span className="block text-sm text-text">{meta.label}</span>
                        <span className="block text-[11px] leading-snug text-text-muted">{meta.description}</span>
                      </span>
                      {!allowed(tier, plan) && (
                        <span className="absolute top-2.5 right-2.5">
                          <TierPill tier={tier} />
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </Modal>
  );
}

// ─────────────────────────── Bits ───────────────────────────

function SaveBadge({ state }: { state: SaveState }) {
  const map = {
    saved: { icon: Cloud, text: "Saved", cls: "text-text-muted" },
    dirty: { icon: Cloud, text: "Editing…", cls: "text-text-muted" },
    saving: { icon: Loader2, text: "Saving…", cls: "text-text-muted" },
    error: { icon: CloudOff, text: "Not saved — retrying on next edit", cls: "text-red-400" },
  }[state];
  const Icon = map.icon;
  return (
    <span className={cn("ml-1 hidden items-center gap-1 text-xs md:inline-flex", map.cls)} aria-live="polite">
      <Icon className={cn("h-3.5 w-3.5", state === "saving" && "animate-spin")} />
      {map.text}
    </span>
  );
}

function IconBtn({
  label,
  onClick,
  children,
  disabled,
  danger,
  className,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 disabled:opacity-30",
        danger ? "hover:text-red-400" : "hover:text-text",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  onClick,
  href,
  active,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const cls = cn(
    "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] transition-colors disabled:opacity-30",
    active ? "bg-surface-2 text-text" : "text-text-muted hover:bg-surface hover:text-text",
  );
  const inner = (
    <>
      <Icon className="h-5 w-5" />
      {label}
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}
