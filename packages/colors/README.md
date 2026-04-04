<div align="center">
  <img src="https://raw.githubusercontent.com/santana-org/.github/main/profile/santana-logo.png" alt="Santana" width="980" />
  <br/><br/>
  <strong>@santana-org/colors</strong>
  <p>Chainable color toolkit for TypeScript — parse, convert, transform, and print.</p>

  [![npm](https://img.shields.io/npm/v/@santana-org/colors?color=CB3837&labelColor=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@santana-org/colors)
  [![license](https://img.shields.io/badge/license-MIT-blue?color=3b82f6&labelColor=1d4ed8)](./LICENSE)
  [![ESM](https://img.shields.io/badge/ESM-first-green?color=16a34a&labelColor=15803d)](https://nodejs.org/api/esm.html)
</div>

---

## 📦 Install
```sh
npm install @santana-org/colors
pnpm add @santana-org/colors
```

## 🚀 Usage
```ts
import { color } from "@santana-org/colors"

color("#ff0000").lighten(0.2).toHex()           // "#ff6666"
color("rgb(255,0,0)").toHsl()                   // "hsl(0, 100%, 50%)"
color("hsl(0,100%,50%)").mix("#0000ff").toHex() // "#7f007f"
```

## 📖 API

### `color(input)`

Accepts `#hex`, `#hexa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`. Returns an immutable, chainable color object.

| Method | Description |
|---|---|
| `lighten(n)` / `darken(n)` | Adjust lightness by `n` (0–1) |
| `saturate(n)` / `desaturate(n)` | Adjust saturation by `n` (0–1) |
| `invert()` | Invert the color |
| `mix(color, weight?)` | Mix with another color |
| `alpha(n)` | Set alpha channel |
| `toHex()` / `toHexa()` | Output as hex string |
| `toRgb()` / `toRgba()` | Output as `rgb()` string |
| `toHsl()` / `toHsla()` | Output as `hsl()` string |
| `toRgbObject()` / `toHslObject()` | Output as plain object |
| `toState()` / `toString()` | Internal state / default string |

### 🔧 Low-level helpers
```ts
import { parseHex, rgbToHsl, lighten, mix, paint } from "@santana-org/colors"
```

- **Parsing** — `parseColor`, `parseHex`, `parseRgb`, `parseHsl`
- **Conversion** — `rgbToHex`, `rgbToHsl`, `hslToRgb`
- **Manipulation** — `lighten`, `darken`, `saturate`, `desaturate`, `invert`, `mix`, `withAlpha`
- **ANSI terminal** — `paint`, `ansi`, `dim`, `gray`, `cyan`, `green`, `yellow`, `red`, `magenta`

## 🏗️ Design

- **Zero dependencies** — small, predictable, no surprises.
- **Immutable API** — every operation returns a new instance.
- **Modular internals** — parsing, conversion, and manipulation are independent.
- **ANSI support** — built-in terminal helpers used by `@santana-org/logger`.

## 📄 License

MIT © [santana-org](https://github.com/santana-org)
