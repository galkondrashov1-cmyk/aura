"use client";

import { useEffect } from "react";

/** Fires a single page-view event when a public page mounts. */
export function ViewBeacon({ pageId }: { pageId: string }) {
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pageId }),
      keepalive: true,
    }).catch(() => {});
  }, [pageId]);

  return null;
}
