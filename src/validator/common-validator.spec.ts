import 'mocha';
import { expect } from 'chai';
import {Validator} from "./validator";
import {MaxLengthValidator, MinLengthValidator} from "./common-validator";

  describe("Validator > Min Length", function () {

    interface LengthCase {
      it(input: any): string
      inputs: any[]
      validator: Validator
      expectation: Function
    }


    let cases: {
      [key: string]: LengthCase
    }

    cases = {
      inclusiveTooShort: {
        it: (input) => `is invalid when inclusive and input length is less than minLength for input: '${input} and minLength = 4`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MinLengthValidator().minLength(4, true),
        expectation: (response: any) => expect(response).not.to.be.null
      },
      inclusiveEqualValid: {
        it: (input) => `is valid when inclusive and input length equals minLength for input: '${input}' and minLength = 3`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MinLengthValidator().minLength(3, true),
        expectation: (response: any) => expect(response).to.be.null
      },
      inclusiveLongerValid: {
        it: (input) => `is valid when inclusive and input length is greater than minLength for input: '${input}' and minLength = 3`,
        inputs: ["abcd", [1, 2, 3, 4]],
        validator: new MinLengthValidator().minLength(3, true),
        expectation: (response: any) => expect(response).to.be.null
      },
      exclusiveEqualInvalid: {
        it: (input) => `is invalid when exclusive and input length equals minLength for input: '${input}' and minLength = 3`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MinLengthValidator().minLength(3, false),
        expectation: (response: any) => expect(response).not.to.be.null
      },
      exclusiveLongerValid: {
        it: (input) => `is valid when exclusive and input length is greater than minLength for input: '${input}' and minLength = 3`,
        inputs: ["abcd", [1, 2, 3, 4]],
        validator: new MinLengthValidator().minLength(3, false),
        expectation: (response: any) => expect(response).to.be.null
      }
    }

    Object.keys(cases).forEach((key)=> {
      let test: LengthCase = cases[key]
      test.inputs.forEach((input)=> {
        it(test.it(input), function () {
          test.expectation(test.validator.validate(input))
        })
      })

    })
  })

  describe("Validator > Max Length", function () {

    interface LengthCase {
      it(input: any): string
      inputs: any[]
      validator: Validator
      expectation: Function
    }

    let cases: {
      [key: string]: LengthCase
    }

    cases = {
      inclusiveTooLong: {
        it: (input) => `is invalid when inclusive and input length is greater than maxLength for input: '${input} and maxLength = 4`,
        inputs: ["abcde", [1, 2, 3, 4, 5]],
        validator: new MaxLengthValidator().maxLength(4, true),
        expectation: (response: any) => expect(response).not.to.be.null
      },
      inclusiveEqualValid: {
        it: (input) => `is valid when inclusive and input length equals maxLength for input: '${input}' and maxLength = 3`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MaxLengthValidator().maxLength(3, true),
        expectation: (response: any) => expect(response).to.be.null
      },
      inclusiveShorterValid: {
        it: (input) => `is valid when inclusive and input length is greater than maxLength for input: '${input}' and maxLength = 3`,
        inputs: ["ab", [1, 2]],
        validator: new MaxLengthValidator().maxLength(3, true),
        expectation: (response: any) => expect(response).to.be.null
      },
      exclusiveEqualInvalid: {
        it: (input) => `is invalid when exclusive and input length equals maxLength for input: '${input}' and maxLength = 3`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MaxLengthValidator().maxLength(3, false),
        expectation: (response: any) => expect(response).not.to.be.null
      },
      exclusiveShorterValid: {
        it: (input) => `is valid when exclusive and input length is less than maxLength for input: '${input}' and maxLength = 5`,
        inputs: ["abcd", [1, 2, 3, 4]],
        validator: new MaxLengthValidator().maxLength(5, false),
        expectation: (response: any) => expect(response).to.be.null
      }
    }

    Object.keys(cases).forEach((key)=> {
      let test: LengthCase = cases[key]
      test.inputs.forEach((input)=> {
        it(test.it(input), function () {
          test.expectation(test.validator.validate(input))
        })
      })

    })
  })


