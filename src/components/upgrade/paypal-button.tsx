"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { activateSubscription, type ActivateState } from "@/lib/actions/subscription";

declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  }
}

let sdkPromise: Promise<void> | null = null;
function loadSdk(clientId: string): Promise<void> {
  if (window.paypal) return Promise.resolve();
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription&components=buttons`;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("PayPal SDK failed to load"));
      document.head.appendChild(s);
    });
  }
  return sdkPromise;
}

/** Renders a real PayPal Subscribe button for the given billing-plan id. */
export function PayPalSubscribe({ clientId, planId }: { clientId: string; planId: string }) {
  const host = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [subId, setSubId] = useState("");
  const [failed, setFailed] = useState(false);
  const [state, action, pending] = useActionState<ActivateState, FormData>(
    activateSubscription,
    undefined,
  );

  useEffect(() => {
    let cancelled = false;
    loadSdk(clientId)
      .then(() => {
        if (cancelled || !host.current || !window.paypal) return;
        host.current.innerHTML = "";
        window.paypal
          .Buttons({
            style: { shape: "pill", color: "black", label: "subscribe", height: 40 },
            createSubscription: (_d: unknown, a: { subscription: { create: (o: { plan_id: string }) => Promise<string> } }) =>
              a.subscription.create({ plan_id: planId }),
            onApprove: (data: { subscriptionID?: string }) => {
              if (data.subscriptionID) {
                setSubId(data.subscriptionID);
                // Submit to the server action, which re-verifies with PayPal.
                setTimeout(() => form.current?.requestSubmit(), 0);
              }
            },
          })
          .render(host.current);
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [clientId, planId]);

  return (
    <div>
      <div ref={host} />
      {failed && (
        <p className="mt-2 text-center text-xs text-red-400">
          PayPal failed to load — refresh and try again.
        </p>
      )}
      {pending && <p className="mt-2 text-center text-xs text-text-muted">Confirming with PayPal…</p>}
      {state?.error && <p className="mt-2 text-center text-xs text-red-400">{state.error}</p>}
      <form ref={form} action={action} className="hidden">
        <input type="hidden" name="subscriptionId" value={subId} readOnly />
      </form>
    </div>
  );
}
