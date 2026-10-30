import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { resetLink } from "@/lib/reset-token";
import { CopyLinkButton } from "@/components/copy-link-button";

// Hand-delivered password reset (until password emails are switched on).
export default async function AdminResetLink({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id = "" } = await searchParams;
  const user = id ? await prisma.user.findUnique({ where: { id }, select: { id: true, username: true, email: true } }) : null;
  const link = user ? await resetLink(user.id) : null;

  return (
    <div className="max-w-xl">
      <Link href="/admin/users" className="text-sm text-text-muted hover:text-text">
        → משתמשים
      </Link>
      <h1 className="mt-3 font-display text-[2rem] leading-tight font-bold tracking-tight">קישור לאיפוס סיסמה</h1>
      {user && link ? (
        <>
          <p className="mt-1 text-sm text-text-muted">
            עבור @{user.username} ({user.email}). עובד פעם אחת, למשך שעה. שלחו אותו רק לכתובת המייל הזו.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-1.5 ps-3">
            <span className="min-w-0 flex-1 truncate text-sm">{link}</span>
            <CopyLinkButton url={link} />
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-text-muted">המשתמש לא נמצא.</p>
      )}
    </div>
  );
}
