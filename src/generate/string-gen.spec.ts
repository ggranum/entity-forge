import 'mocha';
import { expect } from 'chai';
import {PseudoRandom} from "./psuedo-random";
import {StringGen} from "./string-gen";

describe("Generate > String", function () {

  it("Default generator should generate null about 1 in 1000 calls.", function () {
    new PseudoRandom(4).patchMath()
    let gen = new StringGen()
    let count = 0
    for (let i = 0; i < 10000; i++) {
      let x = gen.gen()
      if (x === null) {
        count++
      }
    }
    expect(count).to.equal(10)
  })

  /**
   */
  it("Should generate a string exactly 20 characters long.", function () {
    let cfg = {minLength: {value: 20}, maxLength: {value: 20}, notNull: true}
    let gen = new StringGen().applyRestrictions(cfg)
    let s = gen.gen()
    expect(s).not.to.equal(undefined)
    expect(s.length).to.equal(20)
  })
})
