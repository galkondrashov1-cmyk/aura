// vCard 3.0 for the Contact block: what phones import as a new contact.
import type { BlockOf } from "@/lib/blocks";

const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

export function vcard(b: BlockOf<"contact">, pageUrl?: string): string {
  const line = (k: string, v?: string) => (v?.trim() ? [`${k}:${esc(v.trim())}`] : []);
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${esc(b.name.trim())};;;`,
    ...line("FN", b.name),
    ...line("ORG", b.org),
    ...line("TITLE", b.role),
    ...line("TEL;TYPE=CELL", b.phone),
    ...line("EMAIL;TYPE=INTERNET", b.email),
    ...line("URL", b.site),
    ...(b.address?.trim() ? [`ADR;TYPE=WORK:;;${esc(b.address.trim())};;;;`] : []),
    ...line("URL", pageUrl),
    "END:VCARD",
  ].join("\r\n");
}
