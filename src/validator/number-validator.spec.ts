import {NumberValidator} from "validator/index";

describe("Validators", function () {

  describe('Number', function () {

    let validNumbers = [1, 1.00, 0, 1E9, -1E9, 2, 21, 9.888398798, 0x0138, Math.PI,
      Number.MAX_SAFE_INTEGER, Number.MAX_VALUE,
      Number.MIN_SAFE_INTEGER, Number.MIN_VALUE
    ]


    it('Any number format is valid by default.', function () {
      let c = new NumberValidator()
      validNumbers.forEach((v)=> {
        let result = c.validate(v)
        expect(result).toBeNull()
      })
    })

    it("Null input is valid by default.", function () {
      let c = new NumberValidator()
      let result = c.validate(null)
      expect(result).toBeNull()
    })

    it("returns validation failure message if input is a string.", function () {
      let c = new NumberValidator()
      let result = c.validate("Not a number.")
      expect(result).toBeTruthy("The value should not be allowed.")
      expect(result['isNumber']).toBeDefined()
    })

    it("#min check returns null if input greater than specified min value", function () {
      let c = new NumberValidator().min(0)
      let result = c.validate(100)
      expect(result).toBeNull()
    })

    it("#min check returns null if input equal to the specified min value", function () {
      let c = new NumberValidator().min(100)
      let result = c.validate(100)
      expect(result).toBeNull()
    })

    it("#min provides error when exclusive and input is equal to min. ", function () {
      let c = new NumberValidator().min(100, false)
      let result = c.validate(100)
      expect(result).toBeTruthy("The value should not be allowed.")
      expect(result['min']).toBeDefined()
    })

    it("#min check returns only 'number' validation failure message if input is a string", function () {
      let c = new NumberValidator().min(100)
      let result = c.validate("12")
      expect(result).toBeTruthy("The value should not be allowed.")
      expect(result['isNumber']).toBeDefined()
      expect(result['min']).toBeUndefined()
    })

    it("#max returns null if input less than specified max value", function () {
      let c = new NumberValidator().max(100)
      let result = c.validate(99)
      expect(result).toBeNull()
    })

    it("#max inclusive=true check returns null if input equal to the specified max value", function () {
      let c = new NumberValidator().max(100, true)
      let result = c.validate(100)
      expect(result).toBeNull()
    })

    it("#max inclusive=false check returns validation failure message if input is equal to the specified max value", function () {
      let c = new NumberValidator().max(100, false)
      let result = c.validate(100)
      expect(result).toBeTruthy("The value should not be allowed.")
      expect(result['max']).toBeDefined()
    })

    it("#max check returns only 'number' validation failure message if input is a string", function () {
      let c = new NumberValidator().max(100)
      let result = c.validate("12")
      expect(result).toBeTruthy("The value should not be allowed.")
      expect(result['isNumber']).toBeDefined()
      expect(result['max']).toBeUndefined()
    })
  })
})






