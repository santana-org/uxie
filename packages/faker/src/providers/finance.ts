import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { BankAccount, CreditCard, CreditCardOptions } from "../types.js"

export class FinanceProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random amount
   */
  amount(options: { min?: number; max?: number; decimals?: number; symbol?: string } = {}): string {
    const { min = 0, max = 10000, decimals = 2, symbol = "$" } = options
    const amount = this.random.float(min, max).toFixed(decimals)
    return `${symbol}${amount}`
  }

  /**
   * Generate a random transaction type
   */
  transactionType(): string {
    return this.random.pick(this.locale.finance.transactionTypes)
  }

  /**
   * Generate a random currency
   */
  currency(): { code: string; name: string; symbol: string } {
    return this.random.pick(this.locale.finance.currency)
  }

  /**
   * Generate a random currency code
   */
  currencyCode(): string {
    return this.currency().code
  }

  /**
   * Generate a random currency name
   */
  currencyName(): string {
    return this.currency().name
  }

  /**
   * Generate a random currency symbol
   */
  currencySymbol(): string {
    return this.currency().symbol
  }

  /**
   * Generate a random Bitcoin address
   */
  bitcoinAddress(): string {
    const prefixes = ["1", "3", "bc1"]
    const prefix = this.random.pick(prefixes)
    const length = prefix === "bc1" ? 39 : 34 - prefix.length

    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    let address = prefix

    for (let i = 0; i < length; i++) {
      address += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return address
  }

  /**
   * Generate a random Ethereum address
   */
  ethereumAddress(): string {
    const chars = "0123456789abcdef"
    let address = "0x"

    for (let i = 0; i < 40; i++) {
      address += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return address
  }

  /**
   * Generate a random Litecoin address
   */
  litecoinAddress(): string {
    const prefixes = ["L", "M", "3"]
    const prefix = this.random.pick(prefixes)
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    let address = prefix

    for (let i = 0; i < 33; i++) {
      address += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return address
  }

  /**
   * Generate a random credit card number
   */
  creditCardNumber(options: CreditCardOptions = {}): string {
    const { type } = options

    const cardTypes = this.locale.finance.creditCardTypes
    const selectedType = type
      ? (cardTypes.find((t) => t.name.toLowerCase().includes(type.toLowerCase())) ??
        this.random.pick(cardTypes))
      : this.random.pick(cardTypes)

    const prefix = this.random.pick(selectedType.prefix)
    const length = selectedType.length

    let number = prefix
    while (number.length < length - 1) {
      number += String(this.random.int(0, 9))
    }

    // Luhn algorithm checksum
    let sum = 0
    let isEven = true

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(number[i] ?? "0", 10)

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    const checksum = (10 - (sum % 10)) % 10
    number += String(checksum)

    return number
  }

  /**
   * Generate a formatted credit card number
   */
  creditCardNumberFormatted(options: CreditCardOptions = {}): string {
    const number = this.creditCardNumber(options)
    const chunks: string[] = []

    for (let i = 0; i < number.length; i += 4) {
      chunks.push(number.slice(i, i + 4))
    }

    return chunks.join(" ")
  }

  /**
   * Generate a random credit card CVV
   */
  creditCardCvv(options: { length?: number } = {}): string {
    const { length = 3 } = options
    let cvv = ""

    for (let i = 0; i < length; i++) {
      cvv += String(this.random.int(0, 9))
    }

    return cvv
  }

  /**
   * Generate a credit card expiration date
   */
  creditCardExpiry(): string {
    const month = String(this.random.int(1, 12)).padStart(2, "0")
    const currentYear = new Date().getFullYear() % 100
    const year = String(this.random.int(currentYear + 1, currentYear + 8)).padStart(2, "0")

    return `${month}/${year}`
  }

  /**
   * Generate a credit card issuer name
   */
  creditCardIssuer(): string {
    const issuers = this.locale.finance.creditCardTypes.map((t) => t.name)
    return this.random.pick(issuers)
  }

  /**
   * Generate a complete credit card object
   */
  creditCard(options: CreditCardOptions = {}): CreditCard {
    const cardType =
      options.type ?? (this.creditCardIssuer().toLowerCase() as CreditCardOptions["type"])
    const number = this.creditCardNumber(cardType ? { type: cardType } : {})
    const cvv = number.length === 15 ? this.creditCardCvv({ length: 4 }) : this.creditCardCvv()
    const expirationDate = this.creditCardExpiry()
    const issuer = this.creditCardIssuer()
    const firstName = this.random.pick(
      this.locale.person.firstNameMale.concat(this.locale.person.firstNameFemale),
    )
    const lastName = this.random.pick(this.locale.person.lastName)
    const holderName = `${firstName} ${lastName}`.toUpperCase()

    return {
      number,
      cvv,
      expirationDate,
      type: cardType ?? "unknown",
      issuer,
      holderName,
    }
  }

  /**
   * Generate a random account number
   */
  accountNumber(options: { length?: number } = {}): string {
    const { length = 10 } = options
    let number = ""

    for (let i = 0; i < length; i++) {
      number += String(this.random.int(0, 9))
    }

    return number
  }

  /**
   * Generate a random routing number
   */
  routingNumber(): string {
    let number = ""

    for (let i = 0; i < 9; i++) {
      number += String(this.random.int(0, 9))
    }

    return number
  }

  /**
   * Generate a random IBAN
   */
  iban(): string {
    const countryCodes = ["DE", "FR", "GB", "ES", "IT", "NL", "BE", "AT", "CH", "SE"]
    const countryCode = this.random.pick(countryCodes)

    const checkDigits = String(this.random.int(10, 99))
    let bban = ""
    const bbanLength = countryCode === "DE" ? 18 : countryCode === "FR" ? 23 : 20

    for (let i = 0; i < bbanLength; i++) {
      bban += String(this.random.int(0, 9))
    }

    return `${countryCode}${checkDigits}${bban}`
  }

  /**
   * Generate a random BIC/SWIFT code
   */
  bic(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let bic = ""

    // Bank code (4 letters)
    for (let i = 0; i < 4; i++) {
      bic += chars.charAt(this.random.int(0, chars.length - 1))
    }

    // Country code (2 letters)
    const countries = ["US", "GB", "DE", "FR", "ES", "IT", "NL", "CH", "JP", "AU"]
    bic += this.random.pick(countries)

    // Location code (2 characters)
    bic += chars.charAt(this.random.int(0, chars.length - 1))
    bic += String(this.random.int(0, 9))

    // Branch code (optional, 3 characters)
    if (this.random.boolean(0.5)) {
      for (let i = 0; i < 3; i++) {
        bic += this.random.boolean(0.5)
          ? chars.charAt(this.random.int(0, chars.length - 1))
          : String(this.random.int(0, 9))
      }
    }

    return bic
  }

  /**
   * Generate a random account type
   */
  accountType(): string {
    return this.random.pick(this.locale.finance.accountTypes)
  }

  /**
   * Generate a bank account object
   */
  bankAccount(): BankAccount {
    const accountNumber = this.accountNumber()
    const routingNumber = this.routingNumber()
    const iban = this.iban()
    const bic = this.bic()
    const accountType = this.random.pick(["checking", "savings"]) as "checking" | "savings"
    const bankNames = [
      "First National Bank",
      "City Trust Bank",
      "United Financial",
      "Premier Bank",
      "Capital One",
      "Wells Fargo",
      "Chase",
      "Bank of America",
      "Citibank",
    ]
    const bankName = this.random.pick(bankNames)

    return {
      accountNumber,
      routingNumber,
      iban,
      bic,
      accountType,
      bankName,
    }
  }

  /**
   * Generate a random stock ticker
   */
  stockTicker(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const length = this.random.int(2, 5)
    let ticker = ""

    for (let i = 0; i < length; i++) {
      ticker += chars.charAt(this.random.int(0, chars.length - 1))
    }

    return ticker
  }

  /**
   * Generate a random stock price
   */
  stockPrice(options: { min?: number; max?: number } = {}): number {
    const { min = 1, max = 1000 } = options
    return Number(this.random.float(min, max).toFixed(2))
  }

  /**
   * Generate a random percentage
   */
  percentage(options: { min?: number; max?: number; decimals?: number } = {}): string {
    const { min = 0, max = 100, decimals = 2 } = options
    const value = this.random.float(min, max).toFixed(decimals)
    return `${value}%`
  }
}
