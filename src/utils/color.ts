/**
 * Generates a consistent bright color based on a seed string.
 * The same seed will always produce the same color.
 * Colors are vibrant and visually distinct.
 *
 * @param seed - A string used to generate the color
 * @returns A hex color string (e.g., "#FF7800")
 */
export function generateBrightColor(seed: string): string {
  // Create a hash from the seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use HSL color model for more vibrant colors
  // Hue: Full spectrum (0-360)
  // Saturation: High (70-100%)
  // Lightness: Medium-high (45-65%) for vibrant but not too light colors

  const hue = Math.abs(hash % 360);
  const saturation = 85 + (hash % 15); // 85-100%
  const lightness = 55 + ((hash >> 8) % 10); // 55-65%

  // Convert HSL to RGB
  const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness / 100 - c / 2;

  let r, g, b;
  if (hue < 60) {
    [r, g, b] = [c, x, 0];
  } else if (hue < 120) {
    [r, g, b] = [x, c, 0];
  } else if (hue < 180) {
    [r, g, b] = [0, c, x];
  } else if (hue < 240) {
    [r, g, b] = [0, x, c];
  } else if (hue < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Convert to RGB values (0-255)
  const rInt = Math.round((r + m) * 255);
  const gInt = Math.round((g + m) * 255);
  const bInt = Math.round((b + m) * 255);

  // Format as hex color
  return `#${rInt.toString(16).padStart(2, "0")}${gInt.toString(16).padStart(2, "0")}${bInt
    .toString(16)
    .padStart(2, "0")}`;
}
