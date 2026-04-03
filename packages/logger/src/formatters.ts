import type { Formatter, LogEntry, LogLevel } from "./types.js"
import {
  formatDate,
  type DateFormat,
  type DateFormatterFn,
  type DateFormatterConfig,
} from "./date-formatter.js"
import { serializeValue } from "./serializer.js"

const ANSI_RESET = "\x1b[0m"

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[90m", // gray
  info: "\x1b[36m", // cyan
  success: "\x1b[32m", // green
  warn: "\x1b[33m", // yellow
  error: "\x1b[31m", // red
}

const LEVEL_LABELS: Record<LogLevel, string> = {
  debug: "DBG",
  info: "INF",
  success: "SUC",
  warn: "WRN",
  error: "ERR",
}

function colorize(text: string, color: string, enabled: boolean): string {
  return enabled ? `${color}${text}${ANSI_RESET}` : text
}

interface FormatterConfig {
  dateFormat?: DateFormat
  dateFormatter?: DateFormatterFn
}

interface JsonLogOutput {
  level: LogLevel
  message: string
  timestamp?: string
  label?: string
  data?: unknown[]
}

function createDefaultFormatter(config: FormatterConfig = {}): Formatter {
  return (entry: LogEntry, colors: boolean): string => {
    const parts: string[] = []

    if (entry.timestamp) {
      const formatConfig: DateFormatterConfig = {}
      if (config.dateFormat !== undefined) {
        formatConfig.format = config.dateFormat
      }
      if (config.dateFormatter !== undefined) {
        formatConfig.formatter = config.dateFormatter
      }
      const ts = formatDate(entry.timestamp, formatConfig)
      parts.push(colorize(ts, "\x1b[2m", colors))
    }

    const levelColor = LEVEL_COLORS[entry.level]
    const levelLabel = LEVEL_LABELS[entry.level]
    parts.push(colorize(levelLabel, levelColor, colors))

    if (entry.label) {
      parts.push(colorize(`[${entry.label}]`, "\x1b[35m", colors))
    }

    parts.push(entry.message)

    if (entry.args.length > 0) {
      const extras = entry.args
        .map((a) => {
          const serialized = serializeValue(a)
          return typeof serialized === "object"
            ? JSON.stringify(serialized, null, 2)
            : String(serialized)
        })
        .join(" ")
      parts.push(extras)
    }

    return parts.join(" ")
  }
}

export { createDefaultFormatter }
export const defaultFormatter = createDefaultFormatter()

function createJsonFormatter(config: FormatterConfig = {}): Formatter {
  return (entry: LogEntry): string => {
    const output: JsonLogOutput = {
      level: entry.level,
      message: entry.message,
    }

    if (entry.timestamp) {
      const formatConfig: DateFormatterConfig = {}
      if (config.dateFormat !== undefined) {
        formatConfig.format = config.dateFormat
      }
      if (config.dateFormatter !== undefined) {
        formatConfig.formatter = config.dateFormatter
      }
      output.timestamp = formatDate(entry.timestamp, formatConfig)
    }

    if (entry.label) {
      output.label = entry.label
    }

    if (entry.args.length > 0) {
      output.data = entry.args.map(serializeValue)
    }

    return JSON.stringify(output)
  }
}

export { createJsonFormatter }
