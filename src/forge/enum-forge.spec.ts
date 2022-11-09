import 'mocha';
import { expect } from 'chai';
import {EF} from "./entity-forge";
import {EnumForge} from "./enum-forge";

describe('Enum Forge', function () {
  describe('EnumForge.enumeration', function () {

    it('Allows null values by default', function () {
      let Model = EF.obj({
        foo: EF.enumeration().values(["100", "Bob", "Sally"])
      }).asNewable()
      let m = new Model()
      let error: any = null
      try {
        m.foo = null
      } catch (e) {
        error = e
      }
      expect(error).to.be.null // "Null value should be valid.")
      expect(m.foo).to.be.null //  "Null value should be valid.")
    });

    it('Does not allow null values when notNull set', function () {
      let Model = EF.obj({
        foo: EF.enumeration().values(["100", "Bob", "Sally"]).notNull()
      }).asNewable()
      let m = new Model()
      let error: any = null
      try {
        m.foo = null
      } catch (e) {
        error = e
      }
      expect(error).not.to.be.undefined // "Setting to null should throw error")
      expect(m.foo).to.equal("100") // , "Value should be reset to previous value (default).")
    });

    it('Order of operations has no effect. ', function () {
      let Model = EF.obj({
        foo: EnumForge.enumeration().notNull().values(["100", "Bob", "Sally"])
      }).asNewable()
      let m = new Model()
      let error: any = null
      try {
        m.foo = null
      } catch (e) {
        error = e
      }
      expect(error).not.to.be.undefined // "Setting to null should throw error")
      expect(m.foo).to.equal("100") // , "Value should be reset to previous value (default).")
    });


    it('Does not allow values not in the enum', function () {
      let model = {
        foo: EF.enumeration().values(["100", "Bob", "Sally"]).notNull()
      }
      let disallowed: any = ['1', 100, "bob", "sally", "sam", false, true, 1.2, 0, ((x: any) => false), model];
      for (let i = 0; i < disallowed.length; i++) {
        let result = model.foo.validate(disallowed[i])
        expect(result).to.be.ok // "The value '" + disallowed[i] + "' should not be allowed.")
        expect(result!['isOneOf']).not.to.be.undefined
      }
    });
    describe('Generation', function () {

      it('Generates random values from the enum options', function () {
        let forge = EF.enumeration().values(["100", "Bob", "Sally"])
        let ex = forge.gen()
        expect(ex).not.to.be.undefined
      })

      it('Can generate null values when null values allowed: ', function () {
        let values = ["Bob", "Sally"]
        let forge = EF.enumeration().values(values)


        let found: any = {'null': 0}
        values.forEach((value) => {
          found[value] = 0
        })
        let tries = values.length * 5
        forge.ignite()
        forge._generatedBy.nullChance(1 / (values.length))
        while (tries--) {
          let x = forge.gen()
          found[x + '']++
        }
        Object.keys(found).forEach((v) => {
          expect(found[v + '']).to.be.above(0)
          if (found[v + ''] === 0) {
            console.log("Should have generated all enum options. Missed: '" + v + "'")
          }

        })
      })

      it('Does not generate null enum values when null values are not allowed: ', function () {
        let values = ["Bob", "Sally"]
        let forge = EF.enumeration().values(values).notNull()

        let found: any = {'null': 0}
        values.forEach((value) => {
          found[value] = 0
        })
        let tries = values.length * 5
        while (tries--) {
          let x = forge.gen()
          found[x + '']++
        }
        expect(found['null']).to.equal(0) // , "Should not have generated null values.")
      })
    })
  })


})
