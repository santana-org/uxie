import { describe, expect, it } from "vitest"
import {
  color,
  darken,
  lighten,
  parseColor,
  parseColorState,
  rgbaToHexa,
  rgbToHex,
  rgbToHsl,
} from "../index.js"

describe("parsing", () => {
  it("parses short and long hex colors", () => {
    expect(parseColor("#f00")).toEqual({ r: 255, g: 0, b: 0 })
    expect(parseColor("#ff0000")).toEqual({ r: 255, g: 0, b: 0 })
  })

  it("parses rgb and rgba colors", () => {
    expect(parseColor("rgb(255,0,0)")).toEqual({ r: 255, g: 0, b: 0 })
    expect(parseColor("rgba(255, 0, 0, 0.5)")).toEqual({ r: 255, g: 0, b: 0 })
  })

  it("parses hsl and hsla colors", () => {
    expect(parseColor("hsl(0, 100%, 50%)")).toEqual({ r: 255, g: 0, b: 0 })
    expect(parseColor("hsla(0, 100%, 50%, 0.5)")).toEqual({ r: 255, g: 0, b: 0 })
  })

  it("parses alpha channels in state parser", () => {
    expect(parseColorState("rgba(255, 0, 0, 0.5)")).toEqual({
      rgb: { r: 255, g: 0, b: 0 },
      alpha: 0.5,
    })
  })
})

describe("conversion", () => {
  it("converts rgb to hex and hsl", () => {
    const red = { r: 255, g: 0, b: 0 }

    expect(rgbToHex(red)).toBe("#ff0000")
    expect(rgbToHsl(red)).toEqual({ h: 0, s: 100, l: 50 })
    expect(rgbaToHexa({ ...red, a: 0.5 })).toBe("#ff000080")
  })
})

describe("manipulation", () => {
  it("lightens and darkens using hsl lightness", () => {
    expect(lighten({ r: 128, g: 128, b: 128 }, 0.2)).toEqual({ r: 179, g: 179, b: 179 })
    expect(darken({ r: 128, g: 128, b: 128 }, 0.2)).toEqual({ r: 77, g: 77, b: 77 })
  })
})

describe("fluent api", () => {
  it("supports chaining and conversion", () => {
    expect(color("#ff0000").lighten(0.2).toHex()).toBe("#ff6666")
    expect(color("rgb(255,0,0)").toHsl()).toBe("hsl(0, 100%, 50%)")
    expect(color("hsl(0, 100%, 50%)").toRgb()).toBe("rgb(255, 0, 0)")
  })

  it("keeps internal state across chained calls", () => {
    const result = color("#808080").lighten(0.1).darken(0.05).toRgbObject()
    expect(result).toEqual({ r: 140, g: 140, b: 140 })
  })

  it("supports saturation/invert/mix/alpha in chain", () => {
    const baseSaturation = color("#6699cc").toHslObject().s
    const saturated = color("#6699cc").saturate(0.2).toHslObject().s
    const desaturated = color("#6699cc").desaturate(0.2).toHslObject().s

    expect(saturated).toBeGreaterThan(baseSaturation)
    expect(desaturated).toBeLessThan(baseSaturation)
    expect(color("#000000").invert().toHex()).toBe("#ffffff")
    expect(color("#ff0000").mix("#0000ff", 0.5).toHex()).toBe("#800080")
    expect(color("rgba(255,0,0,0.5)").alpha(0.25).toRgba()).toBe("rgba(255, 0, 0, 0.25)")
  })
})
