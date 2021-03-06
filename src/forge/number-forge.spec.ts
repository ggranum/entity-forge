import {EF} from "./entity-forge";
import {PseudoRandom} from "../generate/psuedo-random";


describe('Forge', function () {
  describe('NumberForge #int', function () {
    beforeEach(function () {
      new PseudoRandom(4).patchMath()
    });

    it('Allows null values by default', function () {
      let Model = EF.obj({
        foo: EF.int()
      }).asNewable()
      let m = new Model()
      let error: any = null
      try {
        m.foo = null
      } catch (e) {
        error = e
      }
      expect(error).toBeNull() //"Null is allowed, an error should not be thrown.")
      expect(m.foo).toBe(null)//, "Value should now be null.")
    });

    it('Does not allow null values when notNull set', function () {
      let Model = EF.obj({
        foo: EF.int().notNull()
      }).asNewable()
      let m = new Model()
      let error: any = null
      try {
        m.foo = null
      } catch (e) {
        error = e
      }
      expect(error).toBeDefined()
      expect(m.foo).toBe(0)//, "Value should be reset to previous value (default).")
    });

    it('Does not allow non-numeric values', function () {
      let model = {
        foo: EF.int()
      }
      let disallowed: any = ['1', 1.001, "bob", ((x: any)=> false), model];
      for (let i = 0; i < disallowed.length; i++) {
        let result = model.foo.validate(disallowed[i])
        expect(result).toBeTruthy()//"The value '" + disallowed[i] + "' should not be allowed.")
        expect(result!['isNumber'] || result!['isInt']).toBeDefined() //disallowed[i] + " should not be allowed.")
      }
    });

    describe('#gen', function () {

      it('Generates random integers', function () {
          let forge = EF.int()
          let ex = forge.gen()
          expect(ex).toBeDefined()
      })

      it('Generates null integers when null values allowed: ', function () {
        let forge = EF.int().min(0).max(3)
        new PseudoRandom(100).patchMath()
        let values = [0, 1, 2, 3, null]

        let found:any = {}
        values.forEach((value)=> {
          found[value + ''] = 0
        })
        let tries = values.length * 5
        forge.ignite()
        forge._generatedBy.nullChance(1 / (values.length))
        while (tries--) {
          let x = forge.gen()
          found[x + '']++
        }
        Object.keys(found).forEach((v)=> {
          expect(found[v + '']).toBeGreaterThan(0)//, "Should have generated all values. Missed: '" + v + "'")
        })
      })

      it('Does not generate null ints when null values are not allowed: ', function () {
        let forge = EF.int().min(0).max(3).notNull()
        let ex: any
        let generatedNull = false
        for (let i = 0; i < 10000; i++) {
          ex = forge.gen()
          if (ex === null) {
            generatedNull = true
            break
          }
        }
        expect(generatedNull).toBe(false)//, "Should not generate null values")
      })

    })

  })
})
