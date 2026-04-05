import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { Address, AddressOptions } from "../types.js"

/**
 * Generates address and geolocation-related data.
 */
export class LocationProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random street name
   */
  streetName(): string {
    const suffix = this.random.pick(this.locale.location.streetSuffix)
    const name = this.random.pick(this.locale.person.lastName)
    return `${name} ${suffix}`
  }

  /**
   * Generate a random street number
   */
  streetNumber(): string {
    return String(this.random.int(1, 9999))
  }

  /**
   * Generate a full street address
   */
  streetAddress(includeSecondary = false): string {
    const number = this.streetNumber()
    const street = this.streetName()
    let address = `${number} ${street}`

    if (includeSecondary) {
      const secondary = this.secondaryAddress()
      address += `, ${secondary}`
    }

    return address
  }

  /**
   * Generate a secondary address (apartment, suite, etc.)
   */
  secondaryAddress(): string {
    const format = this.random.pick(this.locale.location.secondaryAddress)
    return format.replace(/#/g, () => String(this.random.int(1, 9)))
  }

  /**
   * Generate a random city name
   */
  city(): string {
    return this.random.pick(this.locale.location.city)
  }

  /**
   * Generate a random state name
   */
  state(abbreviated = false): string {
    const state = this.random.pick(this.locale.location.state)
    return abbreviated ? state.abbr : state.name
  }

  /**
   * Generate a random state abbreviation
   */
  stateAbbr(): string {
    return this.state(true)
  }

  /**
   * Generate a random zip/postal code
   */
  zipCode(): string {
    const format = this.random.pick(this.locale.location.zipCodeFormats)
    return format.replace(/#/g, () => String(this.random.int(0, 9)))
  }

  /**
   * Generate a random country name
   */
  country(): string {
    return this.random.pick(this.locale.location.country).name
  }

  /**
   * Generate a random country code
   */
  countryCode(): string {
    return this.random.pick(this.locale.location.country).code
  }

  /**
   * Generate a random latitude
   */
  latitude(options: { min?: number; max?: number; precision?: number } = {}): number {
    const { min = -90, max = 90, precision = 6 } = options
    const value = this.random.float(min, max)
    return Number(value.toFixed(precision))
  }

  /**
   * Generate a random longitude
   */
  longitude(options: { min?: number; max?: number; precision?: number } = {}): number {
    const { min = -180, max = 180, precision = 6 } = options
    const value = this.random.float(min, max)
    return Number(value.toFixed(precision))
  }

  /**
   * Generate random coordinates
   */
  coordinates(options: { precision?: number } = {}): { latitude: number; longitude: number } {
    return {
      latitude: this.latitude(options),
      longitude: this.longitude(options),
    }
  }

  /**
   * Generate a random direction
   */
  direction(abbreviated = false): string {
    return abbreviated
      ? this.random.pick(this.locale.location.directionAbbr)
      : this.random.pick(this.locale.location.direction)
  }

  /**
   * Generate a random cardinal direction
   */
  cardinalDirection(abbreviated = false): string {
    const cardinals = abbreviated ? ["N", "S", "E", "W"] : ["North", "South", "East", "West"]
    return this.random.pick(cardinals)
  }

  /**
   * Generate a random ordinal direction
   */
  ordinalDirection(abbreviated = false): string {
    const ordinals = abbreviated
      ? ["NE", "NW", "SE", "SW"]
      : ["Northeast", "Northwest", "Southeast", "Southwest"]
    return this.random.pick(ordinals)
  }

  /**
   * Generate a random timezone
   */
  timeZone(): string {
    const timezones = [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Anchorage",
      "Pacific/Honolulu",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Madrid",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Asia/Singapore",
      "Australia/Sydney",
      "America/Sao_Paulo",
      "America/Mexico_City",
    ]
    return this.random.pick(timezones)
  }

  /**
   * Generate a random building number
   */
  buildingNumber(): string {
    return String(this.random.int(1, 999))
  }

  /**
   * Generate a random floor number
   */
  floor(options: { min?: number; max?: number } = {}): number {
    const { min = 1, max = 50 } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a nearby GPS coordinate
   */
  nearbyCoordinates(
    latitude: number,
    longitude: number,
    radius = 0.01,
  ): { latitude: number; longitude: number } {
    const latOffset = this.random.float(-1, 1) * radius
    const lonOffset = this.random.float(-1, 1) * radius

    return {
      latitude: Number((latitude + latOffset).toFixed(6)),
      longitude: Number((longitude + lonOffset).toFixed(6)),
    }
  }

  /**
   * Generate a full address
   */
  address(options: AddressOptions = {}): Address {
    const { includeSecondary = false, abbreviateState = true } = options

    const street = this.streetAddress(includeSecondary)
    const streetNumber = this.streetNumber()
    const secondaryAddress = includeSecondary ? this.secondaryAddress() : undefined
    const city = this.city()
    const stateData = this.random.pick(this.locale.location.state)
    const zipCode = this.zipCode()
    const countryData = this.random.pick(this.locale.location.country)
    const coords = this.coordinates()

    const stateName = abbreviateState ? stateData.abbr : stateData.name
    const fullAddress = secondaryAddress
      ? `${street}, ${city}, ${stateName} ${zipCode}, ${countryData.name}`
      : `${streetNumber} ${this.streetName()}, ${city}, ${stateName} ${zipCode}, ${countryData.name}`

    return {
      street,
      streetNumber,
      secondaryAddress,
      city,
      state: stateData.name,
      stateAbbr: stateData.abbr,
      zipCode,
      country: countryData.name,
      countryCode: countryData.code,
      latitude: coords.latitude,
      longitude: coords.longitude,
      fullAddress,
    }
  }
}
