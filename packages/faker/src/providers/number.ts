import type { MersenneTwister } from "../random.js"
import type { FloatOptions, IntegerOptions, UuidOptions } from "../types.js"

/**
 * Generates numeric values and number-based identifiers.
 */
export class NumberProvider {
  constructor(private readonly random: MersenneTwister) {}

  /**
   * Generate a random integer
   */
  int(options: IntegerOptions = {}): number {
    const { min = 0, max = Number.MAX_SAFE_INTEGER } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a random float
   */
  float(options: FloatOptions = {}): number {
    const { min = 0, max = 1, precision = 2 } = options
    const value = this.random.float(min, max)
    return Number(value.toFixed(precision))
  }

  /**
   * Generate a random binary string
   */
  binary(options: { length?: number; prefix?: boolean } = {}): string {
    const { length = 8, prefix = true } = options
    let binary = ""

    for (let i = 0; i < length; i++) {
      binary += this.random.int(0, 1)
    }

    return prefix ? `0b${binary}` : binary
  }

  /**
   * Generate a random octal string
   */
  octal(options: { length?: number; prefix?: boolean } = {}): string {
    const { length = 8, prefix = true } = options
    let octal = ""

    for (let i = 0; i < length; i++) {
      octal += this.random.int(0, 7)
    }

    return prefix ? `0o${octal}` : octal
  }

  /**
   * Generate a random hexadecimal string
   */
  hex(options: { length?: number; prefix?: boolean; uppercase?: boolean } = {}): string {
    const { length = 8, prefix = true, uppercase = false } = options
    const chars = uppercase ? "0123456789ABCDEF" : "0123456789abcdef"
    let hex = ""

    for (let i = 0; i < length; i++) {
      hex += chars.charAt(this.random.int(0, 15))
    }

    return prefix ? `0x${hex}` : hex
  }

  /**
   * Generate a random BigInt
   */
  bigInt(options: { min?: bigint; max?: bigint } = {}): bigint {
    const { min = 0n, max = BigInt(Number.MAX_SAFE_INTEGER) } = options
    const range = max - min + 1n
    const randomBigInt = BigInt(Math.floor(Math.random() * Number(range)))
    return min + randomBigInt
  }

  /**
   * Generate a random boolean
   */
  boolean(probability = 0.5): boolean {
    return this.random.boolean(probability)
  }

  /**
   * Generate a random UUID v4
   */
  uuid(_options: UuidOptions = {}): string {
    const hex = "0123456789abcdef"

    const segments = [8, 4, 4, 4, 12]
    const parts: string[] = []

    for (const segmentIndex of segments.keys()) {
      const segmentLength = segments[segmentIndex]
      if (segmentLength === undefined) {
        throw new Error("Invalid UUID segment length")
      }
      let segment = ""

      for (let i = 0; i < segmentLength; i++) {
        if (segmentIndex === 2 && i === 0) {
          // Version 4
          segment += "4"
        } else if (segmentIndex === 3 && i === 0) {
          // Variant (8, 9, a, or b)
          segment += hex.charAt(this.random.int(8, 11))
        } else {
          segment += hex.charAt(this.random.int(0, 15))
        }
      }

      parts.push(segment)
    }

    return parts.join("-")
  }

  /**
   * Generate a random ULID
   */
  ulid(): string {
    const crockford = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
    const now = Date.now()

    // Encode timestamp (first 10 characters)
    let timestamp = ""
    let t = now
    for (let i = 0; i < 10; i++) {
      timestamp = crockford.charAt(t % 32) + timestamp
      t = Math.floor(t / 32)
    }

    // Random part (last 16 characters)
    let random = ""
    for (let i = 0; i < 16; i++) {
      random += crockford.charAt(this.random.int(0, 31))
    }

    return timestamp + random
  }

  /**
   * Generate a random Roman numeral
   */
  romanNumeral(options: { min?: number; max?: number } = {}): string {
    const { min = 1, max = 3999 } = options
    const num = this.random.int(min, Math.min(max, 3999))

    const romanNumerals: Array<[number, string]> = [
      [1000, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"],
    ]

    let result = ""
    let remaining = num

    for (const [value, symbol] of romanNumerals) {
      while (remaining >= value) {
        result += symbol
        remaining -= value
      }
    }

    return result
  }

  /**
   * Generate a random prime number
   */
  prime(options: { min?: number; max?: number } = {}): number {
    const { min = 2, max = 1000 } = options

    const isPrime = (n: number): boolean => {
      if (n < 2) return false
      if (n === 2) return true
      if (n % 2 === 0) return false
      for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false
      }
      return true
    }

    const primes: number[] = []
    for (let i = min; i <= max; i++) {
      if (isPrime(i)) primes.push(i)
    }

    if (primes.length === 0) {
      throw new Error(`No prime numbers in range [${min}, ${max}]`)
    }

    return this.random.pick(primes)
  }

  /**
   * Generate an array of random integers
   */
  intArray(
    options: { length?: number; min?: number; max?: number; unique?: boolean } = {},
  ): number[] {
    const { length = 10, min = 0, max = 100, unique = false } = options

    if (unique && max - min + 1 < length) {
      throw new Error("Cannot generate unique array: range too small")
    }

    if (unique) {
      const pool: number[] = []
      for (let i = min; i <= max; i++) pool.push(i)
      return this.random.pickMultiple(pool, length)
    }

    const result: number[] = []
    for (let i = 0; i < length; i++) {
      result.push(this.random.int(min, max))
    }

    return result
  }

  /**
   * Generate a number within a normal distribution
   */
  normal(options: { mean?: number; stdDev?: number } = {}): number {
    const { mean = 0, stdDev = 1 } = options

    // Box-Muller transform
    const u1 = this.random.random()
    const u2 = this.random.random()

    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)

    return z0 * stdDev + mean
  }

  /**
   * Generate a random positive number
   */
  positive(options: { max?: number } = {}): number {
    const { max = Number.MAX_SAFE_INTEGER } = options
    return this.random.int(1, max)
  }

  /**
   * Generate a random negative number
   */
  negative(options: { min?: number } = {}): number {
    const { min = Number.MIN_SAFE_INTEGER } = options
    return this.random.int(min, -1)
  }

  /**
   * Generate a random percentage (0-100)
   */
  percentage(options: { decimals?: number } = {}): number {
    const { decimals = 0 } = options
    return Number(this.random.float(0, 100).toFixed(decimals))
  }
}
