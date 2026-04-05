import type { LocaleData } from "../locales/index.js"
import type { MersenneTwister } from "../random.js"

export class ScienceProvider {
  constructor(
    private readonly random: MersenneTwister,
    private readonly locale: LocaleData,
  ) {}

  /**
   * Generate a random chemical element
   */
  chemicalElement(): { symbol: string; name: string; atomicNumber: number } {
    return this.random.pick(this.locale.science.chemicalElement)
  }

  /**
   * Generate a random unit of measurement
   */
  unit(): { name: string; symbol: string; type: string } {
    return this.random.pick(this.locale.science.unit)
  }
}
