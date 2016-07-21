"use strict";

(function () {

  describe('Check', function () {


    describe('Checks.exists', function () {

      it('returns true for real values', function () {
        let c = Checks.any().exists()

        let valid = ["", 1, 1.0, c, {}, ()=> null, []]

        valid.forEach((v)=> {
          expect(c.check(v)).toBe(true)
        })
      })

      it('returns false for null and undefined values', function () {
        let c = Checks.any().exists()
        let y = null
        let z = undefined
        let invalid = [null, undefined, y, z]

        invalid.forEach((v)=> {
          expect(c.check(v)).toBe(false)
        })
      })
    })



    describe('Checks.number', function () {

      let validNumbers = [1, 1.00, 0, 1E9, -1E9, 2, 21, 9.888398798, 0x0138, Math.PI,
        Number.MAX_SAFE_INTEGER, Number.MAX_VALUE,
        Number.MIN_SAFE_INTEGER, Number.MIN_VALUE
      ]


      describe('#validate', function () {

        it('returns null if input is numeric ', function () {
          let c = Checks.number()
          validNumbers.forEach((v)=> {
            let result = c.validate(v)
            expect(result).toBeNull()
          })
        })

        it("returns null if input is null valued.", function () {
          let c = Checks.number()
          let result = c.validate(null)
          expect(result).toBeNull()
        })

        it("returns validation failure message if input is a string.", function () {
          let c = Checks.number()
          let result = c.validate("Not a number.")
          expect(result).toBeDefined()
          expect(result.number).toBeDefined()
        })

        it("#min check returns null if input greater than specified min value", function(){
          let c = Checks.number().min(0)
          let result = c.validate(100)
          expect(result).toBeNull()
        })

        it("#min check returns null if input equal to the specified min value", function(){
          let c = Checks.number().min(100)
          let result = c.validate(100)
          expect(result).toBeNull()
        })

        it("#min inclusive=false check returns validation failure message if input is equal to the specified min value", function(){
          let c = Checks.number().min(100, false)
          let result = c.validate(100)
          expect(result).toBeDefined()
          expect(result.min).toBeDefined()
        })

        it("#min check returns only 'number' validation failure message if input is a string", function(){
          let c = Checks.number().min(100)
          let result = c.validate("12")
          expect(result).toBeDefined()
          expect(result.number).toBeDefined()
          expect(result.min).toBeUndefined()
        })

        it("#max check returns null if input greater than specified max value", function(){
          let c = Checks.number().max(100)
          let result = c.validate(99)
          expect(result).toBeNull()
        })

        it("#max inclusive=true check returns null if input equal to the specified max value", function(){
          let c = Checks.number().max(100, true)
          let result = c.validate(100)
          expect(result).toBeNull()
        })

        it("#max check returns validation failure message if input is equal to the specified max value", function(){
          let c = Checks.number().max(100)
          let result = c.validate(100)
          expect(result).toBeDefined()
          expect(result.max).toBeDefined()
        })

        it("#max check returns only 'number' validation failure message if input is a string", function(){
          let c = Checks.number().max(100)
          let result = c.validate("12")
          expect(result).toBeDefined()
          expect(result.number).toBeDefined()
          expect(result.max).toBeUndefined()
        })
      })



    })


    describe('Checks.string', function () {
      let validStrings = ["", "bob", "1", "0.00", "null", 'asfasdfdsfasdfwewefwefdgdag239823894 \n asdfasdf' ]


      it('#validate Checks.string() returns null if input is string ', function () {
        let c = Checks.string()
        validStrings.forEach((v)=> {
          let result = c.validate(v)
          expect(result).toBeNull()
        })
      })
    })




    })
})()