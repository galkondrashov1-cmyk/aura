import { PrismaClient } from "@prisma/client";

// Deploys without a DATABASE_URL still build (marketing pages don't query);
// the placeholder keeps the client constructor from throwing at import time.
process.env.DATABASE_URL ??=
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
