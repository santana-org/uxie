import type { RedactionPattern } from "../types.js"
import { shouldRedactKey } from "./redaction.js"

export interface SerializedError {
  name: string
  message: string
  stack?: string
}

export interface SerializeOptions {
  redact?: RedactionPattern[]
}

interface JsonSerializable {
  toJSON: () => unknown
}

function hasToJSON(value: object): value is JsonSerializable {
  return "toJSON" in value && typeof value.toJSON === "function"
}

/**
 * Checks whether a value is an `Error` instance.
 * @param value - Value to inspect.
 * @returns Type guard for `Error`.
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

/**
 * Serializes an `Error` into a JSON-safe object.
 * @param error - Error value.
 * @returns Serializable error payload.
 */
export function serializeError(error: Error): SerializedError {
  return {
    name: error.name,
    message: error.message,
    ...(error.stack ? { stack: error.stack } : {}),
  }
}

/**
 * Recursively serializes values for safe structured logging.
 * @param value - Value to serialize.
 * @param options - Serialization options.
 * @returns JSON-safe value.
 */
export function serializeValue(value: unknown, options: SerializeOptions = {}): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (isError(value)) {
    return serializeError(value)
  }

  if (typeof value === "object" && hasToJSON(value)) {
    // Delegate custom object serialization before recursive traversal.
    return serializeValue(value.toJSON(), options)
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item, options))
  }

  if (typeof value === "object") {
    const serialized: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      if (shouldRedactKey(key, options.redact)) {
        serialized[key] = "[REDACTED]"
      } else {
        serialized[key] = serializeValue(val, options)
      }
    }
    return serialized
  }

  return value
}
