import type { LogLevel } from "./types.js"

export const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  success: 2,
  warn: 3,
  error: 4,
}

/**
 * Determines whether a log level should be emitted for a minimum configured level.
 * @param current - Level of the current log entry.
 * @param minimum - Minimum enabled level.
 * @returns `true` when the entry should be emitted.
 */
export function isLevelEnabled(current: LogLevel, minimum: LogLevel): boolean {
  return LOG_LEVELS[current] >= LOG_LEVELS[minimum]
}
