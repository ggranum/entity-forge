import {IdentifierGen} from "generate/index";
import {IsIdentifierValidator} from "validator/index";

describe("Data Generation", function () {
  describe("Identifier", function () {
    beforeEach(function () {
      spyOn(console, 'error');
    })

    it("Default generator should never generate null references.", function () {
      try {
        let seed = 4
        Math.seedrandom(seed)
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
        console.log("grrrr", e)
        throw e
      }
    })

    it("Should not generate illegal identifiers.", function () {
      try {
        let seed = 4
        Math.seedrandom(seed)
        let gen = new IdentifierGen()
        let v = new IsIdentifierValidator()
        for (let i = 0; i < 100; i++) {
          let identifier = gen.gen()
          let r = v.validate(identifier)
          expect(r).toBeNull("Generated illegal id: " + identifier)
        }
      } catch (e) {
        console.log("grrrr", e)
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
      Math.seedrandom(4)
      let gen = new IdentifierGen().unique().minLength(3).maxLength(3).allowedChars(Array.from("abcABC1234567890"))
      let alreadyUsed = {}
      for (var i = 0; i < 100; i++) {
        let s = gen.gen()
        expect(s).toBeDefined()
        expect(s.length).toEqual(3)
        expect(alreadyUsed[s]).toBeUndefined("Failed at index: " + i) // this will throw if 's' is invalid, but only 'invalid quoted'.
        alreadyUsed[s] = true
      }
    })

    it("Should throw an error if it cannot generate a unique value", function () {
      Math.seedrandom(4)
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
      expect(passed).toBeTruthy("Error should have been thrown.")
    })
  })
})
