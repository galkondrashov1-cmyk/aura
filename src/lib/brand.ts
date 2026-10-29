// The product's name and address live here and only here. Renaming the
// product means editing these two values — nothing in the UI hardcodes them.
export const BRAND = {
  name: "AURA",
  domain: "useaura.me",
} as const;

/** "Title · Brand" for page metadata. */
export const titled = (title: string) => `${title} · ${BRAND.name}`;
