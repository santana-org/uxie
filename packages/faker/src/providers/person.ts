import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { Gender, Person, PersonNameOptions, PersonOptions, Sex } from "../types.js"

/**
 * Generates person-related profile and identity data.
 */
export class PersonProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random first name
   */
  firstName(options: { gender?: Gender } = {}): string {
    const { gender } = options

    if (gender === "male") {
      return this.random.pick(this.locale.person.firstNameMale)
    }
    if (gender === "female") {
      return this.random.pick(this.locale.person.firstNameFemale)
    }
    if (gender === "nonbinary") {
      return this.random.boolean()
        ? this.random.pick(this.locale.person.firstNameMale)
        : this.random.pick(this.locale.person.firstNameFemale)
    }

    return this.random.boolean()
      ? this.random.pick(this.locale.person.firstNameMale)
      : this.random.pick(this.locale.person.firstNameFemale)
  }

  /**
   * Generate a random last name
   */
  lastName(): string {
    return this.random.pick(this.locale.person.lastName)
  }

  /**
   * Generate a random middle name
   */
  middleName(options: { gender?: Gender } = {}): string {
    return this.firstName(options)
  }

  /**
   * Generate a random name prefix
   */
  prefix(): string {
    return this.random.pick(this.locale.person.prefix)
  }

  /**
   * Generate a random name suffix
   */
  suffix(): string {
    return this.random.pick(this.locale.person.suffix)
  }

  /**
   * Generate a full name with optional components
   */
  fullName(options: PersonNameOptions = {}): string {
    const { gender, middleName = false, prefix = false, suffix = false } = options

    const parts: string[] = []

    if (prefix) {
      parts.push(this.prefix())
    }

    parts.push(gender ? this.firstName({ gender }) : this.firstName())

    if (middleName) {
      parts.push(gender ? this.middleName({ gender }) : this.middleName())
    }

    parts.push(this.lastName())

    if (suffix) {
      parts.push(this.suffix())
    }

    return parts.join(" ")
  }

  /**
   * Generate a random gender
   */
  gender(): Gender {
    return this.random.pick(["male", "female", "nonbinary"])
  }

  /**
   * Generate a random biological sex
   */
  sex(): Sex {
    return this.random.pick(["male", "female"])
  }

  /**
   * Generate a random job title
   */
  jobTitle(): string {
    return this.random.pick(this.locale.person.jobTitle)
  }

  /**
   * Generate a random job descriptor
   */
  jobDescriptor(): string {
    return this.random.pick(this.locale.person.jobDescriptor)
  }

  /**
   * Generate a random job area
   */
  jobArea(): string {
    return this.random.pick(this.locale.person.jobArea)
  }

  /**
   * Generate a random job type
   */
  jobType(): string {
    return this.random.pick(this.locale.person.jobType)
  }

  /**
   * Generate a composite job title from descriptor, area, and type
   */
  job(): string {
    return `${this.jobDescriptor()} ${this.jobArea()} ${this.jobType()}`
  }

  /**
   * Generate a random age within a range
   */
  age(options: { min?: number; max?: number } = {}): number {
    const { min = 18, max = 80 } = options
    return this.random.int(min, max)
  }

  /**
   * Generate a random birth date based on age range
   */
  birthDate(options: { minAge?: number; maxAge?: number; refDate?: Date } = {}): Date {
    const { minAge = 18, maxAge = 80, refDate = new Date() } = options

    const age = this.random.int(minAge, maxAge)
    const year = refDate.getFullYear() - age
    const month = this.random.int(0, 11)
    const maxDay = new Date(year, month + 1, 0).getDate()
    const day = this.random.int(1, maxDay)

    return new Date(year, month, day)
  }

  /**
   * Generate a complete person profile
   */
  person(options: PersonOptions = {}): Person {
    const gender = options.gender ?? this.gender()
    const sex = options.sex ?? (gender === "nonbinary" ? this.sex() : (gender as Sex))
    const firstName = this.firstName({ gender })
    const lastName = this.lastName()
    const middleName = options.middleName ? this.middleName({ gender }) : undefined
    const prefix = options.prefix ? this.prefix() : undefined
    const suffix = options.suffix ? this.suffix() : undefined
    const ageOptions: { min?: number; max?: number } = {}
    if (options.minAge !== undefined) ageOptions.min = options.minAge
    if (options.maxAge !== undefined) ageOptions.max = options.maxAge
    const age = this.age(ageOptions)
    const birthDate = this.birthDate({ minAge: age, maxAge: age })

    const nameParts = [firstName, middleName, lastName].filter(Boolean)
    const fullName = nameParts.join(" ")

    const emailFirst = firstName.toLowerCase().replace(/[^a-z]/g, "")
    const emailLast = lastName.toLowerCase().replace(/[^a-z]/g, "")
    const emailSeparator = this.random.pick([".", "_", ""])
    const emailNumber = this.random.boolean(0.5) ? String(this.random.int(1, 999)) : ""
    const emailDomain = this.random.pick(this.locale.internet.emailProviders)
    const email = `${emailFirst}${emailSeparator}${emailLast}${emailNumber}@${emailDomain}`

    const phoneFormat = this.random.pick(this.locale.phone.formats)
    const phone = phoneFormat.replace(/#/g, () => String(this.random.int(0, 9)))

    const usernameNumber = this.random.boolean(0.6) ? String(this.random.int(1, 9999)) : ""
    const username = `${emailFirst}${emailLast}${usernameNumber}`.toLowerCase()

    const avatarId = this.random.int(1, 1000)
    const avatar = `https://i.pravatar.cc/300?u=${avatarId}`

    return {
      firstName,
      lastName,
      middleName,
      fullName,
      prefix,
      suffix,
      gender,
      sex,
      age,
      birthDate,
      email,
      phone,
      username,
      avatar,
    }
  }

  /**
   * Generate a random zodiac sign
   */
  zodiacSign(): string {
    const signs = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ]
    return this.random.pick(signs)
  }

  /**
   * Generate a random bio/description
   */
  bio(): string {
    const adjectives = ["passionate", "creative", "innovative", "dedicated", "enthusiastic"]
    const interests = [
      "technology",
      "music",
      "travel",
      "photography",
      "cooking",
      "fitness",
      "reading",
      "gaming",
    ]

    const adjective = this.random.pick(adjectives)
    const interest1 = this.random.pick(interests)
    const interest2 = this.random.pick(interests.filter((i) => i !== interest1))

    return `A ${adjective} individual with a love for ${interest1} and ${interest2}.`
  }
}
