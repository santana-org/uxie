# @santa-org/logger

A lightweight, configurable logger for Node.js and modern JavaScript environments.

## Features

- Log levels: `debug`, `info`, `success`, `warn`, `error`
- Configurable minimum level
- Optional timestamps
- Optional label / namespace
- Colorized output (auto-detected TTY)
- Custom formatter support
- ESM-first, CJS-compatible
- Zero dependencies

## Installation

```sh
npm install @santa-org/logger
# or
pnpm add @santa-org/logger
```

## Usage

```ts
import { createLogger } from "@santa-org/logger"

const logger = createLogger({
  level: "info",
  label: "app",
  timestamps: true,
})

logger.info("Server started")
logger.warn("Low memory")
logger.error("Unhandled exception", { code: 500 })
```

### Child logger

```ts
const dbLogger = logger.child("db")
dbLogger.debug("Query executed")
```

### Custom formatter

```ts
import { createLogger, type LogEntry } from "@santa-org/logger"

const logger = createLogger({
  formatter: (entry: LogEntry, _colors: boolean) =>
    `[${entry.level.toUpperCase()}] ${entry.message}`,
})
```

## API

### `createLogger(options?)`

| Option      | Type        | Default       | Description                                |
|-------------|-------------|---------------|--------------------------------------------|
| `level`     | `LogLevel`  | `"debug"`     | Minimum log level                          |
| `label`     | `string`    | —             | Label/namespace prepended to each message  |
| `timestamps`| `boolean`   | `false`       | Include ISO timestamps                     |
| `colors`    | `boolean`   | auto (TTY)    | Colorize output                            |
| `formatter` | `Formatter` | built-in      | Custom formatter function                  |
| `writer`    | `Writer`    | stdout/stderr | Custom output writer                       |

### Log Levels

`debug` < `info` < `success` < `warn` < `error`

## License

MIT
