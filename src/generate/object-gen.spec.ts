import {ObjectGen} from "./object-gen";
import {StringGen} from "./string-gen";
import {PseudoRandom} from "./psuedo-random";



describe("Data Generation", function(){
  describe("Object", function () {

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
      expect(count).toBe(10)
    })

    it("should generate random string children when provided with a string generator as a child field.", function(){
      let gen = new ObjectGen().notNull()
      gen.fields({
        aString: new StringGen().applyRestrictions({minLength: {value:2}, maxLength: {value:5}, notNull: true})
      })
      for (let i = 0; i < 1000; i++) {
        let x = gen.gen()
        expect(x).toBeDefined() // "Failed at index: " + i)
        expect(x.aString).toBeDefined()
        expect(x.aString.length).toBeGreaterThan(1)
        expect(x.aString.length).toBeLessThan(6)
      }
    })
  })
})