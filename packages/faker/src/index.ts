// Main exports
export { Faker, faker, createFaker } from "./faker.js"

// Types
export type {
  Locale,
  Gender,
  Sex,
  FakerConfig,
  PersonNameOptions,
  PersonOptions,
  AddressOptions,
  PhoneOptions,
  EmailOptions,
  UsernameOptions,
  PasswordOptions,
  LoremOptions,
  CompanyOptions,
  DateOptions,
  NumberOptions,
  IntegerOptions,
  FloatOptions,
  UuidOptions,
  ColorOptions,
  ImageOptions,
  CreditCardOptions,
  FileOptions,
  ArrayOptions,
  WeightedOptions,
  UrlOptions,
  IpOptions,
  MacOptions,
  UserAgentOptions,
  Person,
  Address,
  Company,
  CreditCard,
  BankAccount,
  Vehicle,
  Product,
  Movie,
  School,
  GameProfile,
  Property,
  WeatherData,
} from "./types.js"

// Random generator
export { MersenneTwister } from "./random.js"

// Locales
export { en, es, locales, type LocaleData } from "./locales/index.js"

// Providers (for advanced usage)
export {
  PersonProvider,
  LocationProvider,
  InternetProvider,
  LoremProvider,
  CompanyProvider,
  DateProvider,
  FinanceProvider,
  NumberProvider,
  ColorProvider,
  CommerceProvider,
  VehicleProvider,
  ImageProvider,
  StringProvider,
  SystemProvider,
  PhoneProvider,
  ScienceProvider,
  HackerProvider,
  AnimalProvider,
  MusicProvider,
  FoodProvider,
  MoviesProvider,
  EducationProvider,
  GamingProvider,
  RealEstateProvider,
  WeatherProvider,
} from "./providers/index.js"
