"use strict"

let BooleanRestrictions = Object.assign({
    isBoolean: true
  },
  BaseRestrictions)

Object.freeze(BooleanRestrictions)

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





