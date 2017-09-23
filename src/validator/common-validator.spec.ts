
import {Validator} from "./validator";
import {MaxLengthValidator, MinLengthValidator} from "./common-validator";

describe("Validators", function () {
  describe("MinLengthValidator", function () {

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
        expectation: (response: any) => expect(response).not.toBeNull()
      },
      inclusiveEqualValid: {
        it: (input) => `is valid when inclusive and input length equals minLength for input: '${input}' and minLength = 3`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MinLengthValidator().minLength(3, true),
        expectation: (response: any) => expect(response).toBeNull()
      },
      inclusiveLongerValid: {
        it: (input) => `is valid when inclusive and input length is greater than minLength for input: '${input}' and minLength = 3`,
        inputs: ["abcd", [1, 2, 3, 4]],
        validator: new MinLengthValidator().minLength(3, true),
        expectation: (response: any) => expect(response).toBeNull()
      },
      exclusiveEqualInvalid: {
        it: (input) => `is invalid when exclusive and input length equals minLength for input: '${input}' and minLength = 3`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MinLengthValidator().minLength(3, false),
        expectation: (response: any) => expect(response).not.toBeNull()
      },
      exclusiveLongerValid: {
        it: (input) => `is valid when exclusive and input length is greater than minLength for input: '${input}' and minLength = 3`,
        inputs: ["abcd", [1, 2, 3, 4]],
        validator: new MinLengthValidator().minLength(3, false),
        expectation: (response: any) => expect(response).toBeNull()
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

  describe("MaxLengthValidator", function () {

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
        expectation: (response: any) => expect(response).not.toBeNull()
      },
      inclusiveEqualValid: {
        it: (input) => `is valid when inclusive and input length equals maxLength for input: '${input}' and maxLength = 3`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MaxLengthValidator().maxLength(3, true),
        expectation: (response: any) => expect(response).toBeNull()
      },
      inclusiveShorterValid: {
        it: (input) => `is valid when inclusive and input length is greater than maxLength for input: '${input}' and maxLength = 3`,
        inputs: ["ab", [1, 2]],
        validator: new MaxLengthValidator().maxLength(3, true),
        expectation: (response: any) => expect(response).toBeNull()
      },
      exclusiveEqualInvalid: {
        it: (input) => `is invalid when exclusive and input length equals maxLength for input: '${input}' and maxLength = 3`,
        inputs: ["abc", [1, 2, 3]],
        validator: new MaxLengthValidator().maxLength(3, false),
        expectation: (response: any) => expect(response).not.toBeNull()
      },
      exclusiveShorterValid: {
        it: (input) => `is valid when exclusive and input length is less than maxLength for input: '${input}' and maxLength = 5`,
        inputs: ["abcd", [1, 2, 3, 4]],
        validator: new MaxLengthValidator().maxLength(5, false),
        expectation: (response: any) => expect(response).toBeNull()
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

})

