
import {IdentifierGen} from "./identifier-gen";
import {IsIdentifierValidator} from "../../validator/identifier/identifier";
import {PseudoRandom} from "../psuedo-random";

xdescribe("Data Generation", function () {
  describe("Identifier", function () {
    beforeEach(function () {
      spyOn(console, 'error');
    })

    it("Default generator should never generate null references.", function () {
      try {
        let seed = 4
        new PseudoRandom(seed).patchMath()
        let gen = new IdentifierGen().maxLength(5)
        let count = 0
        for (let i = 0; i < 1000; i++) {
          let x = gen.gen()
          if (x === null) {
            count++
          }
        }
        expect(count).toBe(0)
      } catch (e) {
        fail(e)
      }
    })

    it("Should not generate illegal identifiers.", function () {
      try {
        let seed = 4
        new PseudoRandom(seed).patchMath()
        let gen = new IdentifierGen()
        let v = new IsIdentifierValidator()
        for (let i = 0; i < 100; i++) {
          let identifier = gen.gen()
          let r = v.validate(identifier)
          expect(r).toBeNull() // "Generated illegal id: " + identifier)
        }
      } catch (e) {
        fail(e)
        throw e
      }
    })

    it("Should generate a reference exactly 20 characters long.", function () {
      let cfg = {minLength: {value: 20}, maxLength: {value: 20}, notNull: true}
      let gen = new IdentifierGen().applyRestrictions(cfg)
      let s = gen.gen()
      expect(s).toBeDefined()
      expect(s.length).toEqual(20)
    })


    it("Should generate only unique values", function () {
      new PseudoRandom(4).patchMath()
      let gen = new IdentifierGen().unique().minLength(3).maxLength(3).allowedChars(Array.from("abcABC1234567890"))
      let alreadyUsed:any = {}
      for (var i = 0; i < 100; i++) {
        let s = gen.gen()
        expect(s).toBeDefined()
        expect(s.length).toEqual(3)
        expect(alreadyUsed[s]).toBeUndefined() // "Failed at index: " + i) // this will throw if 's' is invalid, but only 'invalid quoted'.
        alreadyUsed[s] = true
      }
    })

    it("Should throw an error if it cannot generate a unique value", function () {
      new PseudoRandom(4).patchMath()
      let gen = new IdentifierGen().unique().minLength(3).maxLength(3).allowedChars(Array.from("ABC"))
      let passed: any
      for (var i = 0; i < 100; i++) {
        try {
          let s = gen.gen()
        } catch (e) {
          passed = e
          break
        }
      }
      expect(passed).toBeTruthy() // "Error should have been thrown.")
    })
  })
})
