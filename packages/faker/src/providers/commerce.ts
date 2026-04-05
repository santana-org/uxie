import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { Product } from "../types.js"

export class CommerceProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random product name
   */
  productName(): string {
    const adjective = this.random.pick(this.locale.commerce.productAdjective)
    const material = this.random.pick(this.locale.commerce.productMaterial)
    const product = this.random.pick(this.locale.commerce.productName)

    return `${adjective} ${material} ${product}`
  }

  /**
   * Generate a random product adjective
   */
  productAdjective(): string {
    return this.random.pick(this.locale.commerce.productAdjective)
  }

  /**
   * Generate a random product material
   */
  productMaterial(): string {
    return this.random.pick(this.locale.commerce.productMaterial)
  }

  /**
   * Generate a random product
   */
  product(): string {
    return this.random.pick(this.locale.commerce.productName)
  }

  /**
   * Generate a random department
   */
  department(): string {
    return this.random.pick(this.locale.commerce.department)
  }

  /**
   * Generate a random price
   */
  price(options: { min?: number; max?: number; decimals?: number; symbol?: string } = {}): string {
    const { min = 1, max = 1000, decimals = 2, symbol = "$" } = options
    const price = this.random.float(min, max).toFixed(decimals)
    return `${symbol}${price}`
  }

  /**
   * Generate a random price as a number
   */
  priceNumber(options: { min?: number; max?: number; decimals?: number } = {}): number {
    const { min = 1, max = 1000, decimals = 2 } = options
    return Number(this.random.float(min, max).toFixed(decimals))
  }

  /**
   * Generate a random SKU (Stock Keeping Unit)
   */
  sku(options: { prefix?: string; length?: number } = {}): string {
    const { prefix = "", length = 8 } = options
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let sku = prefix

    for (let i = 0; i < length - prefix.length; i++) {
      sku += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return sku
  }

  /**
   * Generate a random EAN-13 barcode
   */
  ean13(): string {
    let ean = ""

    for (let i = 0; i < 12; i++) {
      ean += String(this.random.int(0, 9))
    }

    // Calculate checksum
    let sum = 0
    for (let i = 0; i < 12; i++) {
      const digit = Number.parseInt(ean[i] ?? "0", 10)
      sum += i % 2 === 0 ? digit : digit * 3
    }
    const checksum = (10 - (sum % 10)) % 10
    ean += String(checksum)

    return ean
  }

  /**
   * Generate a random EAN-8 barcode
   */
  ean8(): string {
    let ean = ""

    for (let i = 0; i < 7; i++) {
      ean += String(this.random.int(0, 9))
    }

    // Calculate checksum
    let sum = 0
    for (let i = 0; i < 7; i++) {
      const digit = Number.parseInt(ean[i] ?? "0", 10)
      sum += i % 2 === 0 ? digit * 3 : digit
    }
    const checksum = (10 - (sum % 10)) % 10
    ean += String(checksum)

    return ean
  }

  /**
   * Generate a random UPC-A barcode
   */
  upc(): string {
    let upc = ""

    for (let i = 0; i < 11; i++) {
      upc += String(this.random.int(0, 9))
    }

    // Calculate checksum
    let sum = 0
    for (let i = 0; i < 11; i++) {
      const digit = Number.parseInt(upc[i] ?? "0", 10)
      sum += i % 2 === 0 ? digit * 3 : digit
    }
    const checksum = (10 - (sum % 10)) % 10
    upc += String(checksum)

    return upc
  }

  /**
   * Generate a random ISBN-10
   */
  isbn10(): string {
    let isbn = ""

    for (let i = 0; i < 9; i++) {
      isbn += String(this.random.int(0, 9))
    }

    // Calculate checksum
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(isbn[i] ?? "0", 10) * (10 - i)
    }
    const checksum = (11 - (sum % 11)) % 11
    isbn += checksum === 10 ? "X" : String(checksum)

    return isbn
  }

  /**
   * Generate a random ISBN-13
   */
  isbn13(): string {
    let isbn = this.random.pick(["978", "979"])

    for (let i = 0; i < 9; i++) {
      isbn += String(this.random.int(0, 9))
    }

    // Calculate checksum
    let sum = 0
    for (let i = 0; i < 12; i++) {
      const digit = Number.parseInt(isbn[i] ?? "0", 10)
      sum += i % 2 === 0 ? digit : digit * 3
    }
    const checksum = (10 - (sum % 10)) % 10
    isbn += String(checksum)

    return isbn
  }

  /**
   * Generate a product description
   */
  productDescription(): string {
    const adjectives = this.locale.commerce.productAdjective
    const adj1 = this.random.pick(adjectives)
    const adj2 = this.random.pick(adjectives.filter((a) => a !== adj1))

    const templates = [
      `This ${adj1.toLowerCase()} product is perfect for everyday use.`,
      `A ${adj1.toLowerCase()} and ${adj2.toLowerCase()} addition to your collection.`,
      `Experience the ${adj1.toLowerCase()} quality of this amazing product.`,
      `${adj1} design meets ${adj2.toLowerCase()} functionality.`,
      `The perfect ${adj1.toLowerCase()} solution for your needs.`,
    ]

    return this.random.pick(templates)
  }

  /**
   * Generate a complete product object
   */
  fullProduct(): Product {
    const name = this.productName()
    const description = this.productDescription()
    const price = this.priceNumber()
    const category = this.department()
    const material = this.productMaterial()
    const color = this.random.pick(this.locale.color.names)
    const sku = this.sku()
    const ean = this.ean13()

    return {
      name,
      description,
      price,
      category,
      material,
      color,
      sku,
      ean,
    }
  }

  /**
   * Generate a random discount percentage
   */
  discount(options: { min?: number; max?: number } = {}): string {
    const { min = 5, max = 50 } = options
    const discount = this.random.int(min, max)
    return `${discount}%`
  }

  /**
   * Generate a random quantity
   */
  quantity(options: { min?: number; max?: number } = {}): number {
    const { min = 1, max = 100 } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a random review rating
   */
  rating(options: { min?: number; max?: number; decimals?: number } = {}): number {
    const { min = 1, max = 5, decimals = 1 } = options
    return Number(this.random.float(min, max).toFixed(decimals))
  }

  /**
   * Generate a random review
   */
  review(): { rating: number; title: string; comment: string; author: string; date: Date } {
    const rating = this.rating()
    const firstName = this.random.pick(
      this.locale.person.firstNameMale.concat(this.locale.person.firstNameFemale),
    )
    const lastName = this.random.pick(this.locale.person.lastName)

    const positiveTitles = [
      "Great product!",
      "Love it!",
      "Excellent quality",
      "Highly recommend",
      "Amazing!",
    ]
    const neutralTitles = ["Good product", "As expected", "Decent", "Fair", "Okay"]
    const negativeTitles = [
      "Disappointed",
      "Not worth it",
      "Could be better",
      "Poor quality",
      "Would not buy again",
    ]

    let title: string
    let commentStart: string

    if (rating >= 4) {
      title = this.random.pick(positiveTitles)
      commentStart = "Really happy with this purchase."
    } else if (rating >= 3) {
      title = this.random.pick(neutralTitles)
      commentStart = "The product is decent for the price."
    } else {
      title = this.random.pick(negativeTitles)
      commentStart = "Not satisfied with this product."
    }

    const date = new Date()
    date.setDate(date.getDate() - this.random.int(1, 365))

    return {
      rating,
      title,
      comment: commentStart,
      author: `${firstName} ${lastName.charAt(0)}.`,
      date,
    }
  }
}
