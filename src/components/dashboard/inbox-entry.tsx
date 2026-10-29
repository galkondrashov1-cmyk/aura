"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteSubmission } from "@/lib/actions/inbox";

/**
 * One inbox row. Deleting hides it right away and then syncs with the server,
 * so the list never shows an entry that's already gone.
 */
export function InboxEntry({ id, children }: { id: string; children: React.ReactNode }) {
  const router = useRouter();
  const [gone, setGone] = useState(false);
  const [pending, start] = useTransition();
  if (gone) return null;
  return (
    <div className="flex gap-3 p-4" aria-busy={pending}>
      {children}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("למחוק את הפנייה?")) return;
          start(async () => {
            const res = await deleteSubmission(id);
            if (res.ok) {
              setGone(true);
              router.refresh();
            }
          });
        }}
        aria-label="מחיקת פנייה"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-red-700 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
