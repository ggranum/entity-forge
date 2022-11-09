import 'mocha';
import { expect } from 'chai';
import {NumberValidator} from "./number-validator";

describe("Validator > Number", function () {


    let validNumbers = [1, 1.00, 0, 1E9, -1E9, 2, 21, 9.888398798, 0x0138, Math.PI,
      Number.MAX_SAFE_INTEGER, Number.MAX_VALUE,
      Number.MIN_SAFE_INTEGER, Number.MIN_VALUE
    ]


    it('Any number format is valid by default.', function () {
      let c = new NumberValidator()
      validNumbers.forEach((v)=> {
        let result = c.validate(v)
        expect(result).to.be.null
      })
    })

    it("Null input is valid by default.", function () {
      let c = new NumberValidator()
      let result = c.validate(null)
      expect(result).to.be.null
    })

    it("returns validation failure message if input is a string.", function () {
      let c = new NumberValidator()
      let result = c.validate("Not a number.")
      expect(result).to.be.ok//"The value should not be allowed.")
      expect(result!['isNumber']).not.to.be.undefined
    })

    it("#min check returns null if input greater than specified min value", function () {
      let c = new NumberValidator().min(0)
      let result = c.validate(100)
      expect(result).to.be.null
    })

    it("#min check returns null if input equal to the specified min value", function () {
      let c = new NumberValidator().min(100)
      let result = c.validate(100)
      expect(result).to.be.null
    })

    it("#min provides error when exclusive and input is equal to min. ", function () {
      let c = new NumberValidator().min(100, false)
      let result = c.validate(100)
      expect(result).to.be.ok//"The value should not be allowed.")
      expect(result!['min']).not.to.be.undefined
    })

    it("#min check returns only 'number' validation failure message if input is a string", function () {
      let c = new NumberValidator().min(100)
      let result = c.validate("12")
      expect(result).to.be.ok//"The value should not be allowed.")
      expect(result!['isNumber']).not.to.be.undefined
      expect(result!['min']).to.be.undefined
    })

    it("#max returns null if input less than specified max value", function () {
      let c = new NumberValidator().max(100)
      let result = c.validate(99)
      expect(result).to.be.null
    })

    it("#max inclusive=true check returns null if input equal to the specified max value", function () {
      let c = new NumberValidator().max(100, true)
      let result = c.validate(100)
      expect(result).to.be.null
    })

    it("#max inclusive=false check returns validation failure message if input is equal to the specified max value", function () {
      let c = new NumberValidator().max(100, false)
      let result = c.validate(100)
      expect(result).to.be.ok // "The value should not be allowed.")
      expect(result!['max']).not.to.be.undefined
    })

    it("#max check returns only 'number' validation failure message if input is a string", function () {
      let c = new NumberValidator().max(100)
      let result = c.validate("12")
      expect(result).to.be.ok // "The value should not be allowed.")
      expect(result!['isNumber']).not.to.be.undefined
      expect(result!['max']).to.be.undefined
    })
})






