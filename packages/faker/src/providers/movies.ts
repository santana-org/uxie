import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class MoviesProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random movie genre
   */
  genre(): string {
    const genres = [
      "Action",
      "Comedy",
      "Drama",
      "Horror",
      "Thriller",
      "Romance",
      "Animation",
      "Sci-Fi",
      "Fantasy",
      "Crime",
      "Adventure",
      "Documentary",
      "Mystery",
      "Musical",
      "Western",
    ]
    return this.random.pick(genres)
  }

  /**
   * Generate a random movie title
   */
  title(): string {
    const adjectives = [
      "Beautiful",
      "Broken",
      "Hidden",
      "Last",
      "Lost",
      "Silent",
      "Forbidden",
      "Eternal",
      "Midnight",
      "Infinite",
    ]
    const nouns = [
      "Dreams",
      "Love",
      "Night",
      "Light",
      "Soul",
      "Heart",
      "War",
      "Hope",
      "Fear",
      "Fire",
    ]
    const patterns = [
      () => `${this.random.pick(adjectives)} ${this.random.pick(nouns)}`,
      () => `The ${this.random.pick(nouns)}`,
      () => `${this.random.pick(nouns)} of ${this.random.pick(nouns)}`,
      () => `${this.random.pick(adjectives)}`,
    ]
    return this.random.pick(patterns)()
  }

  /**
   * Generate a random director name
   */
  director(): string {
    return `${this.random.pick(this.locale.person.firstNameMale)} ${this.random.pick(this.locale.person.lastName)}`
  }

  /**
   * Generate a random actor name
   */
  actor(): string {
    const gender = this.random.pick(["male", "female"] as const)
    const firstName =
      gender === "male"
        ? this.random.pick(this.locale.person.firstNameMale)
        : this.random.pick(this.locale.person.firstNameFemale)
    const lastName = this.random.pick(this.locale.person.lastName)
    return `${firstName} ${lastName}`
  }

  /**
   * Generate a random movie plot/synopsis
   */
  plot(): string {
    const actors = [this.actor(), this.actor()]
    const plots = [
      `${actors[0]} discovers a hidden ${this.random.pick(["secret", "truth", "power"])} that changes everything.`,
      `When ${actors[0]} meets ${actors[1]}, they must ${this.random.pick(["fight", "escape", "uncover"])} a ${this.random.pick(["conspiracy", "mystery", "threat"])}.`,
      `In a ${this.random.pick(["dystopian", "magical", "futuristic"])} world, ${actors[0]} must save the day.`,
      `${actors[0]} and ${actors[1]} embark on an ${this.random.pick(["epic", "dangerous", "unforgettable"])} journey.`,
      `A ${this.random.pick(["forbidden", "dangerous", "unlikely"])} love story between ${actors[0]} and ${actors[1]}.`,
    ]
    return this.random.pick(plots)
  }

  /**
   * Generate a random TV show name
   */
  showName(): string {
    const pluralLastNames = this.locale.person.lastName.map((lastName) => `${lastName}s`)
    const patterns = [
      this.title(),
      `The ${this.random.pick(pluralLastNames.length > 0 ? pluralLastNames : ["Kings", "Queens", "Heroes"])}`,
      `${this.random.pick(["Agent", "Detective", "Officer"])} ${this.random.pick(this.locale.person.lastName)}`,
    ]
    return this.random.pick(patterns)
  }

  /**
   * Generate a random streaming platform
   */
  streamingPlatform(): string {
    const platforms = [
      "Netflix",
      "Amazon Prime Video",
      "Disney+",
      "Hulu",
      "HBO Max",
      "Apple TV+",
      "Paramount+",
      "Peacock",
      "Crunchyroll",
      "Disney+",
    ]
    return this.random.pick(platforms)
  }
}
