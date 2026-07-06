"use client";

import { useActionState } from "react";
import {
  changePassword,
  saveBookingSettings,
  saveSettings,
  type SettingsState,
} from "@/lib/actions/settings";
import { Button, Card, Input, Label, Select } from "@/components/ui";

function Notes({ state }: { state: SettingsState }) {
  if (state?.error)
    return <p className="rounded-xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">{state.error}</p>;
  if (state?.saved)
    return <p className="rounded-xl bg-mint/10 px-3.5 py-2.5 text-sm text-mint">נשמר ✓</p>;
  return null;
}

export function SettingsForms({
  business,
}: {
  business: {
    name: string;
    ownerName: string;
    slug: string;
    phone: string;
    email: string;
    autoConfirm: boolean;
    slotStepMin: number;
    bufferMin: number;
  };
}) {
  const [bizState, bizAction, bizPending] = useActionState<SettingsState, FormData>(saveSettings, null);
  const [bookState, bookAction, bookPending] = useActionState<SettingsState, FormData>(saveBookingSettings, null);
  const [passState, passAction, passPending] = useActionState<SettingsState, FormData>(changePassword, null);

  return (
    <>
      <Card>
        <h2 className="mb-4 font-bold">פרטי העסק</h2>
        <form action={bizAction} className="flex flex-col gap-4">
          <Notes state={bizState} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="businessName">שם העסק</Label>
              <Input id="businessName" name="businessName" defaultValue={business.name} required />
            </div>
            <div>
              <Label htmlFor="ownerName">השם שלך</Label>
              <Input id="ownerName" name="ownerName" defaultValue={business.ownerName} required />
            </div>
          </div>
          <div>
            <Label htmlFor="slug">כתובת העמוד</Label>
            <Input id="slug" name="slug" dir="ltr" defaultValue={business.slug} required />
            <p className="mt-1 text-xs text-yellow-500/80">
              שימו לב: שינוי הכתובת ישבור קישורים ששיתפתם בעבר.
            </p>
          </div>
          <div>
            <Label htmlFor="phone">טלפון (פנימי, לא מוצג בעמוד)</Label>
            <Input id="phone" name="phone" dir="ltr" defaultValue={business.phone} />
          </div>
          <p className="text-xs text-ink-2">אימייל התחברות: <span dir="ltr">{business.email}</span></p>
          <Button type="submit" disabled={bizPending} className="self-start">
            {bizPending ? "שומרים…" : "שמירה"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-1 font-bold">הגדרות זימון תורים</h2>
        <p className="mb-4 text-sm text-ink-2">איך המערכת מתנהגת כשלקוח קובע תור.</p>
        <form action={bookAction} className="flex flex-col gap-4">
          <Notes state={bookState} />
          <div>
            <Label>אישור תורים</Label>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm has-checked:border-halo has-checked:bg-halo/8">
                <input type="radio" name="autoConfirm" value="auto" defaultChecked={business.autoConfirm} className="accent-[#f0b429]" />
                <span>
                  <b>אישור אוטומטי</b> — התור נקבע מיד. הלקוח מקבל אישור בו־במקום.
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm has-checked:border-halo has-checked:bg-halo/8">
                <input type="radio" name="autoConfirm" value="manual" defaultChecked={!business.autoConfirm} className="accent-[#f0b429]" />
                <span>
                  <b>אישור ידני</b> — כל תור ממתין לאישור שלך ביומן.
                </span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="slotStepMin">קפיצות משבצות</Label>
              <Select id="slotStepMin" name="slotStepMin" defaultValue={business.slotStepMin}>
                <option value={10}>כל 10 דקות</option>
                <option value={15}>כל 15 דקות</option>
                <option value={20}>כל 20 דקות</option>
                <option value={30}>כל 30 דקות</option>
                <option value={60}>כל שעה</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="bufferMin">הפסקה בין תורים</Label>
              <Select id="bufferMin" name="bufferMin" defaultValue={business.bufferMin}>
                <option value={0}>ללא</option>
                <option value={5}>5 דקות</option>
                <option value={10}>10 דקות</option>
                <option value={15}>15 דקות</option>
                <option value={30}>30 דקות</option>
              </Select>
            </div>
          </div>
          <Button type="submit" disabled={bookPending} className="self-start">
            {bookPending ? "שומרים…" : "שמירה"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 font-bold">החלפת סיסמה</h2>
        <form action={passAction} className="flex flex-col gap-4">
          <Notes state={passState} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="current">סיסמה נוכחית</Label>
              <Input id="current" name="current" type="password" dir="ltr" required />
            </div>
            <div>
              <Label htmlFor="next">סיסמה חדשה</Label>
              <Input id="next" name="next" type="password" dir="ltr" minLength={8} required />
            </div>
          </div>
          <Button type="submit" disabled={passPending} className="self-start">
            {passPending ? "מעדכנים…" : "עדכון סיסמה"}
          </Button>
        </form>
      </Card>
    </>
  );
}
