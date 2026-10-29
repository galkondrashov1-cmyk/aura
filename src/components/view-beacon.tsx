"use client";

import { useEffect } from "react";

const WINDOW_MS = 30 * 60 * 1000;

/**
 * Fires one page-view event per visitor per 30 minutes (reloads don't inflate
 * numbers). Sends the real document.referrer — the request's own Referer
 * header is just the profile page itself.
 */
export function ViewBeacon({ pageId }: { pageId: string }) {
  useEffect(() => {
    const key = `aura_v_${pageId}`;
    try {
      const last = Number(localStorage.getItem(key) ?? 0);
      if (Date.now() - last < WINDOW_MS) return;
      localStorage.setItem(key, String(Date.now()));
    } catch {
      /* storage blocked — still count the view */
    }
    const body = JSON.stringify({ pageId, ref: document.referrer || undefined });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/track-view", blob)) {
      fetch("/api/track-view", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pageId]);

  return null;
}
