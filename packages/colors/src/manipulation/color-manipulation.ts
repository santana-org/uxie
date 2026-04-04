import { hslToRgb, rgbToHsl } from "../conversion/color-conversion.js"
import { clampUnit, roundAlpha } from "../core/math-utils.js"
import type { ColorInput, ColorState, RGB } from "../core/types.js"
import { parseColorState } from "../parsing/color-parser.js"

function withLightness(state: ColorState, delta: number): ColorState {
  const hsl = rgbToHsl(state.rgb)
  return {
    rgb: hslToRgb({
      ...hsl,
      l: clampUnit(hsl.l / 100 + delta) * 100,
    }),
    alpha: state.alpha,
  }
}

function withSaturation(state: ColorState, delta: number): ColorState {
  const hsl = rgbToHsl(state.rgb)
  return {
    rgb: hslToRgb({
      ...hsl,
      s: clampUnit(hsl.s / 100 + delta) * 100,
    }),
    alpha: state.alpha,
  }
}

export function lightenState(state: ColorState, amount: number): ColorState {
  return withLightness(state, Math.abs(amount))
}

export function darkenState(state: ColorState, amount: number): ColorState {
  return withLightness(state, -Math.abs(amount))
}

export function saturateState(state: ColorState, amount: number): ColorState {
  return withSaturation(state, Math.abs(amount))
}

export function desaturateState(state: ColorState, amount: number): ColorState {
  return withSaturation(state, -Math.abs(amount))
}

export function invertState(state: ColorState): ColorState {
  return {
    rgb: {
      r: 255 - state.rgb.r,
      g: 255 - state.rgb.g,
      b: 255 - state.rgb.b,
    },
    alpha: state.alpha,
  }
}

export function mixState(base: ColorState, other: ColorInput, weight = 0.5): ColorState {
  const blend = parseColorState(other)
  const ratio = clampUnit(weight)

  return {
    rgb: {
      r: Math.round(base.rgb.r * (1 - ratio) + blend.rgb.r * ratio),
      g: Math.round(base.rgb.g * (1 - ratio) + blend.rgb.g * ratio),
      b: Math.round(base.rgb.b * (1 - ratio) + blend.rgb.b * ratio),
    },
    alpha: roundAlpha(base.alpha * (1 - ratio) + blend.alpha * ratio),
  }
}

export function withAlphaState(state: ColorState, value: number): ColorState {
  return {
    ...state,
    alpha: roundAlpha(value),
  }
}

export function lighten(rgb: RGB, amount: number): RGB {
  return lightenState({ rgb, alpha: 1 }, amount).rgb
}

export function darken(rgb: RGB, amount: number): RGB {
  return darkenState({ rgb, alpha: 1 }, amount).rgb
}

export function saturate(rgb: RGB, amount: number): RGB {
  return saturateState({ rgb, alpha: 1 }, amount).rgb
}

export function desaturate(rgb: RGB, amount: number): RGB {
  return desaturateState({ rgb, alpha: 1 }, amount).rgb
}

export function invert(rgb: RGB): RGB {
  return invertState({ rgb, alpha: 1 }).rgb
}

export function mixRgb(base: RGB, other: ColorInput, weight = 0.5): RGB {
  return mixState({ rgb: base, alpha: 1 }, other, weight).rgb
}

export function withAlpha(rgb: RGB, value: number): ColorState {
  return withAlphaState({ rgb, alpha: 1 }, value)
}
