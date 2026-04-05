import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { LoremOptions } from "../types.js"

export class LoremProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random word
   */
  word(): string {
    return this.random.pick(this.locale.lorem.words)
  }

  /**
   * Generate multiple random words
   */
  words(options: LoremOptions = {}): string {
    const { min = 3, max = 10 } = options
    const count = this.random.int(min, max)
    const words: string[] = []

    for (let i = 0; i < count; i++) {
      words.push(this.word())
    }

    return words.join(" ")
  }

  /**
   * Generate a sentence
   */
  sentence(options: LoremOptions = {}): string {
    const { min = 5, max = 15 } = options
    const wordCount = this.random.int(min, max)
    const words: string[] = []

    for (let i = 0; i < wordCount; i++) {
      words.push(this.word())
    }

    const sentence = words.join(" ")
    return `${sentence.charAt(0).toUpperCase() + sentence.slice(1)}.`
  }

  /**
   * Generate multiple sentences
   */
  sentences(options: LoremOptions & { sentenceCount?: number } = {}): string {
    const { min = 3, max = 6 } = options
    const count = options.sentenceCount ?? this.random.int(min, max)
    const sentences: string[] = []

    for (let i = 0; i < count; i++) {
      sentences.push(this.sentence())
    }

    return sentences.join(" ")
  }

  /**
   * Generate a paragraph
   */
  paragraph(options: LoremOptions = {}): string {
    const { min = 3, max = 7 } = options
    return this.sentences({ sentenceCount: this.random.int(min, max) })
  }

  /**
   * Generate multiple paragraphs
   */
  paragraphs(options: LoremOptions & { paragraphCount?: number; separator?: string } = {}): string {
    const { min = 3, max = 6, separator = "\n\n" } = options
    const count = options.paragraphCount ?? this.random.int(min, max)
    const paragraphs: string[] = []

    for (let i = 0; i < count; i++) {
      paragraphs.push(this.paragraph())
    }

    return paragraphs.join(separator)
  }

  /**
   * Generate a text of specified length
   */
  text(options: { length?: number } = {}): string {
    const { length = 200 } = options
    let text = ""

    while (text.length < length) {
      text += `${this.paragraph()} `
    }

    return text.substring(0, length).trim()
  }

  /**
   * Generate lines of text
   */
  lines(options: LoremOptions = {}): string {
    const { min = 2, max = 5 } = options
    const count = this.random.int(min, max)
    const lines: string[] = []

    for (let i = 0; i < count; i++) {
      lines.push(this.sentence())
    }

    return lines.join("\n")
  }

  /**
   * Generate a slug-friendly text
   */
  slug(options: LoremOptions = {}): string {
    const { min = 2, max = 5 } = options
    const wordCount = this.random.int(min, max)
    const words: string[] = []

    for (let i = 0; i < wordCount; i++) {
      words.push(this.word())
    }

    return words.join("-").toLowerCase()
  }
}
