import { hslToRgb } from "../conversion/color-conversion.js"
import { clampChannel, clampPercent, clampUnit, normalizeHue, roundAlpha } from "../core/math-utils.js"
import type { ColorInput, ColorState, RGB, RGBA } from "../core/types.js"

function toState(rgb: RGB, alpha = 1): ColorState {
  return {
    rgb: {
      r: clampChannel(rgb.r),
      g: clampChannel(rgb.g),
      b: clampChannel(rgb.b),
    },
    alpha: roundAlpha(alpha),
  }
}

function parseHexToState(input: string): ColorState | null {
  const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.exec(
    input.trim(),
  )

  if (!match) {
    return null
  }

  const value = match[1]!

  if (value.length === 3 || value.length === 4) {
    const r = Number.parseInt(value[0]! + value[0]!, 16)
    const g = Number.parseInt(value[1]! + value[1]!, 16)
    const b = Number.parseInt(value[2]! + value[2]!, 16)
    const a = value.length === 4 ? Number.parseInt(value[3]! + value[3]!, 16) / 255 : 1
    return toState({ r, g, b }, a)
  }

  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  const a = value.length === 8 ? Number.parseInt(value.slice(6, 8), 16) / 255 : 1

  return toState({ r, g, b }, a)
}

function parseRgbToState(input: string): ColorState | null {
  const match = /^rgba?\(\s*([+-]?\d{1,3})\s*,\s*([+-]?\d{1,3})\s*,\s*([+-]?\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i.exec(
    input.trim(),
  )

  if (!match) {
    return null
  }

  const alpha = match[4] === undefined ? 1 : clampUnit(Number(match[4]))
  return toState(
    {
      r: clampChannel(Number(match[1])),
      g: clampChannel(Number(match[2])),
      b: clampChannel(Number(match[3])),
    },
    alpha,
  )
}

function parseHslToState(input: string): ColorState | null {
  const match = /^hsla?\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)%\s*,\s*([+-]?\d+(?:\.\d+)?)%(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i.exec(
    input.trim(),
  )

  if (!match) {
    return null
  }

  const alpha = match[4] === undefined ? 1 : clampUnit(Number(match[4]))
  const rgb = hslToRgb({
    h: normalizeHue(Number(match[1])),
    s: clampPercent(Number(match[2])),
    l: clampPercent(Number(match[3])),
  })

  return toState(rgb, alpha)
}

function stateFromObject(input: Exclude<ColorInput, string>): ColorState {
  if ("rgb" in input && "alpha" in input) {
    return toState(input.rgb, input.alpha)
  }

  const maybeRgba = input as RGBA
  if (typeof maybeRgba.a === "number") {
    return toState(maybeRgba, maybeRgba.a)
  }

  return toState(input as RGB)
}

export function parseColorState(input: ColorInput): ColorState {
  if (typeof input !== "string") {
    return stateFromObject(input)
  }

  const parsers = [parseHexToState, parseRgbToState, parseHslToState]
  for (const parser of parsers) {
    const parsed = parser(input)
    if (parsed !== null) {
      return parsed
    }
  }

  throw new Error(`Unsupported color format: ${input}`)
}

export function parseColor(input: string): RGB {
  return parseColorState(input).rgb
}

export function parseHex(input: string): RGB | null {
  const parsed = parseHexToState(input)
  return parsed?.rgb ?? null
}

export function parseRgb(input: string): RGB | null {
  const parsed = parseRgbToState(input)
  return parsed?.rgb ?? null
}

export function parseHsl(input: string): RGB | null {
  const parsed = parseHslToState(input)
  return parsed?.rgb ?? null
}
