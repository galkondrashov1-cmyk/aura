import { BRAND } from "@/lib/brand";

/** Canonical origin for absolute links (emails, metadata). */
export const SITE_URL = (process.env.SITE_URL || `https://${BRAND.domain}`).replace(/\/$/, "");
