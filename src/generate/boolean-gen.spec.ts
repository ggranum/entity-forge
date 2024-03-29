import {expect} from 'chai';
import 'mocha';
import {BooleanGen} from "./boolean-gen";
import {PseudoRandom} from "./psuedo-random";


describe("Generate > Boolean", function () {

  /**
   */
  it("Should generate true and false values.", function () {

    let gen = new BooleanGen().nullChance(1 / 3)
    let seed = 1
    new PseudoRandom(seed).patchMath()

    let found: any = {'true': 0, 'false': 0, 'null': 0}
    let tries = 10
    while (tries--) {
      let x = gen.gen()
      found[x + '']++
    }

    let find = [true, false, null]
    find.forEach((v) => {
      expect(found[v + '']).to.be.above(0) // , "Should have found '" + v + "'")
    })
  })
})
