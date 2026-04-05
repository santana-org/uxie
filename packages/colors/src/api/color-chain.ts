import {
  formatHsl,
  formatHsla,
  formatRgb,
  formatRgba,
  rgbToHex,
  rgbToHsl,
  rgbToHsla,
  rgbaToHexa,
} from "../conversion/color-conversion.js"
import type { ColorChain, ColorInput, ColorState } from "../core/types.js"
import {
  darkenState,
  desaturateState,
  invertState,
  lightenState,
  mixState,
  saturateState,
  withAlphaState,
} from "../manipulation/color-manipulation.js"
import { parseColorState } from "../parsing/color-parser.js"

export function createColor(state: ColorState): ColorChain {
  const chain: ColorChain = {
    lighten(amount) {
      return createColor(lightenState(state, amount))
    },
    darken(amount) {
      return createColor(darkenState(state, amount))
    },
    saturate(amount) {
      return createColor(saturateState(state, amount))
    },
    desaturate(amount) {
      return createColor(desaturateState(state, amount))
    },
    invert() {
      return createColor(invertState(state))
    },
    mix(other, weight) {
      return createColor(mixState(state, other, weight))
    },
    alpha(value) {
      return createColor(withAlphaState(state, value))
    },
    toHex() {
      return rgbToHex(state.rgb)
    },
    toHexa() {
      return rgbaToHexa({ ...state.rgb, a: state.alpha })
    },
    toRgb() {
      return formatRgb(state.rgb)
    },
    toRgba() {
      return formatRgba({ ...state.rgb, a: state.alpha })
    },
    toHsl() {
      return formatHsl(rgbToHsl(state.rgb))
    },
    toHsla() {
      return formatHsla(rgbToHsla({ ...state.rgb, a: state.alpha }))
    },
    toRgbObject() {
      return { ...state.rgb }
    },
    toRgbaObject() {
      return { ...state.rgb, a: state.alpha }
    },
    toHslObject() {
      return rgbToHsl(state.rgb)
    },
    toHslaObject() {
      return rgbToHsla({ ...state.rgb, a: state.alpha })
    },
    toState() {
      return {
        rgb: { ...state.rgb },
        alpha: state.alpha,
      }
    },
    toString() {
      return state.alpha < 1 ? chain.toHexa() : chain.toHex()
    },
  }

  return chain
}

export function color(input: ColorInput): ColorChain {
  return createColor(parseColorState(input))
}
