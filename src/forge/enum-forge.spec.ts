import {EntityForge} from "./index";

(function () {
  let EF = EntityForge


  describe('EntityForge.enumeration', function () {
    beforeEach(function () {
    });

    it('Allows null values by default', function () {
      let Model = EF.obj({
        foo: EF.enumeration().values(["100", "Bob", "Sally"])
      }).asNewable()
      let m = new Model()
      let error:any = null
      try{
        m.foo = null
      } catch(e){
        error = e
      }
      expect(error).toBeNull()
      expect(m.foo).toBe(null, "Null should be valid.")
    });

    it('Does not allow null values when notNull set', function () {
      let Model = EF.obj({
        foo: EF.enumeration().values(["100", "Bob", "Sally"]).notNull()
      }).asNewable()
      let m = new Model()
      let error:any = null
      try{
        m.foo = null
      } catch(e){
        error = e
      }
      expect(error).toBeDefined("Setting to null should throw error")
      expect(m.foo).toBe("100", "Value should be reset to previous value (default).")
    });

    it('Order of operations has no effect. ', function () {
      let Model = EF.obj({
        foo: EF.enumeration().notNull().values(["100", "Bob", "Sally"])
      }).asNewable()
      let m = new Model()
      let error:any = null
      try{
        m.foo = null
      } catch(e){
        error = e
      }
      expect(error).toBeDefined("Setting to null should throw errro")
      expect(m.foo).toBe("100", "Value should be reset to previous value (default).")
    });


    it('Does not allow values not in the enum', function () {
      let model = {
        foo: EF.enumeration().values(["100", "Bob", "Sally"]).notNull()
      }
      let disallowed:any = ['1', 100, "bob", "sally", "sam", false, true, 1.2, 0, ((x:any)=> false), model];
      for (let i = 0; i < disallowed.length; i++) {
        let result = model.foo.validate(disallowed[i])
        expect(result).toBeDefined()
        expect(result.isOneOf).toBeDefined()
      }
    });
    describe('Generation', function () {

      it('Generates random values from the enum options', function () {
        let forge = EF.enumeration().values(["100", "Bob", "Sally"])
        let ex = forge.gen()
        expect(ex).toBeDefined()
      })

      it('Can generate null values when null values allowed: ', function () {
        let values = [ "Bob", "Sally"]
        let forge = EF.enumeration().values(values)


        let found = {'null': 0}
        values.forEach((value)=>{
          found[value] = 0
        })
        let tries = values.length*5
        while(tries--){
          let x = forge.gen({nullChance: 1/(values.length)})
          found[x + '']++
        }
        Object.keys(found).forEach((v)=>{
          expect(found[v + '']).toBeGreaterThan(0, "Should have generated all enum options. Missed: '" + v + "'")
        })
      })

      it('Does not generate null enum values when null values are not allowed: ', function () {
        let values = [ "Bob", "Sally"]
        let forge = EF.enumeration().values(values).notNull()

        let found = {'null': 0}
        values.forEach((value)=>{
          found[value] = 0
        })
        let tries = values.length*5
        while(tries--){
          let x = forge.gen()
          found[x + '']++
        }
        expect(found['null']).toBe(0, "Should not have generated null values.")
      })
    })
  })



})()