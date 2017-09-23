/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */


export class PseudoRandom {
  private runningSeed: number;

  constructor(private seed: number = Date.now()) {
    this.runningSeed = seed % 2147483647;
    if (this.runningSeed <= 0) {
      this.runningSeed += 2147483646;
    }
    for(let i = 0; i < 10; i++)
    {
      this.next()
    }
  }

  /**
   * Returns a pseudo-random value between 1 and 2^32 - 2.
   */
  next(): number {
    return this.runningSeed = this.runningSeed * 16807 % 2147483647;
  }


  /**
   * Returns a pseudo-random floating point number in range [0, 1).
   */
  nextFloat() {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.next() - 1) / 2147483646;
  };

  patchMath():this {
    Math.random = () => {
      return this.nextFloat()
    }
    return this;
  }
}
