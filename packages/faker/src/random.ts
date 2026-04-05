/**
 * Mersenne Twister PRNG implementation for reproducible random number generation.
 * Based on the MT19937 algorithm.
 */
export class MersenneTwister {
  private readonly mt: number[] = new Array(624)
  private mti = 625

  constructor(seed?: number) {
    this.seed(seed ?? Date.now())
  }

  /**
   * Initialize the generator with a seed
   */
  seed(seed: number): void {
    this.mt[0] = seed >>> 0
    for (this.mti = 1; this.mti < 624; this.mti++) {
      const s = (this.mt[this.mti - 1] ?? 0) ^ ((this.mt[this.mti - 1] ?? 0) >>> 30)
      this.mt[this.mti] =
        ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253 + this.mti
      const current = this.mt[this.mti]
      if (current !== undefined) {
        this.mt[this.mti] = current >>> 0
      }
    }
  }

  /**
   * Generate a random 32-bit integer
   */
  int32(): number {
    let y: number

    if (this.mti >= 624) {
      let kk: number
      const mag01 = [0x0, 0x9908b0df]

      for (kk = 0; kk < 227; kk++) {
        y = ((this.mt[kk] ?? 0) & 0x80000000) | ((this.mt[kk + 1] ?? 0) & 0x7fffffff)
        this.mt[kk] = (this.mt[kk + 397] ?? 0) ^ (y >>> 1) ^ (mag01[y & 0x1] ?? 0)
      }
      for (; kk < 623; kk++) {
        y = ((this.mt[kk] ?? 0) & 0x80000000) | ((this.mt[kk + 1] ?? 0) & 0x7fffffff)
        this.mt[kk] = (this.mt[kk - 227] ?? 0) ^ (y >>> 1) ^ (mag01[y & 0x1] ?? 0)
      }
      y = ((this.mt[623] ?? 0) & 0x80000000) | ((this.mt[0] ?? 0) & 0x7fffffff)
      this.mt[623] = (this.mt[396] ?? 0) ^ (y >>> 1) ^ (mag01[y & 0x1] ?? 0)

      this.mti = 0
    }

    y = this.mt[this.mti++] ?? 0

    y ^= y >>> 11
    y ^= (y << 7) & 0x9d2c5680
    y ^= (y << 15) & 0xefc60000
    y ^= y >>> 18

    return y >>> 0
  }

  /**
   * Generate a random number between 0 (inclusive) and 1 (exclusive)
   */
  random(): number {
    return this.int32() * (1.0 / 4294967296.0)
  }

  /**
   * Generate a random integer in range [min, max] (inclusive)
   */
  int(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min
  }

  /**
   * Generate a random float in range [min, max)
   */
  float(min: number, max: number): number {
    return this.random() * (max - min) + min
  }

  /**
   * Pick a random element from an array
   */
  pick<T>(array: readonly T[]): T {
    if (array.length === 0) {
      throw new Error("Cannot pick from empty array")
    }
    const result = array[this.int(0, array.length - 1)]
    if (result === undefined) {
      throw new Error("Index out of bounds")
    }
    return result
  }

  /**
   * Shuffle an array (Fisher-Yates algorithm)
   */
  shuffle<T>(array: readonly T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i)
      if (!(i in result) || !(j in result)) {
        throw new Error("Shuffle index out of bounds")
      }
      const temp = result[i] as T
      const target = result[j] as T
      result[i] = target
      result[j] = temp
    }
    return result
  }

  /**
   * Pick multiple unique random elements from an array
   */
  pickMultiple<T>(array: readonly T[], count: number): T[] {
    if (count > array.length) {
      throw new Error("Cannot pick more elements than array length")
    }
    return this.shuffle(array).slice(0, count)
  }

  /**
   * Generate a random boolean with optional probability
   */
  boolean(probability = 0.5): boolean {
    return this.random() < probability
  }

  /**
   * Pick a weighted random element
   */
  weighted<T>(items: Array<{ value: T; weight: number }>): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
    let random = this.random() * totalWeight

    for (const item of items) {
      random -= item.weight
      if (random <= 0) {
        return item.value
      }
    }

    // If we reach here, return the last item (guaranteed to exist)
    const lastItem = items[items.length - 1]
    if (!lastItem) {
      throw new Error("Unable to pick weighted item")
    }
    return lastItem.value
  }
}
