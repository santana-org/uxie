<div align="center">
  <img src="https://raw.githubusercontent.com/santana-org/.github/main/profile/santana-logo.png" alt="Santana" width="980" />
<br/>
<br/>
<strong>@santana-org/cli</strong>
<p>Polished command-line builder for the Santana Org ecosystem — lightweight in code, premium in the terminal.</p>

[![npm](https://img.shields.io/npm/v/@santana-org/cli?color=CB3837&labelColor=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@santana-org/cli)
[![license](https://img.shields.io/badge/license-MIT-blue?color=3b82f6&labelColor=1d4ed8)](./LICENSE)
[![ESM](https://img.shields.io/badge/ESM-first-green?color=16a34a&labelColor=15803d)](https://nodejs.org/api/esm.html)
</div>

## 📦 Install

```sh
npm install @santana-org/cli
pnpm add @santana-org/cli
```

## 🚀 Quickstart

```ts
import { createCli } from "@santana-org/cli"
import { createLogger } from "@santana-org/logger"

const logger = createLogger({ label: "demo" })

const cli = createCli({
  name: "demo",
  version: "1.0.0",
  description: "A tiny CLI for the Santana Org ecosystem",
  branding: {
    title: "demo",
    tagline: "a small CLI with premium UX",
    badge: "developer tools",
  },
})
  .option("-v, --verbose", "enable verbose output")
  .command("greet", "print a greeting")
  .argument("<name>", "person to greet")
  .option("-l, --loud", "uppercase the output")
  .action(({ positionals, options }) => {
    const name = positionals.name as string
    logger.info(`hello, ${name}`)
  })

await cli.parse()
```

## 📖 API

### `createCli(options)`

| Option | Type | Description |
|---|---|---|
| `name` | `string` | CLI binary name |
| `version` | `string` | Version shown in `--version` |
| `description` | `string` | Short description |
| `branding.title` | `string` | Banner title |
| `branding.tagline` | `string` | Banner subtitle |
| `branding.badge` | `string` | Small label shown next to the title |

### Chainable methods

| Method | Description |
|---|---|
| `.option(flags, description)` | Add a boolean or value flag |
| `.command(name, description)` | Register a subcommand |
| `.argument(syntax, description)` | Add a positional argument |
| `.action(fn)` | Handler receiving `{ positionals, options }` |
| `.parse()` | Parse `process.argv` and run |

## 🏗️ Design decisions

- **Chainable API.** Commands, flags, and arguments compose naturally in a single expression.
- **Auto help.** `--help` is generated automatically, styled with `@santana-org/colors`.
- **Logger-friendly.** Designed to pair with `@santana-org/logger` inside actions.
- **Branding-first.** First-class support for a recognizable CLI header out of the box.
- **ESM-first.** CJS interop included, written for modern runtimes.

## 📄 License

MIT © [santana-org](https://github.com/santana-org) — contributions are welcome, see [CONTRIBUTING](https://github.com/santana-org/.github/blob/main/CONTRIBUTING.md).
