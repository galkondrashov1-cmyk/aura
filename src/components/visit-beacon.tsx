"use client";

import { useEffect } from "react";

/** Fire-and-forget page-view ping (once per mount). */
export function VisitBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const body = JSON.stringify({
      slug,
      device: window.innerWidth < 768 ? "mobile" : "desktop",
    });
    const sent = navigator.sendBeacon?.(
      "/api/visit",
      new Blob([body], { type: "application/json" }),
    );
    if (!sent) {
      fetch("/api/visit", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [slug]);
  return null;
}
