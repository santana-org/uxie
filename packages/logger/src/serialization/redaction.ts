import type { RedactionPattern } from "../types.js"

/**
 * Matches object keys against configured redaction patterns.
 * @param key - Object key to evaluate.
 * @param patterns - Exact-string or regex redaction patterns.
 * @returns `true` when the key should be redacted.
 */
export function shouldRedactKey(key: string, patterns: RedactionPattern[] = []): boolean {
  return patterns.some((pattern) => {
    if (typeof pattern === "string") {
      return pattern.toLowerCase() === key.toLowerCase()
    }
    return pattern.test(key)
  })
}
