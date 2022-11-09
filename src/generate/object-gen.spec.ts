import 'mocha';
import { expect } from 'chai';
import {ObjectGen} from "./object-gen";
import {PseudoRandom} from "./psuedo-random";
import {StringGen} from "./string-gen";


describe("Generation > Object", function () {

  beforeEach(function () {
    new PseudoRandom(5).patchMath()
  });

  it("Default generator should generate null about 1 in 1000 calls.", function () {
    let gen = new ObjectGen()
    let count = 0
    for (let i = 0; i < 10000; i++) {
      let x = gen.gen()
      if (x === null) {
        count++
      }
    }
    expect(count).to.equal(10)
  })

  it("should generate random string children when provided with a string generator as a child field.", function () {
    let gen = new ObjectGen().notNull()
    gen.fields({
      aString: new StringGen().applyRestrictions({minLength: {value: 2}, maxLength: {value: 5}, notNull: true})
    })
    for (let i = 0; i < 1000; i++) {
      let x = gen.gen()
      expect(x).not.to.be.undefined // "Failed at index: " + i)
      expect(x.aString).not.to.be.undefined
      expect(x.aString.length).to.be.above(1)
      expect(x.aString.length).to.be.below(6)
    }
  })
})
