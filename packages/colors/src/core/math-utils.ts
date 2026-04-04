export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function clampChannel(value: number): number {
  return Math.round(clamp(value, 0, 255))
}

export function clampPercent(value: number): number {
  return clamp(value, 0, 100)
}

export function clampUnit(value: number): number {
  return clamp(value, 0, 1)
}

export function normalizeHue(value: number): number {
  const hue = value % 360
  return hue < 0 ? hue + 360 : hue
}

export function roundPercent(value: number): number {
  return Math.round(clampPercent(value))
}

export function roundAlpha(value: number): number {
  return Math.round(clampUnit(value) * 1000) / 1000
}
