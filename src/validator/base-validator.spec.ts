import {NotNullValidator} from "validator/base-validator";

interface TestCase {
  inputs: any[],
  expectation: Function
}

describe("Validators", function () {

  describe("NotNullValidator", function () {

    let cases: {
      valid: TestCase
      invalid: TestCase
    }

    cases = {
      valid: {
        inputs: [0, false, Number.NaN, Number.POSITIVE_INFINITY, "0", ""],
        expectation: (response: any) => expect(response).toBeNull()
      },
      invalid: {
        inputs: [null, undefined],
        expectation: (response: any) => expect(response).not.toBeNull()
      }
    }

    Object.keys(cases).forEach((key)=> {
      let test: TestCase = cases[key]
      test.inputs.forEach((input)=> {
        it(`is ${key} when input is '${input}'`, function () {
          let v = new NotNullValidator()
          test.expectation(v.validate(input))
        })
      })

    })


    it('is always valid when disabled via #notNull(false)', function () {
      let v = new NotNullValidator().notNull(false)
      cases.invalid.inputs.forEach((input)=> {
        expect(v.validate(input)).toBeNull()
      })

    })
  })
})
