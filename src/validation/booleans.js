"use strict"



class IsBooleanValidator extends Validator {
  check(value) {
    return value === true || value === false
  }
}
Object.assign(IsBooleanValidator.prototype, {
  ordinal: 10,
  name: 'boolean',
  message: '@restriction.boolean'
})





