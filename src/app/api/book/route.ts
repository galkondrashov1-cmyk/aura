import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { freeSlots, jerusalemToUtc } from "@/lib/slots";
import { asPlan, caps } from "@/lib/plans";
import { normalizePhone } from "@/lib/utils";

const bookSchema = z.object({
  slug: z.string().min(1),
  serviceId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  minutes: z.number().int().min(0).max(24 * 60),
  name: z.string().min(2, "איך קוראים לך?").max(60),
  phone: z.string(),
  code: z.string().length(4, "קוד בן 4 ספרות"),
});

// POST /api/book — verifies the OTP, re-checks the slot is still free, and
// creates the appointment (PENDING or CONFIRMED per the business setting).
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "פרטים לא תקינים" },
      { status: 400 },
    );
  }
  const { slug, serviceId, date, minutes, name, code } = parsed.data;

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return NextResponse.json({ error: "מספר טלפון לא תקין" }, { status: 400 });

  const biz = await prisma.business.findUnique({
    where: { slug },
    select: { id: true, plan: true, autoConfirm: true, site: { select: { published: true } } },
  });
  if (!biz?.site?.published || !caps(asPlan(biz.plan)).booking) {
    return NextResponse.json({ error: "העסק לא מקבל תורים אונליין" }, { status: 404 });
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId: biz.id, active: true },
  });
  if (!service) return NextResponse.json({ error: "השירות לא נמצא" }, { status: 404 });

  // OTP check — latest unexpired code for this phone must match.
  const otp = await prisma.otpCode.findFirst({
    where: { phone, expiresAt: { gte: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp || otp.code !== code) {
    return NextResponse.json({ error: "קוד האימות שגוי או שפג תוקפו" }, { status: 400 });
  }

  // Slot still free? (someone may have grabbed it while the customer typed)
  const slots = await freeSlots({ businessId: biz.id, dateStr: date, durationMin: service.durationMin });
  if (!slots.some((s) => s.minutes === minutes)) {
    return NextResponse.json(
      { error: "המשבצת הזו נתפסה הרגע — בחרו שעה אחרת", slotTaken: true },
      { status: 409 },
    );
  }

  const startsAt = jerusalemToUtc(date, minutes);
  const endsAt = new Date(startsAt.getTime() + service.durationMin * 60_000);
  const status = biz.autoConfirm ? "CONFIRMED" : "PENDING";

  const appt = await prisma.appointment.create({
    data: {
      businessId: biz.id,
      serviceId: service.id,
      customerName: name,
      customerPhone: phone,
      startsAt,
      endsAt,
      status,
    },
  });

  // burn the code
  await prisma.otpCode.deleteMany({ where: { phone } });

  return NextResponse.json({
    ok: true,
    status,
    cancelToken: appt.cancelToken,
    startsAt: appt.startsAt.toISOString(),
  });
}
