import { clampChannel, clampPercent, clampUnit, normalizeHue, roundAlpha, roundPercent } from "../core/math-utils.js"
import type { HSL, HSLA, RGB, RGBA } from "../core/types.js"

export function rgbToHex(rgb: RGB): string {
  const toHex = (value: number) => clampChannel(value).toString(16).padStart(2, "0")
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

export function rgbaToHexa(rgba: RGBA): string {
  const alpha = clampChannel(clampUnit(rgba.a) * 255)
  const toHex = (value: number) => clampChannel(value).toString(16).padStart(2, "0")
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${toHex(alpha)}`
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = clampChannel(rgb.r) / 255
  const g = clampChannel(rgb.g) / 255
  const b = clampChannel(rgb.b) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60
        break
      case g:
        h = ((b - r) / delta + 2) * 60
        break
      default:
        h = ((r - g) / delta + 4) * 60
        break
    }
  }

  return {
    h: normalizeHue(h),
    s: roundPercent(s * 100),
    l: roundPercent(l * 100),
  }
}

export function hslToRgb(hsl: HSL): RGB {
  const h = normalizeHue(hsl.h) / 360
  const s = clampUnit(hsl.s / 100)
  const l = clampUnit(hsl.l / 100)

  if (s === 0) {
    const gray = clampChannel(l * 255)
    return { r: gray, g: gray, b: gray }
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  const hueToRgb = (t: number): number => {
    let value = t
    if (value < 0) value += 1
    if (value > 1) value -= 1
    if (value < 1 / 6) return p + (q - p) * 6 * value
    if (value < 1 / 2) return q
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6
    return p
  }

  return {
    r: clampChannel(hueToRgb(h + 1 / 3) * 255),
    g: clampChannel(hueToRgb(h) * 255),
    b: clampChannel(hueToRgb(h - 1 / 3) * 255),
  }
}

export function rgbToHsla(rgba: RGBA): HSLA {
  return {
    ...rgbToHsl(rgba),
    a: roundAlpha(rgba.a),
  }
}

export function formatRgb(rgb: RGB): string {
  return `rgb(${clampChannel(rgb.r)}, ${clampChannel(rgb.g)}, ${clampChannel(rgb.b)})`
}

export function formatRgba(rgba: RGBA): string {
  return `rgba(${clampChannel(rgba.r)}, ${clampChannel(rgba.g)}, ${clampChannel(rgba.b)}, ${roundAlpha(rgba.a)})`
}

export function formatHsl(hsl: HSL): string {
  const hue = Math.round(normalizeHue(hsl.h))
  const saturation = Math.round(clampPercent(hsl.s))
  const lightness = Math.round(clampPercent(hsl.l))
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function formatHsla(hsla: HSLA): string {
  return `${formatHsl(hsla).replace("hsl", "hsla").replace(")", "")}, ${roundAlpha(hsla.a)})`
}
