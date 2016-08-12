import {EntityForge} from "forge/index";
let EF = EntityForge


describe('EntityForge.boolean', function () {
  beforeEach(function () {
    Math.seedrandom(4)
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
    expect(error).toBeNull()
    expect(m.foo).toBe(null, "Value should now be null.")
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
    expect(error).toBeDefined()
    expect(m.foo).toBe(false, "Value should be reset to previous value (default).")
  });

  it('Does not allow non-boolean values', function () {
    let model = {
      foo: EF.bool()
    }
    let disallowed: any = ['1', 1, 10, 100, "bob", 1.2, 0, ((x: any)=> false), model];
    for (let i = 0; i < disallowed.length; i++) {
      let result = model.foo.validate(disallowed[i])
      expect(result).toBeDefined()
    }
  });

  describe('#generate', function () {

    it('Generates random booleans', function () {
      try {
        let forge = EF.bool()
        let ex = forge.gen()
        expect(ex).toBeDefined()
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
          let x = forge.gen()
          found[x + '']++
        }
        let find = [true, false, null]
        find.forEach((v)=> {
          expect(found[v + '']).toBeGreaterThan(0, "Should have found '" + v + "'")
        })
      } catch (e) {
        console.log(e)
        debugger
      }
    })

    it('Does not generate null booleans when null values are not allowed: ', function () {
      let forge = EF.bool().notNull()
      let found = {'true': 0, 'false': 0, 'null': 0}
      let tries = 10
      forge.ignite()
      forge._generatedBy.nullChance(1 / 3)
      while (tries--) {
        let x = forge.gen()
        found[x + '']++
      }
      expect(found['null']).toBe(0, "Should not generate null values.")
    })
  })
})

