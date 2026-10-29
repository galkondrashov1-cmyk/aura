// Shared by the proxy and the server session helpers — kept free of database
// imports so the proxy bundle stays small.
export const SESSION_COOKIE = "aura_session";
// "Remember me" (default) → 90 days. Unchecked → still persisted for a week.
export const MAX_AGE = 60 * 60 * 24 * 90;
export const SHORT_AGE = 60 * 60 * 24 * 7;
