export interface RGB {
  r: number
  g: number
  b: number
}

export interface RGBA extends RGB {
  a: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export interface HSLA extends HSL {
  a: number
}

export interface ColorState {
  rgb: RGB
  alpha: number
}

export type ColorInput = string | RGB | RGBA | ColorState

export interface ColorChain {
  lighten(amount: number): ColorChain
  darken(amount: number): ColorChain
  saturate(amount: number): ColorChain
  desaturate(amount: number): ColorChain
  invert(): ColorChain
  mix(other: ColorInput, weight?: number): ColorChain
  alpha(value: number): ColorChain
  toHex(): string
  toHexa(): string
  toRgb(): string
  toRgba(): string
  toHsl(): string
  toHsla(): string
  toRgbObject(): RGB
  toRgbaObject(): RGBA
  toHslObject(): HSL
  toHslaObject(): HSLA
  toState(): ColorState
  toString(): string
}
