<div align="center">
	<img src="https://raw.githubusercontent.com/santana-org/.github/main/profile/santana-logo.png" alt="Santana" width="980" />
	<br/>
	<br/>

	<strong>@santana-org/colors</strong>

	<p>A small, chainable color toolkit for TypeScript — parse, convert, transform, and print.</p>

	[![npm](https://img.shields.io/npm/v/@santana-org/colors?color=CB3837&labelColor=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@santana-org/colors)
	[![license](https://img.shields.io/badge/license-MIT-blue?color=3b82f6&labelColor=1d4ed8)](./LICENSE)
	[![ESM](https://img.shields.io/badge/ESM-first-green?color=16a34a&labelColor=15803d)](https://nodejs.org/api/esm.html)

</div>

## 📦 Install

```sh
npm install @santana-org/colors
pnpm add @santana-org/colors
```

## 🚀 Quickstart

```ts
import { color } from "@santana-org/colors"

color("#ff0000").lighten(0.2).toHex() // #ff6666
color("rgb(255,0,0)").toHsl() // hsl(0, 100%, 50%)
color("hsl(0, 100%, 50%)").toRgb() // rgb(255, 0, 0)
```

## 📖 API

### `color(input)`

Creates an immutable, chainable color object.

#### Input formats

- HEX: `#fff`, `#ffffff`, `#rgba`, `#rrggbbaa`
- RGB: `rgb(r,g,b)`, `rgba(r,g,b,a)`
- HSL: `hsl(h,s%,l%)`, `hsla(h,s%,l%,a)`

#### Chain methods

- `lighten(amount)` / `darken(amount)`
- `saturate(amount)` / `desaturate(amount)`
- `invert()`
- `mix(other, weight?)`
- `alpha(value)`

#### Output methods

- `toHex()` / `toHexa()`
- `toRgb()` / `toRgba()`
- `toHsl()` / `toHsla()`
- `toRgbObject()` / `toRgbaObject()`
- `toHslObject()` / `toHslaObject()`
- `toState()` / `toString()`

### Low-level helpers

- Parsing: `parseColor`, `parseColorState`, `parseHex`, `parseRgb`, `parseHsl`
- Conversion: `rgbToHex`, `rgbaToHexa`, `rgbToHsl`, `rgbToHsla`, `hslToRgb`
- Manipulation: `lighten`, `darken`, `saturate`, `desaturate`, `invert`, `mix`, `withAlpha`
- ANSI terminal compatibility: `ansi`, `paint`, `dim`, `gray`, `cyan`, `green`, `yellow`, `red`, `magenta`

## 🏗️ Design decisions

- **Zero runtime dependencies.** Small install and predictable behavior.
- **Immutable fluent API.** Each operation returns a new color chain.
- **Modular internals.** Parsing, conversion, manipulation, and formatting live in separate domains.
- **Pragmatic compatibility.** Includes ANSI helpers used by `@santana-org/logger`.

## 📄 License

MIT © [santana-org](https://github.com/santana-org) — contributions are welcome, see [CONTRIBUTING](https://github.com/santana-org/.github/blob/main/CONTRIBUTING.md).
