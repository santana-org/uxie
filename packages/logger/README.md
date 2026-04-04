<div align="center">
  <img src="https://raw.githubusercontent.com/santana-org/.github/main/profile/santana-logo.png" alt="Santana" width="980" />
  <br/>
  <br/>

  <strong>@santana-org/logger</strong>

  <p>A lightweight, configurable logger for Node.js — built to stay out of your way.</p>

  [![npm](https://img.shields.io/npm/v/@santana-org/logger?color=CB3837&labelColor=CB3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/@santana-org/logger)
  [![license](https://img.shields.io/badge/license-MIT-blue?color=3b82f6&labelColor=1d4ed8)](./LICENSE)
  [![ESM](https://img.shields.io/badge/ESM-first-green?color=16a34a&labelColor=15803d)](https://nodejs.org/api/esm.html)

</div>

## 📦 Install

```sh
npm install @santana-org/logger
pnpm add @santana-org/logger
```

## 🚀 Quickstart

```ts
import { createLogger } from "@santana-org/logger"

const log = createLogger({
  level: "info",
  label: "app",
  timestamps: true,
})

log.info("Server started")
log.warn("Low memory")
log.error("Unhandled exception", { code: 500 })
```

## 📖 API

### `createLogger(options?)`

| Option | Type | Default | Description |
|---|---|---|---|
| `level` | `LogLevel` | `"debug"` | Minimum level to output |
| `label` | `string` | — | Namespace prepended to every message |
| `timestamps` | `boolean` | `false` | Prefix messages with ISO timestamp |
| `colors` | `boolean` | auto | Force or disable colorized output |
| `formatter` | `Formatter` | built-in | Override the output format entirely |
| `writer` | `Writer` | stdout/stderr | Override where output goes |

### 🔢 Log levels

```
debug  →  info  →  success  →  warn  →  error
```

Anything below the configured `level` is silently ignored.

## 🧩 Recipes

**Scoped child logger**

```ts
const dbLog = log.child("db")
dbLog.debug("Query executed") // → [app:db] Query executed
```

**Custom formatter**

```ts
import { createLogger, type LogEntry } from "@santana-org/logger"

const log = createLogger({
  formatter: (entry: LogEntry, colors: boolean) =>
    `[${entry.level.toUpperCase()}] ${entry.message}`,
})
```

**Silent in tests**

```ts
const log = createLogger({ level: "error" })
// Only errors get through — no noise in test output
```

**Capture output**

```ts
const lines: string[] = []

const log = createLogger({
  writer: (line) => lines.push(line),
})
```

## 🏗️ Design decisions

- **Small dependency surface.** Uses a tiny shared `@santana-org/colors` utility package.
- **ESM-first.** CJS interop included, but the package is written for modern runtimes.
- **TTY-aware colors.** Colors auto-disable when piped — no `NO_COLOR` hacks needed.
- **Composable, not configurable-forever.** One factory, one logger, one job.

## 📄 License

MIT © [santana-org](https://github.com/santana-org) — contributions are welcome, see [CONTRIBUTING](https://github.com/santana-org/.github/blob/main/CONTRIBUTING.md).
