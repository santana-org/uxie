import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class PhoneProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random phone number
   */
  number(options: { format?: string } = {}): string {
    const { format } = options

    const phoneFormat = format ?? this.random.pick(this.locale.phone.formats)

    return phoneFormat.replace(/#/g, () => String(this.random.int(0, 9)))
  }

  /**
   * Generate a random phone number with country code
   */
  international(): string {
    const countryCodes = ["+1", "+44", "+49", "+33", "+34", "+39", "+81", "+86", "+91", "+52"]
    const countryCode = this.random.pick(countryCodes)
    const number = this.number({ format: "### ### ####" })

    return `${countryCode} ${number}`
  }

  /**
   * Generate a random phone number in E.164 format
   */
  e164(): string {
    const countryCodes = ["1", "44", "49", "33", "34", "39", "81", "86", "91", "52"]
    const countryCode = this.random.pick(countryCodes)
    let number = ""

    const length = countryCode === "1" ? 10 : this.random.int(9, 11)
    for (let i = 0; i < length; i++) {
      number += String(this.random.int(0, 9))
    }

    return `+${countryCode}${number}`
  }

  /**
   * Generate a random IMEI number
   */
  imei(): string {
    let imei = ""

    // First 14 digits
    for (let i = 0; i < 14; i++) {
      imei += String(this.random.int(0, 9))
    }

    // Calculate Luhn checksum
    let sum = 0
    for (let i = 0; i < 14; i++) {
      let digit = Number.parseInt(imei[i] ?? "0", 10)
      if (i % 2 === 1) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      sum += digit
    }

    const checksum = (10 - (sum % 10)) % 10
    imei += String(checksum)

    return imei
  }
}
