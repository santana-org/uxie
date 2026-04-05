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

/**
 * Returns a new color state with increased lightness.
 * @param state - Source color state.
 * @param amount - Amount in unit range where `1` means full adjustment.
 * @returns Lightened color state.
 */
export function lightenState(state: ColorState, amount: number): ColorState {
  return withLightness(state, Math.abs(amount))
}

/**
 * Returns a new color state with reduced lightness.
 * @param state - Source color state.
 * @param amount - Amount in unit range where `1` means full adjustment.
 * @returns Darkened color state.
 */
export function darkenState(state: ColorState, amount: number): ColorState {
  return withLightness(state, -Math.abs(amount))
}

/**
 * Returns a new color state with increased saturation.
 * @param state - Source color state.
 * @param amount - Amount in unit range where `1` means full adjustment.
 * @returns Saturated color state.
 */
export function saturateState(state: ColorState, amount: number): ColorState {
  return withSaturation(state, Math.abs(amount))
}

/**
 * Returns a new color state with reduced saturation.
 * @param state - Source color state.
 * @param amount - Amount in unit range where `1` means full adjustment.
 * @returns Desaturated color state.
 */
export function desaturateState(state: ColorState, amount: number): ColorState {
  return withSaturation(state, -Math.abs(amount))
}

/**
 * Produces the complementary inverse of a color state.
 * @param state - Source color state.
 * @returns Inverted color state.
 */
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

/**
 * Mixes two colors using linear interpolation in RGB space.
 * @param base - Base color state.
 * @param other - Color to blend into the base.
 * @param weight - Blend weight for `other` in range `[0, 1]`.
 * @returns Mixed color state.
 */
export function mixState(base: ColorState, other: ColorInput, weight = 0.5): ColorState {
  const blend = parseColorState(other)
  // Clamp to keep interpolation stable for out-of-range caller input.
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

/**
 * Replaces alpha in a color state.
 * @param state - Source color state.
 * @param value - New alpha value.
 * @returns Updated color state with rounded alpha.
 */
export function withAlphaState(state: ColorState, value: number): ColorState {
  return {
    ...state,
    alpha: roundAlpha(value),
  }
}

/**
 * Returns a lightened RGB color.
 * @param rgb - Source RGB color.
 * @param amount - Amount in unit range where `1` means full adjustment.
 * @returns Lightened RGB color.
 */
export function lighten(rgb: RGB, amount: number): RGB {
  return lightenState({ rgb, alpha: 1 }, amount).rgb
}

/**
 * Returns a darkened RGB color.
 * @param rgb - Source RGB color.
 * @param amount - Amount in unit range where `1` means full adjustment.
 * @returns Darkened RGB color.
 */
export function darken(rgb: RGB, amount: number): RGB {
  return darkenState({ rgb, alpha: 1 }, amount).rgb
}

/**
 * Returns a more saturated RGB color.
 * @param rgb - Source RGB color.
 * @param amount - Amount in unit range where `1` means full adjustment.
 * @returns Saturated RGB color.
 */
export function saturate(rgb: RGB, amount: number): RGB {
  return saturateState({ rgb, alpha: 1 }, amount).rgb
}

/**
 * Returns a less saturated RGB color.
 * @param rgb - Source RGB color.
 * @param amount - Amount in unit range where `1` means full adjustment.
 * @returns Desaturated RGB color.
 */
export function desaturate(rgb: RGB, amount: number): RGB {
  return desaturateState({ rgb, alpha: 1 }, amount).rgb
}

/**
 * Returns the complementary inverse of an RGB color.
 * @param rgb - Source RGB color.
 * @returns Inverted RGB color.
 */
export function invert(rgb: RGB): RGB {
  return invertState({ rgb, alpha: 1 }).rgb
}

/**
 * Mixes two RGB colors.
 * @param base - Base RGB color.
 * @param other - Color to blend into the base.
 * @param weight - Blend weight for `other` in range `[0, 1]`.
 * @returns Mixed RGB color.
 */
export function mixRgb(base: RGB, other: ColorInput, weight = 0.5): RGB {
  return mixState({ rgb: base, alpha: 1 }, other, weight).rgb
}

/**
 * Combines RGB channels with an explicit alpha value.
 * @param rgb - Source RGB color.
 * @param value - Alpha channel value.
 * @returns Normalized color state.
 */
export function withAlpha(rgb: RGB, value: number): ColorState {
  return withAlphaState({ rgb, alpha: 1 }, value)
}
