import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class MusicProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random music genre
   */
  genre(): string {
    return this.random.pick(this.locale.music.genre)
  }

  /**
   * Generate a random song name
   */
  songName(): string {
    const adjectives = [
      "Lonely",
      "Beautiful",
      "Broken",
      "Electric",
      "Golden",
      "Silent",
      "Wild",
      "Dancing",
      "Midnight",
      "Summer",
    ]
    const nouns = [
      "Heart",
      "Love",
      "Dreams",
      "Night",
      "Fire",
      "Rain",
      "Sky",
      "Soul",
      "Road",
      "Light",
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
   * Generate a random artist name
   */
  artist(): string {
    const firstNames = ["The", "DJ", "MC", "Lil", "Big", "Young", "King", "Queen"]
    const lastParts = ["Kings", "Stars", "Dreams", "Beats", "Sound", "Wave", "Fire", "Soul"]

    const patterns = [
      () => `${this.random.pick(firstNames)} ${this.random.pick(lastParts)}`,
      () => this.random.pick(lastParts),
      () =>
        `${this.random.pick(this.locale.person.firstNameMale)} ${this.random.pick(this.locale.person.lastName)}`,
    ]
    return this.random.pick(patterns)()
  }

  /**
   * Generate a random album name
   */
  album(): string {
    const templates = [
      this.songName(),
      `The ${this.random.pick(["Best", "Greatest", "Essential", "Ultimate"])} Collection`,
      `${this.random.pick(["Chapter", "Volume", "Part"])} ${this.random.int(1, 10)}`,
      this.random.pick(["Debut", "Renaissance", "Evolution", "Revolution", "Genesis"]),
    ]
    return this.random.pick(templates)
  }
}
