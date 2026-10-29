"use client";

import dynamic from "next/dynamic";

// The canvas/WebGL engine is its own chunk, fetched only by pages that use a
// live background — every other page pays zero bytes for it.
const LiveBgImpl = dynamic(() => import("./live-bg-impl"), { ssr: false });
const CursorImpl = dynamic(() => import("./cursor-impl"), { ssr: false });

export function LiveBackground({ variant, fixed }: { variant: string; fixed: boolean }) {
  return <LiveBgImpl variant={variant} fixed={fixed} />;
}

export function CustomCursor({ variant }: { variant: string }) {
  return <CursorImpl variant={variant} />;
}
