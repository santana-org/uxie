import type { MersenneTwister } from "../random.js"
import type { DateOptions } from "../types.js"

/**
 * Generates date and time related values.
 */
export class DateProvider {
  constructor(private readonly random: MersenneTwister) {}

  /**
   * Generate a random date in the past
   */
  past(options: { years?: number; refDate?: Date } = {}): Date {
    const { years = 1, refDate = new Date() } = options
    const past = new Date(refDate)
    past.setFullYear(past.getFullYear() - years)

    const timestamp = this.random.int(past.getTime(), refDate.getTime())
    return new Date(timestamp)
  }

  /**
   * Generate a random date in the future
   */
  future(options: { years?: number; refDate?: Date } = {}): Date {
    const { years = 1, refDate = new Date() } = options
    const future = new Date(refDate)
    future.setFullYear(future.getFullYear() + years)

    const timestamp = this.random.int(refDate.getTime(), future.getTime())
    return new Date(timestamp)
  }

  /**
   * Generate a random date between two dates
   */
  between(options: DateOptions = {}): Date {
    const { min = new Date("2000-01-01"), max = new Date() } = options
    const timestamp = this.random.int(min.getTime(), max.getTime())
    return new Date(timestamp)
  }

  /**
   * Generate multiple random dates between two dates
   */
  betweens(options: DateOptions & { count?: number } = {}): Date[] {
    const { count = 3 } = options
    const dates: Date[] = []

    for (let i = 0; i < count; i++) {
      dates.push(this.between(options))
    }

    return dates.sort((a, b) => a.getTime() - b.getTime())
  }

  /**
   * Generate a recent date
   */
  recent(options: { days?: number; refDate?: Date } = {}): Date {
    const { days = 7, refDate = new Date() } = options
    const minDate = new Date(refDate)
    minDate.setDate(minDate.getDate() - days)

    const timestamp = this.random.int(minDate.getTime(), refDate.getTime())
    return new Date(timestamp)
  }

  /**
   * Generate a date soon (in the near future)
   */
  soon(options: { days?: number; refDate?: Date } = {}): Date {
    const { days = 7, refDate = new Date() } = options
    const maxDate = new Date(refDate)
    maxDate.setDate(maxDate.getDate() + days)

    const timestamp = this.random.int(refDate.getTime(), maxDate.getTime())
    return new Date(timestamp)
  }

  /**
   * Generate a random month name
   */
  month(options: { abbreviated?: boolean } = {}): string {
    const { abbreviated = false } = options
    const months = abbreviated
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]

    return this.random.pick(months)
  }

  /**
   * Generate a random weekday name
   */
  weekday(options: { abbreviated?: boolean } = {}): string {
    const { abbreviated = false } = options
    const weekdays = abbreviated
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    return this.random.pick(weekdays)
  }

  /**
   * Generate a random birth date for a given age range
   */
  birthdate(options: { minAge?: number; maxAge?: number; refDate?: Date } = {}): Date {
    const { minAge = 18, maxAge = 80, refDate = new Date() } = options

    const age = this.random.int(minAge, maxAge)
    const year = refDate.getFullYear() - age
    const month = this.random.int(0, 11)
    const maxDay = new Date(year, month + 1, 0).getDate()
    const day = this.random.int(1, maxDay)

    return new Date(year, month, day)
  }

  /**
   * Generate a random timestamp
   */
  timestamp(options: DateOptions = {}): number {
    return this.between(options).getTime()
  }

  /**
   * Generate a random time string
   */
  time(options: { format?: "12h" | "24h" } = {}): string {
    const { format = "24h" } = options
    const hour = this.random.int(0, 23)
    const minute = this.random.int(0, 59)
    const second = this.random.int(0, 59)

    if (format === "12h") {
      const period = hour >= 12 ? "PM" : "AM"
      const hour12 = hour % 12 || 12
      return `${hour12}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")} ${period}`
    }

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`
  }

  /**
   * Generate a random timezone
   */
  timezone(): string {
    const timezones = [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Australia/Sydney",
      "Pacific/Auckland",
      "America/Sao_Paulo",
    ]
    return this.random.pick(timezones)
  }

  /**
   * Generate an ISO date string
   */
  iso(options: DateOptions = {}): string {
    return this.between(options).toISOString()
  }

  /**
   * Generate a date in specific format
   */
  format(date: Date, formatStr: string): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    return formatStr
      .replace("YYYY", String(year))
      .replace("YY", String(year).slice(-2))
      .replace("MM", String(month).padStart(2, "0"))
      .replace("M", String(month))
      .replace("DD", String(day).padStart(2, "0"))
      .replace("D", String(day))
      .replace("HH", String(hours).padStart(2, "0"))
      .replace("H", String(hours))
      .replace("mm", String(minutes).padStart(2, "0"))
      .replace("m", String(minutes))
      .replace("ss", String(seconds).padStart(2, "0"))
      .replace("s", String(seconds))
  }

  /**
   * Generate a random era
   */
  era(): string {
    return this.random.pick(["AD", "BC"])
  }

  /**
   * Generate a random quarter
   */
  quarter(): string {
    return this.random.pick(["Q1", "Q2", "Q3", "Q4"])
  }

  /**
   * Generate a random year
   */
  year(options: { min?: number; max?: number } = {}): number {
    const { min = 1900, max = new Date().getFullYear() } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a random duration in seconds
   */
  duration(options: { min?: number; max?: number } = {}): number {
    const { min = 1, max = 86400 } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a random age
   */
  age(options: { min?: number; max?: number } = {}): number {
    const { min = 0, max = 100 } = options
    return this.random.int(min, max)
  }
}
