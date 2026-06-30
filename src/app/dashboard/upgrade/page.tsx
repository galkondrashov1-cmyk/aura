import { getSession } from "@/lib/session";
import { asPlan } from "@/lib/plans";
import { UpgradePlans } from "@/components/upgrade/plans";

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ changed?: string }>;
}) {
  const user = await getSession();
  const current = asPlan(user?.plan);
  const changed = (await searchParams)?.changed === "1";

  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-medium tracking-tight">Upgrade</h1>
        <p className="mt-1 text-sm text-text-muted">
          Every plan is free while we&apos;re in early access. Pick one to unlock its
          features now, no card required.
        </p>
      </div>
      {changed && (
        <p className="mt-4 inline-block rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary">
          Plan updated. Your new features are unlocked.
        </p>
      )}
      <div className="mt-8">
        <UpgradePlans current={current} />
      </div>
    </div>
  );
}
