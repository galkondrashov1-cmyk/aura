import Link from "next/link";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col px-5 py-6 sm:px-8">
      <Link href="/" className="self-start">
        <Logo />
      </Link>
      <div className="my-auto py-16">
        <p className="font-display text-[clamp(6rem,22vw,16rem)] leading-[0.8] font-black text-primary-text">404</p>
        <h1 className="display-l mt-6">העמוד הזה לא קיים.</h1>
        <p className="mt-4 max-w-md text-lg text-text-muted">אולי הכתובת שגויה, ואולי הוא עוד לא פורסם.</p>
        <Link href="/" className={buttonClasses("secondary", "md", "mt-8")}>
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
