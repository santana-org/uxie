import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"
import type { Company, CompanyOptions } from "../types.js"

export class CompanyProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random company name
   */
  name(options: CompanyOptions = {}): string {
    const { includeSuffix = true } = options

    const patterns = [
      () => this.random.pick(this.locale.person.lastName),
      () =>
        `${this.random.pick(this.locale.person.lastName)} & ${this.random.pick(this.locale.person.lastName)}`,
      () =>
        `${this.random.pick(this.locale.person.lastName)}-${this.random.pick(this.locale.person.lastName)}`,
      () =>
        `${this.random.pick(this.locale.company.catchPhraseAdjective)} ${this.random.pick(this.locale.company.catchPhraseDescriptor).charAt(0).toUpperCase() + this.random.pick(this.locale.company.catchPhraseDescriptor).slice(1)}`,
    ]

    let name = this.random.pick(patterns)()

    if (includeSuffix) {
      name += ` ${this.suffix()}`
    }

    return name
  }

  /**
   * Generate a random company suffix
   */
  suffix(): string {
    return this.random.pick(this.locale.company.suffix)
  }

  /**
   * Generate a random catch phrase
   */
  catchPhrase(): string {
    const adjective = this.random.pick(this.locale.company.catchPhraseAdjective)
    const descriptor = this.random.pick(this.locale.company.catchPhraseDescriptor)
    const buzzword = this.random.pick(this.locale.company.buzzwords)

    return `${adjective} ${descriptor} with ${buzzword}`
  }

  /**
   * Generate a random buzzword
   */
  buzzword(): string {
    return this.random.pick(this.locale.company.buzzwords)
  }

  /**
   * Generate random buzzwords
   */
  buzzwords(count = 3): string {
    const words = this.random.pickMultiple(this.locale.company.buzzwords, count)
    return words.join(", ")
  }

  /**
   * Generate a random industry
   */
  industry(): string {
    return this.random.pick(this.locale.company.industry)
  }

  /**
   * Generate a random catch phrase adjective
   */
  catchPhraseAdjective(): string {
    return this.random.pick(this.locale.company.catchPhraseAdjective)
  }

  /**
   * Generate a random catch phrase descriptor
   */
  catchPhraseDescriptor(): string {
    return this.random.pick(this.locale.company.catchPhraseDescriptor)
  }

  /**
   * Generate a company object with full details
   */
  company(options: CompanyOptions = {}): Company {
    const name = this.name(options)
    const suffix = this.suffix()
    const catchPhrase = this.catchPhrase()
    const industry = this.industry()
    const buzzword = this.buzzword()

    const domainWord = name.toLowerCase().replace(/[^a-z0-9]/g, "")
    const domainSuffix = this.random.pick(this.locale.internet.domainSuffixes)
    const website = `https://www.${domainWord}${domainSuffix}`
    const email = `contact@${domainWord}${domainSuffix}`

    const phoneFormat = this.random.pick(this.locale.phone.formats)
    const phone = phoneFormat.replace(/#/g, () => String(this.random.int(0, 9)))

    return {
      name,
      suffix,
      catchPhrase,
      industry,
      buzzword,
      website,
      email,
      phone,
    }
  }
}
