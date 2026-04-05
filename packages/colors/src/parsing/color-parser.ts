import { hslToRgb } from "../conversion/color-conversion.js"
import {
  clampChannel,
  clampPercent,
  clampUnit,
  normalizeHue,
  roundAlpha,
} from "../core/math-utils.js"
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

  const value = match[1]
  if (value === undefined) {
    return null
  }

  if (value.length === 3 || value.length === 4) {
    const rHex = value.charAt(0)
    const gHex = value.charAt(1)
    const bHex = value.charAt(2)
    const aHex = value.charAt(3)

    const r = Number.parseInt(rHex + rHex, 16)
    const g = Number.parseInt(gHex + gHex, 16)
    const b = Number.parseInt(bHex + bHex, 16)
    const a = value.length === 4 ? Number.parseInt(aHex + aHex, 16) / 255 : 1
    return toState({ r, g, b }, a)
  }

  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  const a = value.length === 8 ? Number.parseInt(value.slice(6, 8), 16) / 255 : 1

  return toState({ r, g, b }, a)
}

function parseRgbToState(input: string): ColorState | null {
  const match =
    /^rgba?\(\s*([+-]?\d{1,3})\s*,\s*([+-]?\d{1,3})\s*,\s*([+-]?\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i.exec(
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
  const match =
    /^hsla?\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)%\s*,\s*([+-]?\d+(?:\.\d+)?)%(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i.exec(
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

/**
 * Parses any supported color input into the library's normalized state shape.
 * @param input - Color string or object representation.
 * @returns Normalized color state with clamped channels.
 * @throws Error when the string format is unsupported.
 */
export function parseColorState(input: ColorInput): ColorState {
  if (typeof input !== "string") {
    return stateFromObject(input)
  }

  // Keep parser order deterministic so ambiguous-looking inputs resolve consistently.
  const parsers = [parseHexToState, parseRgbToState, parseHslToState]
  for (const parser of parsers) {
    const parsed = parser(input)
    if (parsed !== null) {
      return parsed
    }
  }

  throw new Error(`Unsupported color format: ${input}`)
}

/**
 * Parses a color string into an RGB object.
 * @param input - Color string in hex, rgb(a), or hsl(a) format.
 * @returns Parsed RGB channels.
 */
export function parseColor(input: string): RGB {
  return parseColorState(input).rgb
}

/**
 * Parses a hex color string into RGB channels.
 * @param input - Hex color string.
 * @returns Parsed RGB channels, or `null` for invalid input.
 */
export function parseHex(input: string): RGB | null {
  const parsed = parseHexToState(input)
  return parsed?.rgb ?? null
}

/**
 * Parses an `rgb()` or `rgba()` string into RGB channels.
 * @param input - CSS rgb/rgba color string.
 * @returns Parsed RGB channels, or `null` for invalid input.
 */
export function parseRgb(input: string): RGB | null {
  const parsed = parseRgbToState(input)
  return parsed?.rgb ?? null
}

/**
 * Parses an `hsl()` or `hsla()` string into RGB channels.
 * @param input - CSS hsl/hsla color string.
 * @returns Parsed RGB channels, or `null` for invalid input.
 */
export function parseHsl(input: string): RGB | null {
  const parsed = parseHslToState(input)
  return parsed?.rgb ?? null
}
