import {Validator} from "./validator";

export class IsBooleanValidator extends Validator {
  isValid(value:any) {
    return value === true || value === false
  }
}
Object.assign(IsBooleanValidator.prototype, {
  ordinal: 10,
  name: 'boolean',
  message: '@restriction.boolean'
})





