/** Is a scheduled link live at time t? Invalid or missing bounds never hide it. */
export const inWindow = (from: string | undefined, until: string | undefined, t: number) =>
  (!from || !(t < Date.parse(from))) && (!until || !(t >= Date.parse(until)));
