/**
 * Constrains a number to an inclusive range.
 * @param value - Input number.
 * @param min - Lower bound.
 * @param max - Upper bound.
 * @returns Clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Clamps and rounds a channel to the 8-bit RGB range.
 * @param value - Channel value.
 * @returns Integer channel in `[0, 255]`.
 */
export function clampChannel(value: number): number {
  return Math.round(clamp(value, 0, 255))
}

/**
 * Clamps a percentage channel.
 * @param value - Percentage value.
 * @returns Value in `[0, 100]`.
 */
export function clampPercent(value: number): number {
  return clamp(value, 0, 100)
}

/**
 * Clamps a unit interval value.
 * @param value - Unit value.
 * @returns Value in `[0, 1]`.
 */
export function clampUnit(value: number): number {
  return clamp(value, 0, 1)
}

/**
 * Normalizes hue values to the canonical `[0, 360)` interval.
 * @param value - Hue in degrees.
 * @returns Normalized hue.
 */
export function normalizeHue(value: number): number {
  const hue = value % 360
  return hue < 0 ? hue + 360 : hue
}

/**
 * Rounds a percentage value after clamping.
 * @param value - Percentage value.
 * @returns Integer percentage in `[0, 100]`.
 */
export function roundPercent(value: number): number {
  return Math.round(clampPercent(value))
}

/**
 * Rounds alpha to millisecond precision for stable string output.
 * @param value - Alpha value.
 * @returns Alpha in `[0, 1]` rounded to three decimals.
 */
export function roundAlpha(value: number): number {
  return Math.round(clampUnit(value) * 1000) / 1000
}
