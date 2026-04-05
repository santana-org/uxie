import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class RealEstateProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random property price
   */
  price(): number {
    return Math.round(this.random.int(50000, 2000000) / 1000) * 1000
  }

  /**
   * Generate a random number of bedrooms
   */
  bedrooms(): number {
    return this.random.int(1, 6)
  }

  /**
   * Generate a random number of bathrooms
   */
  bathrooms(): number {
    return this.random.float(1, 4)
  }

  /**
   * Generate a random square footage
   */
  squareFootage(): number {
    return this.random.int(500, 5000)
  }

  /**
   * Generate a random property type
   */
  propertyType(): string {
    const types = [
      "Single Family Home",
      "Condo",
      "Townhouse",
      "Multi-Family Home",
      "Land",
      "Mobile Home",
      "Farm",
      "Commercial",
      "Apartment Complex",
    ]
    return this.random.pick(types)
  }

  /**
   * Generate a random property status
   */
  status(): string {
    const statuses = ["For Sale", "For Rent", "Sold", "Pending", "Coming Soon", "Off Market"]
    return this.random.pick(statuses)
  }

  /**
   * Generate a random real estate listing description
   */
  description(): string {
    const descriptions = [
      `Beautiful ${this.propertyType()} with ${this.bedrooms()} bedrooms and ${this.bathrooms()} bathrooms. ${this.squareFootage()} sq ft.`,
      `Charming property featuring modern amenities. Perfect for ${this.random.pick(["families", "professionals", "investors"])}.`,
      `Spacious ${this.propertyType()} in a ${this.random.pick(["quiet", "vibrant", "peaceful"])} neighborhood.`,
      `Newly renovated ${this.propertyType()} with stunning finishes and great location.`,
      `Investment opportunity! ${this.propertyType()} with excellent ${this.random.pick(["rental", "resale"])} potential.`,
    ]
    return this.random.pick(descriptions)
  }

  /**
   * Generate a random listing ID
   */
  listingId(): string {
    const prefix = this.random.pick(["MLS", "REI", "PRO"])
    const id = this.random.int(100000, 999999)
    return `${prefix}-${id}`
  }

  /**
   * Generate a random property address
   */
  address(): string {
    const street = `${this.random.int(1, 9999)} ${this.random.pick(this.locale.location.streetSuffix || ["Street", "Avenue", "Boulevard", "Road", "Drive"])}`
    const city = this.random.pick(
      this.locale.location.city || ["Springfield", "Portland", "Seattle"],
    )
    const state = this.random.pick(this.locale.location.state || ["CA", "NY", "TX"])
    const zip = this.random.int(10000, 99999)
    return `${street}, ${city}, ${state} ${zip}`
  }

  /**
   * Generate a random year built
   */
  yearBuilt(): number {
    return this.random.int(1950, new Date().getFullYear())
  }

  /**
   * Generate a random property rating (1-5)
   */
  rating(): number {
    return this.random.float(2.5, 5)
  }

  /**
   * Generate a random homeowners association fee
   */
  hoaFee(): number {
    return Math.round(this.random.int(0, 500) / 10) * 10
  }
}
