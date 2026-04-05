import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class GamingProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random gaming username
   */
  username(): string {
    const prefixes = [
      "Pro",
      "Elite",
      "Shadow",
      "Ghost",
      "Cyber",
      "Apex",
      "Nova",
      "Phantom",
      "Dragon",
      "Mystic",
    ]
    const suffixes = [
      "Killer",
      "Master",
      "Knight",
      "Blade",
      "Storm",
      "Fire",
      "Wolf",
      "Ninja",
      "Hawk",
      "King",
    ]
    const firstNames = [...this.locale.person.firstNameMale, ...this.locale.person.firstNameFemale]
    const patterns = [
      () =>
        `${this.random.pick(prefixes)}${this.random.pick(suffixes)}${this.random.int(1, 999)}`.toLowerCase(),
      () => `${this.random.pick(prefixes)}_${this.random.pick(suffixes)}`.toLowerCase(),
      () => `${this.random.pick(firstNames).toLowerCase()}${this.random.int(100, 999)}`,
    ]
    return this.random.pick(patterns)()
  }

  /**
   * Generate a random video game title
   */
  gameTitle(): string {
    const genres = [
      "Quest",
      "Battle",
      "Legend",
      "Crisis",
      "Invasion",
      "Siege",
      "Revolution",
      "Awakening",
    ]
    const settings = ["Shadow", "Dark", "Sacred", "Lost", "Forgotten", "Cursed", "Eternal"]
    const nouns = ["Kingdoms", "Lands", "Worlds", "Realms", "Empires", "Ages"]
    const patterns = [
      () => `The ${this.random.pick(settings)} ${this.random.pick(nouns)}`,
      () =>
        `${this.random.pick(genres)} of ${this.random.pick(settings)} ${this.random.pick(nouns)}`,
      () => `${this.random.pick(genres)}: ${this.random.pick(settings)} ${this.random.pick(nouns)}`,
    ]
    return this.random.pick(patterns)()
  }

  /**
   * Generate a random gaming console
   */
  console(): string {
    const consoles = [
      "PlayStation 5",
      "Xbox Series X",
      "Nintendo Switch",
      "PC",
      "PlayStation 4",
      "Xbox One",
      "Nintendo 3DS",
      "Steam Deck",
    ]
    return this.random.pick(consoles)
  }

  /**
   * Generate a random game genre
   */
  genre(): string {
    const genres = [
      "Action",
      "RPG",
      "Strategy",
      "Puzzle",
      "Shooter",
      "Racing",
      "Sports",
      "Adventure",
      "Simulation",
      "Indie",
      "Horror",
      "Fighting",
    ]
    return this.random.pick(genres)
  }

  /**
   * Generate a random game developer
   */
  developer(): string {
    const developers = [
      "Epic Games",
      "Rockstar Games",
      "Ubisoft",
      "Electronic Arts",
      "Activision Blizzard",
      "Square Enix",
      "Nintendo",
      "Sony Interactive",
      "Microsoft Game Studios",
      "Valve",
    ]
    return this.random.pick(developers)
  }

  /**
   * Generate a random game achievement
   */
  achievement(): string {
    const verbs = [
      "Destroyed",
      "Defeated",
      "Conquered",
      "Collected",
      "Unlocked",
      "Mastered",
      "Completed",
      "Discovered",
    ]
    const objects = [
      "the Boss",
      "All Levels",
      "the Secret Realm",
      "100 Treasures",
      "the Dark Tower",
      "All Achievements",
      "the Hidden Quest",
      "the Ultimate Challenge",
    ]
    return `${this.random.pick(verbs)} ${this.random.pick(objects)}`
  }

  /**
   * Generate a random player level
   */
  playerLevel(): number {
    return this.random.int(1, 100)
  }

  /**
   * Generate a random game rating (0-10)
   */
  rating(): number {
    return Math.round(this.random.float(4, 10) * 10) / 10
  }

  /**
   * Generate a random gaming platform
   */
  platform(): string {
    const platforms = [
      "Steam",
      "Epic Games Store",
      "PlayStation Network",
      "Xbox Live",
      "Nintendo eShop",
      "GOG",
      "Origin",
      "Uplay",
      "Game Pass",
    ]
    return this.random.pick(platforms)
  }
}
