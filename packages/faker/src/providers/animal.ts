import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class AnimalProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random bear species
   */
  bear(): string {
    return this.random.pick(this.locale.animal.bear)
  }

  /**
   * Generate a random bird species
   */
  bird(): string {
    return this.random.pick(this.locale.animal.bird)
  }

  /**
   * Generate a random cat breed
   */
  cat(): string {
    return this.random.pick(this.locale.animal.cat)
  }

  /**
   * Generate a random dog breed
   */
  dog(): string {
    return this.random.pick(this.locale.animal.dog)
  }

  /**
   * Generate a random fish species
   */
  fish(): string {
    return this.random.pick(this.locale.animal.fish)
  }

  /**
   * Generate a random horse breed
   */
  horse(): string {
    return this.random.pick(this.locale.animal.horse)
  }

  /**
   * Generate a random insect species
   */
  insect(): string {
    return this.random.pick(this.locale.animal.insect)
  }

  /**
   * Generate a random snake species
   */
  snake(): string {
    return this.random.pick(this.locale.animal.snake)
  }

  /**
   * Generate a random animal type
   */
  type(): string {
    const types = [
      "Bear",
      "Bird",
      "Cat",
      "Dog",
      "Fish",
      "Horse",
      "Insect",
      "Snake",
      "Mammal",
      "Reptile",
      "Amphibian",
    ]
    return this.random.pick(types)
  }

  /**
   * Generate a random animal
   */
  animal(): string {
    const allAnimals = [
      ...this.locale.animal.bear,
      ...this.locale.animal.bird,
      ...this.locale.animal.cat,
      ...this.locale.animal.dog,
      ...this.locale.animal.fish,
      ...this.locale.animal.horse,
      ...this.locale.animal.insect,
      ...this.locale.animal.snake,
    ]
    return this.random.pick(allAnimals)
  }
}
