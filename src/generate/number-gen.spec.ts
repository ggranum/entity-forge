import 'mocha';
import { expect } from 'chai';
import {NumberGen} from "./number-gen";
import {PseudoRandom} from "./psuedo-random";


describe("Generation > Number", function () {

  it("Default generator should generate null about 1 in 1000 calls.", function () {
    let seed = 4
    new PseudoRandom(seed).patchMath()
    let gen = new NumberGen()
    let count = 0
    for (let i = 0; i < 10000; i++) {
      let x = gen.gen()
      if (x === null) {
        count++
      }
    }
    expect(count).to.equal(12)
  })


  /**
   * @todo ggranum: Someone better than me at statistics should verify the histogram is actually random.
   */
  it("Should generate integers between a range.", function () {
    let cfg = {min: -100, max: 100}
    let gen = new NumberGen().isInt().min(cfg.min, true).max(cfg.max, true)
    let seed = 3
    new PseudoRandom(seed).patchMath()

    let find = [cfg.min, cfg.max, 0, null]
    let found: any = {'null': 0}
    for (let i = cfg.min; i <= cfg.max; i++) {
      found[i + ''] = 0
    }
    let tries = (cfg.max - cfg.min) * 5
    while (tries--) {
      let x = gen.gen()
      found[x + '']++
    }

    find.forEach((v) => {
      expect(found[v + '']).to.be.above(0) // , "Should have found '" + v + "'")
    })

  })
})
