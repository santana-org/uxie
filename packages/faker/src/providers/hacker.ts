import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class HackerProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random hacker abbreviation
   */
  abbreviation(): string {
    return this.random.pick(this.locale.hacker.abbreviation)
  }

  /**
   * Generate a random hacker adjective
   */
  adjective(): string {
    return this.random.pick(this.locale.hacker.adjective)
  }

  /**
   * Generate a random hacker noun
   */
  noun(): string {
    return this.random.pick(this.locale.hacker.noun)
  }

  /**
   * Generate a random hacker verb
   */
  verb(): string {
    return this.random.pick(this.locale.hacker.verb)
  }

  /**
   * Generate a random hacker phrase
   */
  phrase(): string {
    const templates = [
      () =>
        `If we ${this.verb()} the ${this.noun()}, we can get to the ${this.abbreviation()} ${this.noun()} through the ${this.adjective()} ${this.abbreviation()} ${this.noun()}!`,
      () =>
        `We need to ${this.verb()} the ${this.adjective()} ${this.abbreviation()} ${this.noun()}!`,
      () =>
        `Try to ${this.verb()} the ${this.abbreviation()} ${this.noun()}, maybe it will ${this.verb()} the ${this.adjective()} ${this.noun()}!`,
      () =>
        `You can't ${this.verb()} the ${this.noun()} without ${this.verb()}ing the ${this.adjective()} ${this.abbreviation()} ${this.noun()}!`,
      () =>
        `Use the ${this.adjective()} ${this.abbreviation()} ${this.noun()}, then you can ${this.verb()} the ${this.adjective()} ${this.noun()}!`,
      () =>
        `The ${this.abbreviation()} ${this.noun()} is down, ${this.verb()} the ${this.adjective()} ${this.noun()} so we can ${this.verb()} the ${this.abbreviation()} ${this.noun()}!`,
      () =>
        `${this.verb()}ing the ${this.noun()} won't do anything, we need to ${this.verb()} the ${this.adjective()} ${this.abbreviation()} ${this.noun()}!`,
    ]

    const phrase = this.random.pick(templates)()
    return phrase.charAt(0).toUpperCase() + phrase.slice(1)
  }
}
