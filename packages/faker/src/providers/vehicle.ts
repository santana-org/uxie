import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { Vehicle } from "../types.js"

export class VehicleProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random vehicle manufacturer
   */
  manufacturer(): string {
    return this.random.pick(this.locale.vehicle.manufacturer)
  }

  /**
   * Generate a random vehicle model
   */
  model(options: { manufacturer?: string } = {}): string {
    const { manufacturer } = options

    if (
      manufacturer &&
      this.locale.vehicle.model[manufacturer as keyof typeof this.locale.vehicle.model]
    ) {
      const models =
        this.locale.vehicle.model[manufacturer as keyof typeof this.locale.vehicle.model]
      return this.random.pick(models)
    }

    // Get all models from all manufacturers
    const allModels = Object.values(this.locale.vehicle.model).flat()
    return this.random.pick(allModels)
  }

  /**
   * Generate a random vehicle type
   */
  type(): string {
    return this.random.pick(this.locale.vehicle.type)
  }

  /**
   * Generate a random fuel type
   */
  fuel(): string {
    return this.random.pick(this.locale.vehicle.fuel)
  }

  /**
   * Generate a random vehicle color
   */
  color(): string {
    return this.random.pick(this.locale.vehicle.color)
  }

  /**
   * Generate a random VIN (Vehicle Identification Number)
   */
  vin(): string {
    // VIN uses specific characters (excludes I, O, Q)
    const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"
    let vin = ""

    // WMI (World Manufacturer Identifier) - 3 characters
    for (let i = 0; i < 3; i++) {
      vin += chars.charAt(this.random.int(0, chars.length - 1))
    }

    // VDS (Vehicle Descriptor Section) - 6 characters
    for (let i = 0; i < 6; i++) {
      vin += chars.charAt(this.random.int(0, chars.length - 1))
    }

    // VIS (Vehicle Identifier Section) - 8 characters
    for (let i = 0; i < 8; i++) {
      vin += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return vin
  }

  /**
   * Generate a random vehicle registration/license plate
   */
  licensePlate(options: { format?: string } = {}): string {
    const { format = "AAA-####" } = options

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    return format
      .replace(/A/g, () => letters.charAt(this.random.int(0, letters.length - 1)))
      .replace(/#/g, () => String(this.random.int(0, 9)))
  }

  /**
   * Generate a random vehicle year
   */
  year(options: { min?: number; max?: number } = {}): number {
    const { min = 1990, max = new Date().getFullYear() + 1 } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a random mileage/odometer reading
   */
  mileage(options: { min?: number; max?: number } = {}): number {
    const { min = 0, max = 200000 } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a complete vehicle object
   */
  vehicle(): Vehicle {
    const manufacturer = this.manufacturer()
    const model = this.model({ manufacturer })
    const type = this.type()
    const fuel = this.fuel()
    const vin = this.vin()
    const color = this.color()
    const year = this.year()
    const licensePlate = this.licensePlate()

    return {
      manufacturer,
      model,
      type,
      fuel,
      vin,
      color,
      year,
      licensePlate,
    }
  }

  /**
   * Generate a random bicycle type
   */
  bicycle(): string {
    const types = [
      "Mountain Bike",
      "Road Bike",
      "Hybrid Bike",
      "BMX",
      "Cruiser",
      "Electric Bike",
      "Folding Bike",
      "Gravel Bike",
      "Track Bike",
      "Tandem",
    ]
    return this.random.pick(types)
  }

  /**
   * Generate a random motorcycle type
   */
  motorcycle(): string {
    const types = [
      "Sport",
      "Cruiser",
      "Touring",
      "Standard",
      "Dual-Sport",
      "Adventure",
      "Naked",
      "Cafe Racer",
      "Chopper",
      "Scrambler",
    ]
    return this.random.pick(types)
  }

  /**
   * Generate a random vehicle transmission type
   */
  transmission(): string {
    const types = ["Manual", "Automatic", "CVT", "Semi-Automatic", "Dual-Clutch"]
    return this.random.pick(types)
  }

  /**
   * Generate a random engine size
   */
  engineSize(): string {
    const sizes = [
      "1.0L",
      "1.2L",
      "1.4L",
      "1.6L",
      "1.8L",
      "2.0L",
      "2.4L",
      "2.5L",
      "3.0L",
      "3.5L",
      "4.0L",
      "5.0L",
      "6.0L",
    ]
    return this.random.pick(sizes)
  }

  /**
   * Generate a random number of doors
   */
  doors(): number {
    return this.random.pick([2, 3, 4, 5])
  }

  /**
   * Generate a random number of seats
   */
  seats(): number {
    return this.random.pick([2, 4, 5, 6, 7, 8, 9])
  }

  /**
   * Generate a random horsepower
   */
  horsepower(options: { min?: number; max?: number } = {}): number {
    const { min = 80, max = 500 } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a random MPG (miles per gallon)
   */
  mpg(options: { min?: number; max?: number } = {}): number {
    const { min = 15, max = 60 } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a random drivetrain type
   */
  drivetrain(): string {
    const types = ["FWD", "RWD", "AWD", "4WD"]
    return this.random.pick(types)
  }
}
