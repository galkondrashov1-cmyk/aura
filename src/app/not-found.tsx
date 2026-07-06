import Link from "next/link";
import { HilaLogo } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <HilaLogo size={40} />
      <h1 className="text-3xl font-extrabold">העמוד לא נמצא</h1>
      <p className="max-w-sm text-ink-2">
        אולי הכתובת השתנתה, או שהעסק עדיין לא פרסם את העמוד שלו.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="rounded-xl bg-halo px-5 py-2.5 font-bold text-night hover:bg-halo-2">
          לעמוד הבית
        </Link>
        <Link href="/signup" className="rounded-xl border border-line px-5 py-2.5 font-semibold hover:bg-white/5">
          יצירת עמוד משלך
        </Link>
      </div>
    </div>
  );
}
