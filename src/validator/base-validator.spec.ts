import 'mocha';
import { expect } from 'chai';
import {NotNullValidator} from "./base-validator";

interface TestCase {
  inputs: any[],
  expectation: Function
}

describe("Validator > Not Null", function () {

    let cases: {
      valid: TestCase
      invalid: TestCase
    }

    cases = {
      valid: {
        inputs: [0, false, Number.NaN, Number.POSITIVE_INFINITY, "0", ""],
        expectation: (response: any) => expect(response).to.be.null
      },
      invalid: {
        inputs: [null, undefined],
        expectation: (response: any) => expect(response).not.to.be.null
      }
    }

    Object.keys(cases).forEach((key)=> {
      let test: TestCase = (<any>cases)[key]
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
        expect(v.validate(input)).to.be.null
      })

    })
  })
