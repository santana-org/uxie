export const ansi = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  gray: "\x1b[90m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
} as const

export type AnsiCode = (typeof ansi)[keyof typeof ansi]

/**
 * Wraps text with an ANSI escape code when terminal coloring is enabled.
 * @param text - Text to format.
 * @param code - ANSI code used as prefix.
 * @param enabled - Whether ANSI formatting should be applied.
 * @returns Formatted text or the original text when disabled.
 */
export function paint(text: string, code: AnsiCode, enabled = true): string {
  return enabled ? `${code}${text}${ansi.reset}` : text
}

/**
 * Applies dim ANSI styling to text.
 * @param text - Text to format.
 * @param enabled - Whether ANSI formatting should be applied.
 * @returns Styled text.
 */
export const dim = (text: string, enabled = true): string => paint(text, ansi.dim, enabled)
/**
 * Applies gray ANSI styling to text.
 * @param text - Text to format.
 * @param enabled - Whether ANSI formatting should be applied.
 * @returns Styled text.
 */
export const gray = (text: string, enabled = true): string => paint(text, ansi.gray, enabled)
/**
 * Applies cyan ANSI styling to text.
 * @param text - Text to format.
 * @param enabled - Whether ANSI formatting should be applied.
 * @returns Styled text.
 */
export const cyan = (text: string, enabled = true): string => paint(text, ansi.cyan, enabled)
/**
 * Applies green ANSI styling to text.
 * @param text - Text to format.
 * @param enabled - Whether ANSI formatting should be applied.
 * @returns Styled text.
 */
export const green = (text: string, enabled = true): string => paint(text, ansi.green, enabled)
/**
 * Applies yellow ANSI styling to text.
 * @param text - Text to format.
 * @param enabled - Whether ANSI formatting should be applied.
 * @returns Styled text.
 */
export const yellow = (text: string, enabled = true): string => paint(text, ansi.yellow, enabled)
/**
 * Applies red ANSI styling to text.
 * @param text - Text to format.
 * @param enabled - Whether ANSI formatting should be applied.
 * @returns Styled text.
 */
export const red = (text: string, enabled = true): string => paint(text, ansi.red, enabled)
/**
 * Applies magenta ANSI styling to text.
 * @param text - Text to format.
 * @param enabled - Whether ANSI formatting should be applied.
 * @returns Styled text.
 */
export const magenta = (text: string, enabled = true): string => paint(text, ansi.magenta, enabled)
