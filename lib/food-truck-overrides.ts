/** Normalized name → display overrides when CMS names haven’t been updated yet. */

export function normalizeFoodTruckName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

const DISPLAY_NAME: Record<string, string> = {
  "fryer and ice": "Ice Ice Baby",
};

export function getFoodTruckDisplayName(name: string): string {
  const key = normalizeFoodTruckName(name);
  return DISPLAY_NAME[key] ?? name;
}

const SAUCED_BLURB = "I get my burgers from a pizza place.";

export function getFoodTruckDisplayBlurb(
  name: string,
  blurb: string | null,
): string | null {
  const key = normalizeFoodTruckName(name);
  if (key === "sauce'd" || key === "sauced" || key.startsWith("sauced ")) {
    return SAUCED_BLURB;
  }
  return blurb;
}
