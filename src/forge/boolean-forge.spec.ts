import 'mocha';
import { expect, assert } from 'chai';
import {EF} from "./entity-forge";
import {PseudoRandom} from "../generate/psuedo-random";


console.log('[Debug]', 'global#EF == null ?', EF == null);

describe('EntityForge.boolean', function () {
  beforeEach(function () {
    new PseudoRandom(4).patchMath()
  });

  it('Allows null values by default', function () {
    let Model = EF.obj({
      foo: EF.bool()
    }).asNewable()

    let m = new Model()

    let error: any = null
    try {
      m.foo = null
    } catch (e) {
      error = e
    }
    expect(error).to.be.null
    expect(m.foo).to.be.null // , "Value should now be null.")
  });

  it('Does not allow null values when notNull set', function () {
    let Model = EF.obj({
      foo: EF.bool().notNull()
    }).asNewable()
    let m = new Model()
    let error: any = null
    try {
      m.foo = null
    } catch (e) {
      error = e
    }
    expect(error).not.to.be.undefined
    expect(m.foo).to.be.false // , "Value should be reset to previous value (default).")
  });

  it('Does not allow non-boolean values', function () {
    let model = {
      foo: EF.bool()
    }
    let disallowed: any = ['1', 1, 10, 100, "bob", 1.2, 0, ((x: any)=> false), model];
    for (let i = 0; i < disallowed.length; i++) {
      let result = model.foo.validate(disallowed[i])
      expect(result).not.to.be.undefined
    }
  });

  describe('#generate', function () {

    it('Generates random booleans', function () {
      try {
        let forge = EF.bool()
        let ex = forge.gen()
        expect(ex).not.to.be.undefined
      } catch (e) {
        debugger
      }
    })

    it('Can generate null booleans when null values allowed: ', function () {
      try {
        let forge = EF.bool()
        let found = {'true': 0, 'false': 0, 'null': 0}
        let tries = 10
        forge.ignite()
        forge._generatedBy.nullChance(1 / 3)
        while (tries--) {
          let x:any = forge.gen();
          (<any>found)[x + '']++
        }
        let find = [true, false, null]
        find.forEach((v)=> {
          expect((<any>found)[v + '']).to.be.above(0) // , "Should have found '" + v + "'")
        })
      } catch (e) {
        assert.fail(e)
      }
    })

    it('Does not generate null booleans when null values are not allowed: ', function () {
      let forge = EF.bool().notNull()
      let found = {'true': 0, 'false': 0, 'null': 0}
      let tries = 10
      forge.ignite()
      forge._generatedBy.nullChance(1 / 3)
      while (tries--) {
        let x:any = forge.gen();
        (<any>found)[x + '']++
      }
      expect(found['null']).to.equal(0) // , "Should not generate null values.")
    })
  })
})

