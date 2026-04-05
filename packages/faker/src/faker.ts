import { type LocaleData, locales } from "./locales/index.js"
import { MersenneTwister } from "./random.js"
import type { FakerConfig, Locale } from "./types.js"

import {
  AnimalProvider,
  ColorProvider,
  CommerceProvider,
  CompanyProvider,
  DateProvider,
  EducationProvider,
  FinanceProvider,
  FoodProvider,
  GamingProvider,
  HackerProvider,
  ImageProvider,
  InternetProvider,
  LocationProvider,
  LoremProvider,
  MoviesProvider,
  MusicProvider,
  NumberProvider,
  PersonProvider,
  PhoneProvider,
  RealEstateProvider,
  ScienceProvider,
  StringProvider,
  SystemProvider,
  VehicleProvider,
  WeatherProvider,
} from "./providers/index.js"

/**
 * Faker - A comprehensive fake data generator
 *
 * @example
 * ```ts
 * import { faker } from "@santana-org/faker"
 *
 * faker.person.firstName() // "John"
 * faker.person.lastName() // "Smith"
 * faker.internet.email() // "john.smith42@gmail.com"
 * faker.location.city() // "New York"
 * ```
 */
export class Faker {
  private readonly random: MersenneTwister
  private localeData: LocaleData
  private currentLocale: Locale

  /** Generate person-related data (names, ages, bios) */
  readonly person: PersonProvider
  /** Generate location-related data (addresses, cities, countries) */
  readonly location: LocationProvider
  /** Generate internet-related data (emails, URLs, IPs) */
  readonly internet: InternetProvider
  /** Generate lorem ipsum text */
  readonly lorem: LoremProvider
  /** Generate company-related data (names, industries, buzzwords) */
  readonly company: CompanyProvider
  /** Generate date-related data */
  readonly date: DateProvider
  /** Generate finance-related data (credit cards, currencies, accounts) */
  readonly finance: FinanceProvider
  /** Generate numbers (integers, floats, UUIDs) */
  readonly number: NumberProvider
  /** Generate colors in various formats */
  readonly color: ColorProvider
  /** Generate commerce-related data (products, prices, SKUs) */
  readonly commerce: CommerceProvider
  /** Generate vehicle-related data (manufacturers, models, VINs) */
  readonly vehicle: VehicleProvider
  /** Generate image URLs */
  readonly image: ImageProvider
  /** Generate random strings */
  readonly string: StringProvider
  /** Generate system-related data (file names, MIME types, paths) */
  readonly system: SystemProvider
  /** Generate phone numbers */
  readonly phone: PhoneProvider
  /** Generate science-related data (elements, units) */
  readonly science: ScienceProvider
  /** Generate hacker-related phrases */
  readonly hacker: HackerProvider
  /** Generate animal names */
  readonly animal: AnimalProvider
  /** Generate music-related data */
  readonly music: MusicProvider
  /** Generate food-related data */
  readonly food: FoodProvider
  /** Generate movies/shows-related data */
  readonly movies: MoviesProvider
  /** Generate education-related data */
  readonly education: EducationProvider
  /** Generate gaming-related data */
  readonly gaming: GamingProvider
  /** Generate real estate-related data */
  readonly realEstate: RealEstateProvider
  /** Generate weather-related data */
  readonly weather: WeatherProvider

  constructor(config: FakerConfig = {}) {
    const { locale = "en", seed } = config

    this.random = new MersenneTwister(seed)
    this.currentLocale = locale
    this.localeData = this.resolveLocaleData(locale)

    // Initialize all providers
    this.person = new PersonProvider(this.random, this.localeData)
    this.location = new LocationProvider(this.random, this.localeData)
    this.internet = new InternetProvider(this.random, this.localeData)
    this.lorem = new LoremProvider(this.random, this.localeData)
    this.company = new CompanyProvider(this.random, this.localeData)
    this.date = new DateProvider(this.random)
    this.finance = new FinanceProvider(this.random, this.localeData)
    this.number = new NumberProvider(this.random)
    this.color = new ColorProvider(this.random, this.localeData)
    this.commerce = new CommerceProvider(this.random, this.localeData)
    this.vehicle = new VehicleProvider(this.random, this.localeData)
    this.image = new ImageProvider(this.random, this.localeData)
    this.string = new StringProvider(this.random, this.localeData)
    this.system = new SystemProvider(this.random, this.localeData)
    this.phone = new PhoneProvider(this.random, this.localeData)
    this.science = new ScienceProvider(this.random, this.localeData)
    this.hacker = new HackerProvider(this.random, this.localeData)
    this.animal = new AnimalProvider(this.random, this.localeData)
    this.music = new MusicProvider(this.random, this.localeData)
    this.food = new FoodProvider(this.random, this.localeData)
    this.movies = new MoviesProvider(this.random, this.localeData)
    this.education = new EducationProvider(this.random, this.localeData)
    this.gaming = new GamingProvider(this.random, this.localeData)
    this.realEstate = new RealEstateProvider(this.random, this.localeData)
    this.weather = new WeatherProvider(this.random, this.localeData)
  }

  /**
   * Set the seed for reproducible random generation
   *
   * @example
   * ```ts
   * faker.seed(12345)
   * faker.person.firstName() // Will always return the same value for this seed
   * ```
   */
  seed(seed: number): this {
    this.random.seed(seed)
    return this
  }

  /**
   * Set the locale for data generation
   *
   * @example
   * ```ts
   * faker.setLocale("es")
   * faker.person.firstName() // Will return Spanish names
   * ```
   */
  setLocale(locale: Locale): this {
    this.currentLocale = locale
    this.localeData = this.resolveLocaleData(locale)

    // Reinitialize providers with new locale
    this.reinitializeProviders()

    return this
  }

  /**
   * Get the current locale
   */
  getLocale(): Locale {
    return this.currentLocale
  }

  /**
   * Get available locales
   */
  getAvailableLocales(): Locale[] {
    return Object.keys(locales) as Locale[]
  }

  private resolveLocaleData(locale: Locale): LocaleData {
    const fallbackLocale = locales["en"] ?? Object.values(locales)[0]
    if (!fallbackLocale) {
      throw new Error("No locale data available")
    }
    return locales[locale] ?? fallbackLocale
  }

  private reinitializeProviders(): void {
    Object.assign(this.person, new PersonProvider(this.random, this.localeData))
    Object.assign(this.location, new LocationProvider(this.random, this.localeData))
    Object.assign(this.internet, new InternetProvider(this.random, this.localeData))
    Object.assign(this.lorem, new LoremProvider(this.random, this.localeData))
    Object.assign(this.company, new CompanyProvider(this.random, this.localeData))
    Object.assign(this.finance, new FinanceProvider(this.random, this.localeData))
    Object.assign(this.color, new ColorProvider(this.random, this.localeData))
    Object.assign(this.commerce, new CommerceProvider(this.random, this.localeData))
    Object.assign(this.vehicle, new VehicleProvider(this.random, this.localeData))
    Object.assign(this.image, new ImageProvider(this.random, this.localeData))
    Object.assign(this.string, new StringProvider(this.random, this.localeData))
    Object.assign(this.system, new SystemProvider(this.random, this.localeData))
    Object.assign(this.phone, new PhoneProvider(this.random, this.localeData))
    Object.assign(this.science, new ScienceProvider(this.random, this.localeData))
    Object.assign(this.hacker, new HackerProvider(this.random, this.localeData))
    Object.assign(this.animal, new AnimalProvider(this.random, this.localeData))
    Object.assign(this.music, new MusicProvider(this.random, this.localeData))
    Object.assign(this.food, new FoodProvider(this.random, this.localeData))
    Object.assign(this.movies, new MoviesProvider(this.random, this.localeData))
    Object.assign(this.education, new EducationProvider(this.random, this.localeData))
    Object.assign(this.gaming, new GamingProvider(this.random, this.localeData))
    Object.assign(this.realEstate, new RealEstateProvider(this.random, this.localeData))
    Object.assign(this.weather, new WeatherProvider(this.random, this.localeData))
  }
}

export function createFaker(config: FakerConfig = {}): Faker {
  return new Faker(config)
}

export const faker = new Faker()
