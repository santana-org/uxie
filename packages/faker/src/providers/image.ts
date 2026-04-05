import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { ImageOptions } from "../types.js"

export class ImageProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly _locale: LocaleData,
  ) {}

  /**
   * Generate a random placeholder image URL
   */
  url(options: ImageOptions = {}): string {
    const { width = 640, height = 480, grayscale = false } = options

    const id = this.random.int(1, 1000)
    let url = `https://picsum.photos/seed/${id}/${width}/${height}`

    if (grayscale) {
      url += "?grayscale"
    }

    return url
  }

  /**
   * Generate a random avatar URL
   */
  avatar(options: { size?: number } = {}): string {
    const { size = 200 } = options
    const id = this.random.int(1, 1000)

    const services = [
      `https://i.pravatar.cc/${size}?u=${id}`,
      `https://avatars.dicebear.com/api/identicon/${id}.svg?size=${size}`,
      `https://robohash.org/${id}?size=${size}x${size}`,
    ]

    return this.random.pick(services)
  }

  /**
   * Generate a random image URL by category
   */
  category(options: ImageOptions = {}): string {
    const { category = "nature", width = 640, height = 480 } = options

    const categories: Record<string, string> = {
      abstract: "abstract",
      animals: "animals",
      business: "business",
      cats: "cats",
      city: "city",
      food: "food",
      nature: "nature",
      people: "people",
      sports: "sports",
      technics: "technics",
      transport: "transport",
    }

    const cat = category ? (categories[category] ?? "nature") : "nature"
    const id = this.random.int(1, 100)

    return `https://loremflickr.com/${width}/${height}/${cat}?lock=${id}`
  }

  /**
   * Generate a random SVG data URL
   */
  dataUri(options: { width?: number; height?: number; color?: string } = {}): string {
    const { width = 200, height = 200, color } = options

    const bgColor = color ?? `#${this.random.int(0, 16777215).toString(16).padStart(6, "0")}`

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bgColor}"/></svg>`

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
  }

  /**
   * Generate a random placeholder.com image URL
   */
  placeholder(
    options: { width?: number; height?: number; text?: string; bg?: string; fg?: string } = {},
  ): string {
    const { width = 640, height = 480, text, bg = "cccccc", fg = "333333" } = options

    let url = `https://via.placeholder.com/${width}x${height}/${bg}/${fg}`

    if (text) {
      url += `?text=${encodeURIComponent(text)}`
    }

    return url
  }

  /**
   * Generate a random abstract image URL
   */
  abstract(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "abstract" })
  }

  /**
   * Generate a random animal image URL
   */
  animals(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "animals" })
  }

  /**
   * Generate a random business image URL
   */
  business(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "business" })
  }

  /**
   * Generate a random cat image URL
   */
  cats(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "cats" })
  }

  /**
   * Generate a random city image URL
   */
  city(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "city" })
  }

  /**
   * Generate a random food image URL
   */
  food(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "food" })
  }

  /**
   * Generate a random nature image URL
   */
  nature(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "nature" })
  }

  /**
   * Generate a random people image URL
   */
  people(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "people" })
  }

  /**
   * Generate a random sports image URL
   */
  sports(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "sports" })
  }

  /**
   * Generate a random technology image URL
   */
  technics(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "technics" })
  }

  /**
   * Generate a random transport image URL
   */
  transport(options: { width?: number; height?: number } = {}): string {
    return this.category({ ...options, category: "transport" })
  }

  /**
   * Generate a random image dimensions
   */
  dimensions(): { width: number; height: number } {
    const commonSizes = [
      { width: 640, height: 480 },
      { width: 800, height: 600 },
      { width: 1024, height: 768 },
      { width: 1280, height: 720 },
      { width: 1920, height: 1080 },
      { width: 1200, height: 630 }, // OG image
      { width: 1080, height: 1080 }, // Instagram square
      { width: 1080, height: 1350 }, // Instagram portrait
    ]

    return this.random.pick(commonSizes)
  }
}
