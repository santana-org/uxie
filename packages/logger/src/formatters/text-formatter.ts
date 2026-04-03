import { type DateFormatterConfig, formatDate } from "../date-formatter.js"
import { serializeValue } from "../serialization/serialize-value.js"
import type { Formatter, LogEntry, LogLevel } from "../types.js"
import type { FormatterConfig } from "./formatter-config.js"

const ANSI_RESET = "\x1b[0m"

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[90m",
  info: "\x1b[36m",
  success: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
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

function buildDateFormatterConfig(config: FormatterConfig): DateFormatterConfig {
  const dateConfig: DateFormatterConfig = {}
  if (config.dateFormat !== undefined) {
    dateConfig.format = config.dateFormat
  }
  if (config.dateFormatter !== undefined) {
    dateConfig.formatter = config.dateFormatter
  }
  return dateConfig
}

export function createTextFormatter(config: FormatterConfig = {}): Formatter {
  return (entry: LogEntry, colors: boolean): string => {
    const parts: string[] = []

    if (entry.timestamp) {
      const ts = formatDate(entry.timestamp, buildDateFormatterConfig(config))
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
        .map((arg) => {
          const serialized =
            config.redact !== undefined
              ? serializeValue(arg, { redact: config.redact })
              : serializeValue(arg)
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

export const defaultFormatter = createTextFormatter()
