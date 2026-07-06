import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { SettingsForms } from "@/components/settings-forms";

export const metadata: Metadata = { title: "הגדרות" };

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const biz = await prisma.business.findUnique({ where: { id: session.id } });
  if (!biz) redirect("/login");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <h1 className="text-2xl font-extrabold">הגדרות</h1>
      <SettingsForms
        business={{
          name: biz.name,
          ownerName: biz.ownerName,
          slug: biz.slug,
          phone: biz.phone ?? "",
          email: biz.email,
          autoConfirm: biz.autoConfirm,
          slotStepMin: biz.slotStepMin,
          bufferMin: biz.bufferMin,
        }}
      />
    </div>
  );
}
