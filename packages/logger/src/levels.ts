import type { LogLevel } from "./types.js"

export const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  success: 2,
  warn: 3,
  error: 4,
}

export function isLevelEnabled(current: LogLevel, minimum: LogLevel): boolean {
  return LOG_LEVELS[current] >= LOG_LEVELS[minimum]
}
