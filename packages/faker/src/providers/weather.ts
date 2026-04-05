import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class WeatherProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random weather condition
   */
  condition(): string {
    const conditions = [
      "Sunny",
      "Cloudy",
      "Rainy",
      "Stormy",
      "Snowy",
      "Foggy",
      "Windy",
      "Drizzle",
      "Sleet",
      "Hail",
      "Thunder",
      "Clear",
    ]
    return this.random.pick(conditions)
  }

  /**
   * Generate a random temperature in Celsius
   */
  temperatureCelsius(): number {
    return Math.round(this.random.float(-30, 45) * 10) / 10
  }

  /**
   * Generate a random temperature in Fahrenheit
   */
  temperatureFahrenheit(): number {
    const celsius = this.temperatureCelsius()
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10
  }

  /**
   * Generate a random humidity percentage (0-100)
   */
  humidity(): number {
    return this.random.int(10, 100)
  }

  /**
   * Generate a random wind speed in km/h
   */
  windSpeed(): number {
    return this.random.int(0, 100)
  }

  /**
   * Generate a random wind direction
   */
  windDirection(): string {
    const directions = [
      "North",
      "Northeast",
      "East",
      "Southeast",
      "South",
      "Southwest",
      "West",
      "Northwest",
    ]
    return this.random.pick(directions)
  }

  /**
   * Generate a random atmospheric pressure in hPa
   */
  pressure(): number {
    return Math.round(this.random.float(980, 1040) * 10) / 10
  }

  /**
   * Generate a random visibility in kilometers
   */
  visibility(): number {
    return Math.round(this.random.float(0.1, 20) * 10) / 10
  }

  /**
   * Generate a random UV index (0-11+)
   */
  uvIndex(): number {
    return this.random.int(0, 12)
  }

  /**
   * Generate a random precipitation level in mm
   */
  precipitation(): number {
    return Math.round(this.random.float(0, 50) * 10) / 10
  }

  /**
   * Generate a weather forecast description
   */
  forecast(): string {
    const condition = this.condition()
    const temp = this.temperatureCelsius()
    const humidity = this.humidity()
    const windSpeed = this.windSpeed()
    return `${condition}, ${temp}°C, ${humidity}% humidity, ${windSpeed} km/h winds`
  }

  /**
   * Generate a random cloud coverage percentage (0-100)
   */
  cloudCoverage(): number {
    return this.random.int(0, 100)
  }

  /**
   * Generate a random dew point in Celsius
   */
  dewPoint(): number {
    return Math.round(this.random.float(-10, 30) * 10) / 10
  }

  /**
   * Generate a weather alert type
   */
  alertType(): string {
    const alerts = [
      "Severe Thunderstorm Warning",
      "Winter Storm Warning",
      "Heat Advisory",
      "Flood Watch",
      "Wind Advisory",
      "Frost Advisory",
      "Air Quality Alert",
    ]
    return this.random.pick(alerts)
  }
}
