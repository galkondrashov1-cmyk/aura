import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { RESERVED_USERNAMES } from "@/lib/reserved";

// Live "is this name free?" check for the signup form. Public pages already
// reveal which names exist, so this leaks nothing new.
export async function GET(req: NextRequest) {
  const u = (req.nextUrl.searchParams.get("u") ?? "").trim().toLowerCase();
  if (!/^[a-z0-9_]{3,20}$/.test(u)) return NextResponse.json({ available: false, reason: "format" });
  if (RESERVED_USERNAMES.has(u)) return NextResponse.json({ available: false, reason: "reserved" });
  const t0 = performance.now();
  const taken = await prisma.user.findUnique({ where: { username: u }, select: { id: true } });
  // Server-Timing exposes the database round trip (helps pick the function region).
  return NextResponse.json(
    { available: !taken, reason: taken ? "taken" : null },
    { headers: { "Server-Timing": `db;dur=${(performance.now() - t0).toFixed(1)}` } },
  );
}
