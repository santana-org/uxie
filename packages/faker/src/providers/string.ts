import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

/**
 * Generates random strings and token-like text values.
 */
export class StringProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random alphanumeric string
   */
  alphanumeric(options: { length?: number; casing?: "lower" | "upper" | "mixed" } = {}): string {
    const { length = 10, casing = "mixed" } = options

    let chars = "0123456789"
    switch (casing) {
      case "lower":
        chars += "abcdefghijklmnopqrstuvwxyz"
        break
      case "upper":
        chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        break
      case "mixed":
        chars += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        break
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return result
  }

  /**
   * Generate a random alpha string (letters only)
   */
  alpha(options: { length?: number; casing?: "lower" | "upper" | "mixed" } = {}): string {
    const { length = 10, casing = "mixed" } = options

    let chars: string
    switch (casing) {
      case "lower":
        chars = "abcdefghijklmnopqrstuvwxyz"
        break
      case "upper":
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        break
      case "mixed":
        chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        break
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return result
  }

  /**
   * Generate a random numeric string
   */
  numeric(options: { length?: number; allowLeadingZeros?: boolean } = {}): string {
    const { length = 10, allowLeadingZeros = true } = options

    let result = ""

    for (let i = 0; i < length; i++) {
      if (i === 0 && !allowLeadingZeros) {
        result += String(this.random.int(1, 9))
      } else {
        result += String(this.random.int(0, 9))
      }
    }

    return result
  }

  /**
   * Generate a random hexadecimal string
   */
  hexadecimal(
    options: { length?: number; prefix?: string; casing?: "lower" | "upper" | "mixed" } = {},
  ): string {
    const { length = 8, prefix = "0x", casing = "mixed" } = options

    let chars: string
    switch (casing) {
      case "lower":
        chars = "0123456789abcdef"
        break
      case "upper":
        chars = "0123456789ABCDEF"
        break
      case "mixed":
        chars = "0123456789abcdefABCDEF"
        break
    }

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return prefix + result
  }

  /**
   * Generate a random binary string
   */
  binary(options: { length?: number; prefix?: string } = {}): string {
    const { length = 8, prefix = "0b" } = options

    let result = ""
    for (let i = 0; i < length; i++) {
      result += String(this.random.int(0, 1))
    }

    return prefix + result
  }

  /**
   * Generate a random octal string
   */
  octal(options: { length?: number; prefix?: string } = {}): string {
    const { length = 8, prefix = "0o" } = options

    let result = ""
    for (let i = 0; i < length; i++) {
      result += String(this.random.int(0, 7))
    }

    return prefix + result
  }

  /**
   * Generate a string from a pattern
   * # = digit, ? = letter, * = alphanumeric
   */
  fromPattern(pattern: string): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const digits = "0123456789"
    const alphanumeric = letters + digits

    let result = ""
    for (const char of pattern) {
      switch (char) {
        case "#":
          result += digits.charAt(this.random.int(0, digits.length - 1))
          break
        case "?":
          result += letters.charAt(this.random.int(0, letters.length - 1))
          break
        case "*":
          result += alphanumeric.charAt(this.random.int(0, alphanumeric.length - 1))
          break
        default:
          result += char
      }
    }

    return result
  }

  /**
   * Generate a random symbol
   */
  symbol(options: { length?: number } = {}): string {
    const { length = 1 } = options
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`"

    let result = ""
    for (let i = 0; i < length; i++) {
      result += symbols.charAt(this.random.int(0, symbols.length - 1))
    }

    return result
  }

  /**
   * Generate a random sample from a given string
   */
  sample(str: string, length?: number): string {
    const sampleLength = length ?? this.random.int(1, str.length)
    const indices = this.random.pickMultiple(
      [...Array(str.length).keys()],
      Math.min(sampleLength, str.length),
    )

    return indices.map((i) => str[i]).join("")
  }

  /**
   * Generate a nanoid-like string
   */
  nanoid(options: { length?: number } = {}): string {
    const { length = 21 } = options
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-"

    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return result
  }

  /**
   * Generate a random word from locale
   */
  word(): string {
    return this.random.pick(this.locale.lorem.words)
  }

  /**
   * Generate multiple random words
   */
  words(options: { min?: number; max?: number } = {}): string {
    const { min = 1, max = 5 } = options
    const count = this.random.int(min, max)
    const words: string[] = []

    for (let i = 0; i < count; i++) {
      words.push(this.word())
    }

    return words.join(" ")
  }

  /**
   * Generate a random adjective
   */
  adjective(): string {
    return this.random.pick(this.locale.word.adjective)
  }

  /**
   * Generate a random noun
   */
  noun(): string {
    return this.random.pick(this.locale.word.noun)
  }

  /**
   * Generate a random verb
   */
  verb(): string {
    return this.random.pick(this.locale.word.verb)
  }

  /**
   * Generate a random adverb
   */
  adverb(): string {
    return this.random.pick(this.locale.word.adverb)
  }

  /**
   * Generate a random conjunction
   */
  conjunction(): string {
    return this.random.pick(this.locale.word.conjunction)
  }

  /**
   * Generate a random preposition
   */
  preposition(): string {
    return this.random.pick(this.locale.word.preposition)
  }

  /**
   * Generate a random interjection
   */
  interjection(): string {
    return this.random.pick(this.locale.word.interjection)
  }
}
