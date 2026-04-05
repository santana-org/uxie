import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { ColorOptions } from "../types.js"

export class ColorProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random color name
   */
  name(): string {
    return this.random.pick(this.locale.color.names)
  }

  /**
   * Generate a random hex color
   */
  hex(options: { prefix?: boolean } = {}): string {
    const { prefix = true } = options
    const chars = "0123456789abcdef"
    let hex = ""

    for (let i = 0; i < 6; i++) {
      hex += chars.charAt(this.random.int(0, 15))
    }

    return prefix ? `#${hex}` : hex
  }

  /**
   * Generate a random RGB color
   */
  rgb(
    options: { format?: "object" | "array" | "css" } = {},
  ): { r: number; g: number; b: number } | number[] | string {
    const { format = "object" } = options
    const r = this.random.int(0, 255)
    const g = this.random.int(0, 255)
    const b = this.random.int(0, 255)

    if (format === "array") {
      return [r, g, b]
    }

    if (format === "css") {
      return `rgb(${r}, ${g}, ${b})`
    }

    return { r, g, b }
  }

  /**
   * Generate a random RGBA color
   */
  rgba(
    options: { alpha?: number; format?: "object" | "array" | "css" } = {},
  ): { r: number; g: number; b: number; a: number } | number[] | string {
    const { alpha, format = "object" } = options
    const r = this.random.int(0, 255)
    const g = this.random.int(0, 255)
    const b = this.random.int(0, 255)
    const a = alpha ?? Number(this.random.float(0, 1).toFixed(2))

    if (format === "array") {
      return [r, g, b, a]
    }

    if (format === "css") {
      return `rgba(${r}, ${g}, ${b}, ${a})`
    }

    return { r, g, b, a }
  }

  /**
   * Generate a random HSL color
   */
  hsl(
    options: { format?: "object" | "array" | "css" } = {},
  ): { h: number; s: number; l: number } | number[] | string {
    const { format = "object" } = options
    const h = this.random.int(0, 360)
    const s = this.random.int(0, 100)
    const l = this.random.int(0, 100)

    if (format === "array") {
      return [h, s, l]
    }

    if (format === "css") {
      return `hsl(${h}, ${s}%, ${l}%)`
    }

    return { h, s, l }
  }

  /**
   * Generate a random HSLA color
   */
  hsla(
    options: { alpha?: number; format?: "object" | "array" | "css" } = {},
  ): { h: number; s: number; l: number; a: number } | number[] | string {
    const { alpha, format = "object" } = options
    const h = this.random.int(0, 360)
    const s = this.random.int(0, 100)
    const l = this.random.int(0, 100)
    const a = alpha ?? Number(this.random.float(0, 1).toFixed(2))

    if (format === "array") {
      return [h, s, l, a]
    }

    if (format === "css") {
      return `hsla(${h}, ${s}%, ${l}%, ${a})`
    }

    return { h, s, l, a }
  }

  /**
   * Generate a random HSV/HSB color
   */
  hsv(
    options: { format?: "object" | "array" } = {},
  ): { h: number; s: number; v: number } | number[] {
    const { format = "object" } = options
    const h = this.random.int(0, 360)
    const s = this.random.int(0, 100)
    const v = this.random.int(0, 100)

    if (format === "array") {
      return [h, s, v]
    }

    return { h, s, v }
  }

  /**
   * Generate a random CMYK color
   */
  cmyk(
    options: { format?: "object" | "array" } = {},
  ): { c: number; m: number; y: number; k: number } | number[] {
    const { format = "object" } = options
    const c = this.random.int(0, 100)
    const m = this.random.int(0, 100)
    const y = this.random.int(0, 100)
    const k = this.random.int(0, 100)

    if (format === "array") {
      return [c, m, y, k]
    }

    return { c, m, y, k }
  }

  /**
   * Generate a random LAB color
   */
  lab(
    options: { format?: "object" | "array" } = {},
  ): { l: number; a: number; b: number } | number[] {
    const { format = "object" } = options
    const l = this.random.int(0, 100)
    const a = this.random.int(-128, 127)
    const b = this.random.int(-128, 127)

    if (format === "array") {
      return [l, a, b]
    }

    return { l, a, b }
  }

  /**
   * Generate a random LCH color
   */
  lch(
    options: { format?: "object" | "array" } = {},
  ): { l: number; c: number; h: number } | number[] {
    const { format = "object" } = options
    const l = this.random.int(0, 100)
    const c = this.random.int(0, 132)
    const h = this.random.int(0, 360)

    if (format === "array") {
      return [l, c, h]
    }

    return { l, c, h }
  }

  /**
   * Generate a color in a specific format
   */
  color(options: ColorOptions = {}): string {
    const { format = "hex" } = options

    switch (format) {
      case "hex":
        return this.hex() as string
      case "rgb":
        return this.rgb({ format: "css" }) as string
      case "rgba":
        return this.rgba({
          format: "css",
          ...(options.alpha !== undefined ? { alpha: options.alpha } : {}),
        }) as string
      case "hsl":
        return this.hsl({ format: "css" }) as string
      case "hsla":
        return this.hsla({
          format: "css",
          ...(options.alpha !== undefined ? { alpha: options.alpha } : {}),
        }) as string
      case "name":
        return this.name()
      default:
        return this.hex() as string
    }
  }

  /**
   * Generate a random grayscale color
   */
  grayscale(options: { format?: "hex" | "rgb" } = {}): string {
    const { format = "hex" } = options
    const value = this.random.int(0, 255)

    if (format === "rgb") {
      return `rgb(${value}, ${value}, ${value})`
    }

    const hexValue = value.toString(16).padStart(2, "0")
    return `#${hexValue}${hexValue}${hexValue}`
  }

  /**
   * Generate a color from a specific category/hue
   */
  categoryColor(
    category: "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "pink" | "brown" | "gray",
  ): string {
    const ranges: Record<
      string,
      { h: [number, number]; s: [number, number]; l: [number, number] }
    > = {
      red: { h: [0, 15], s: [70, 100], l: [40, 60] },
      blue: { h: [200, 240], s: [70, 100], l: [40, 60] },
      green: { h: [90, 150], s: [50, 100], l: [30, 60] },
      yellow: { h: [45, 65], s: [80, 100], l: [50, 70] },
      purple: { h: [270, 310], s: [60, 100], l: [40, 60] },
      orange: { h: [20, 45], s: [80, 100], l: [50, 65] },
      pink: { h: [320, 350], s: [70, 100], l: [60, 80] },
      brown: { h: [20, 40], s: [30, 60], l: [25, 45] },
      gray: { h: [0, 360], s: [0, 10], l: [30, 70] },
    }

    const range = category ? ranges[category] : undefined
    if (!range) {
      throw new Error("Invalid color category")
    }
    const h = this.random.int(range.h[0], range.h[1])
    const s = this.random.int(range.s[0], range.s[1])
    const l = this.random.int(range.l[0], range.l[1])

    return `hsl(${h}, ${s}%, ${l}%)`
  }

  /**
   * Generate a random palette of colors
   */
  palette(options: { count?: number; format?: "hex" | "rgb" | "hsl" } = {}): string[] {
    const { count = 5, format = "hex" } = options
    const colors: string[] = []

    for (let i = 0; i < count; i++) {
      switch (format) {
        case "hex":
          colors.push(this.hex() as string)
          break
        case "rgb":
          colors.push(this.rgb({ format: "css" }) as string)
          break
        case "hsl":
          colors.push(this.hsl({ format: "css" }) as string)
          break
      }
    }

    return colors
  }

  /**
   * Generate a complementary color
   */
  complementary(hexColor: string): string {
    const hex = hexColor.replace("#", "")
    const r = 255 - Number.parseInt(hex.substring(0, 2), 16)
    const g = 255 - Number.parseInt(hex.substring(2, 4), 16)
    const b = 255 - Number.parseInt(hex.substring(4, 6), 16)

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }
}
