import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SettingsForm } from "@/components/account/settings-form";

export default async function SettingsPage() {
  const user = await getSession();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-medium tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-text-muted">Manage your account.</p>
      <div className="mt-6">
        <SettingsForm
          name={user.name ?? ""}
          username={user.username}
          email={user.email}
        />
      </div>
    </div>
  );
}
