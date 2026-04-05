/**
 * Supported locales for the faker library
 */
export type Locale = "en" | "es" | "fr" | "de" | "it" | "pt" | "ja" | "zh" | "ko" | "ru"

/**
 * Gender options for person-related generators
 */
export type Gender = "male" | "female" | "nonbinary"

/**
 * Sex options (binary) for biological data
 */
export type Sex = "male" | "female"

/**
 * Configuration options for the Faker instance
 */
export interface FakerConfig {
  /** Locale to use for generating data */
  locale?: Locale
  /** Seed for reproducible random generation */
  seed?: number
}

/**
 * Options for generating person names
 */
export interface PersonNameOptions {
  /** Gender to use for name generation */
  gender?: Gender
  /** Include middle name */
  middleName?: boolean
  /** Include prefix (Mr., Mrs., etc.) */
  prefix?: boolean
  /** Include suffix (Jr., Sr., etc.) */
  suffix?: boolean
}

/**
 * Options for generating full person data
 */
export interface PersonOptions extends PersonNameOptions {
  /** Minimum age */
  minAge?: number
  /** Maximum age */
  maxAge?: number
  /** Sex for biological data */
  sex?: Sex
}

/**
 * Options for generating addresses
 */
export interface AddressOptions {
  /** Include apartment/unit number */
  includeSecondary?: boolean
  /** Use abbreviated state names */
  abbreviateState?: boolean
  /** Country to generate address for */
  country?: string
}

/**
 * Options for generating phone numbers
 */
export interface PhoneOptions {
  /** Include country code */
  countryCode?: boolean
  /** Include extension */
  extension?: boolean
  /** Format style */
  format?: "national" | "international" | "e164"
}

/**
 * Options for generating email addresses
 */
export interface EmailOptions {
  /** First name to use in email */
  firstName?: string
  /** Last name to use in email */
  lastName?: string
  /** Specific domain to use */
  domain?: string
  /** Allow special characters */
  allowSpecialCharacters?: boolean
}

/**
 * Options for generating usernames
 */
export interface UsernameOptions {
  /** First name to use */
  firstName?: string
  /** Last name to use */
  lastName?: string
  /** Include numbers */
  includeNumbers?: boolean
  /** Include special characters */
  includeSpecialChars?: boolean
  /** Minimum length */
  minLength?: number
  /** Maximum length */
  maxLength?: number
}

/**
 * Options for generating passwords
 */
export interface PasswordOptions {
  /** Password length */
  length?: number
  /** Include uppercase letters */
  uppercase?: boolean
  /** Include lowercase letters */
  lowercase?: boolean
  /** Include numbers */
  numbers?: boolean
  /** Include special characters */
  symbols?: boolean
  /** Custom character set to use */
  charset?: string
  /** Exclude ambiguous characters (0, O, l, 1, etc.) */
  excludeAmbiguous?: boolean
}

/**
 * Options for generating lorem ipsum text
 */
export interface LoremOptions {
  /** Minimum number of units */
  min?: number
  /** Maximum number of units */
  max?: number
}

/**
 * Options for generating company names
 */
export interface CompanyOptions {
  /** Include suffix (Inc., LLC, etc.) */
  includeSuffix?: boolean
}

/**
 * Options for generating dates
 */
export interface DateOptions {
  /** Minimum date */
  min?: Date
  /** Maximum date */
  max?: Date
  /** Reference date for relative calculations */
  refDate?: Date
}

/**
 * Options for generating numbers
 */
export interface NumberOptions {
  /** Minimum value (inclusive) */
  min?: number
  /** Maximum value (inclusive) */
  max?: number
  /** Number of decimal places */
  precision?: number
}

/**
 * Options for generating integers
 */
export interface IntegerOptions {
  /** Minimum value (inclusive) */
  min?: number
  /** Maximum value (inclusive) */
  max?: number
}

/**
 * Options for generating floats
 */
export interface FloatOptions {
  /** Minimum value (inclusive) */
  min?: number
  /** Maximum value (inclusive) */
  max?: number
  /** Number of decimal places */
  precision?: number
}

/**
 * Options for generating UUIDs
 */
export interface UuidOptions {
  /** UUID version to generate */
  version?: 4
}

/**
 * Options for generating colors
 */
export interface ColorOptions {
  /** Color format */
  format?: "hex" | "rgb" | "rgba" | "hsl" | "hsla" | "name"
  /** Include alpha channel (for rgba/hsla) */
  alpha?: number
  /** Color category (red, blue, green, etc.) */
  category?: "red" | "blue" | "green" | "yellow" | "purple" | "orange" | "pink" | "brown" | "gray"
}

/**
 * Options for generating images
 */
export interface ImageOptions {
  /** Image width */
  width?: number
  /** Image height */
  height?: number
  /** Image category */
  category?:
    | "abstract"
    | "animals"
    | "business"
    | "cats"
    | "city"
    | "food"
    | "nature"
    | "people"
    | "sports"
    | "technics"
    | "transport"
  /** Grayscale */
  grayscale?: boolean
}

/**
 * Options for generating credit card numbers
 */
export interface CreditCardOptions {
  /** Card type */
  type?: "visa" | "mastercard" | "amex" | "discover" | "jcb" | "diners"
}

/**
 * Options for generating file-related data
 */
export interface FileOptions {
  /** File extension */
  extension?: string
  /** Directory depth */
  depth?: number
}

/**
 * Options for generating arrays
 */
export interface ArrayOptions<T> {
  /** Minimum array length */
  min?: number
  /** Maximum array length */
  max?: number
  /** Generator function for each element */
  generator: () => T
}

/**
 * Options for generating weighted random selections
 */
export interface WeightedOptions<T> {
  /** Items with their weights */
  items: Array<{ value: T; weight: number }>
}

/**
 * Options for generating URL data
 */
export interface UrlOptions {
  /** Protocol to use */
  protocol?: "http" | "https"
  /** Include path */
  includePath?: boolean
  /** Include query string */
  includeQueryString?: boolean
  /** Include fragment */
  includeFragment?: boolean
}

/**
 * Options for generating IP addresses
 */
export interface IpOptions {
  /** IP version */
  version?: 4 | 6
}

/**
 * Options for generating MAC addresses
 */
export interface MacOptions {
  /** Separator character */
  separator?: ":" | "-" | ""
}

/**
 * Options for generating user agent strings
 */
export interface UserAgentOptions {
  /** Browser type */
  browser?: "chrome" | "firefox" | "safari" | "edge" | "opera"
  /** Device type */
  device?: "desktop" | "mobile" | "tablet"
}

/**
 * Represents a generated person
 */
export interface Person {
  firstName: string
  lastName: string
  middleName?: string | undefined
  fullName: string
  prefix?: string | undefined
  suffix?: string | undefined
  gender: Gender
  sex: Sex
  age: number
  birthDate: Date
  email: string
  phone: string
  username: string
  avatar: string
}

/**
 * Represents a generated address
 */
export interface Address {
  street: string
  streetNumber: string
  secondaryAddress?: string | undefined
  city: string
  state: string
  stateAbbr: string
  zipCode: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  fullAddress: string
}

/**
 * Represents a generated company
 */
export interface Company {
  name: string
  suffix: string
  catchPhrase: string
  industry: string
  buzzword: string
  website: string
  email: string
  phone: string
}

/**
 * Represents a generated credit card
 */
export interface CreditCard {
  number: string
  cvv: string
  expirationDate: string
  type: string
  issuer: string
  holderName: string
}

/**
 * Represents a generated bank account
 */
export interface BankAccount {
  accountNumber: string
  routingNumber: string
  iban: string
  bic: string
  accountType: "checking" | "savings"
  bankName: string
}

/**
 * Represents a generated vehicle
 */
export interface Vehicle {
  manufacturer: string
  model: string
  type: string
  fuel: string
  vin: string
  color: string
  year: number
  licensePlate: string
}

/**
 * Represents a generated product
 */
export interface Product {
  name: string
  description: string
  price: number
  category: string
  material: string
  color: string
  sku: string
  ean: string
}

/**
 * Represents a movie
 */
export interface Movie {
  title: string
  director: string
  genre: string
  plot: string
  rating: number
}

/**
 * Represents a school/education entity
 */
export interface School {
  name: string
  degree: string
  fieldOfStudy: string
}

/**
 * Represents a gaming item
 */
export interface GameProfile {
  username: string
  level: number
  console: string
  genre: string
  rating: number
}

/**
 * Represents a real estate property
 */
export interface Property {
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  propertyType: string
  status: string
  yearBuilt: number
  listingId: string
}

/**
 * Represents weather data
 */
export interface WeatherData {
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
  pressure: number
  visibility: number
}
