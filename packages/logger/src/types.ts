import type { DateFormat, DateFormatterFn } from "./date-formatter.js"

export type LogLevel = "debug" | "info" | "warn" | "error" | "success"

export interface LogEntry {
  level: LogLevel
  message: string
  label?: string
  timestamp?: Date
  args: unknown[]
}

export interface LoggerOptions {
  /** Minimum log level to output. Defaults to "debug". */
  level?: LogLevel
  /** Optional label/namespace prepended to each message. */
  label?: string
  /** Whether to include timestamps in output. Defaults to false. */
  timestamps?: boolean
  /** Output format: "text" (default) or "json". */
  format?: "text" | "json"
  /** Timestamp format: "iso" | "time" | "datetime". Defaults to "iso". */
  dateFormat?: DateFormat
  /** Custom date formatter function. Overrides dateFormat when provided. */
  dateFormatter?: DateFormatterFn
  /** Whether to colorize output. Defaults to true when a TTY is detected. */
  colors?: boolean
  /** Custom formatter. Overrides the built-in formatter when provided. */
  formatter?: Formatter
  /** Output writer. Defaults to process.stdout / process.stderr. */
  writer?: Writer
}

export type Formatter = (entry: LogEntry, colors: boolean) => string

export interface Writer {
  out: (message: string) => void
  err: (message: string) => void
}

export interface Logger {
  debug: (message: string, ...args: unknown[]) => void
  info: (message: string, ...args: unknown[]) => void
  warn: (message: string, ...args: unknown[]) => void
  error: (message: string, ...args: unknown[]) => void
  success: (message: string, ...args: unknown[]) => void
  /** Create a child logger with a specific label. */
  child: (label: string) => Logger
}
