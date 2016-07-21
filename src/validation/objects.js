"use strict"



class ExistsValidator extends Validator {
  check(value) {
    return !(value === null || value === undefined)
  }
}
Object.assign(ExistsValidator.prototype, {
  ordinal: 1,
  name: 'exists',
  message: '@restriction.exists'
})


class IsOneOfValidator extends Validator {
  constructor(values) {
    super({values: values})
  }

  check(value) {
    return this.args.values.some((allowedValue)=> {
      return allowedValue === value
    })
  }
}
Object.assign(IsOneOfValidator.prototype, {
  ordinal: 1,
  name: 'isOneOf',
  message: '@restriction.isOneOf',
  args: {
    values: []
  }
})


class IsObjectValidator extends Validator {
  constructor() {
    super()
  }

  check(value) {
    return (typeof value === 'object' || value.constructor === Object)
  }
}
Object.assign(IsObjectValidator.prototype, {
  ordinal: 10,
  name: 'isObject',
  message: '@restriction.isObject'
})


class IsFunctionValidator extends Validator {
  constructor() {
    super()
  }

  check(value) {
    return (typeof value === 'function' || value instanceof Function)
  }
}
Object.assign(IsFunctionValidator.prototype, {
  ordinal: 10,
  name: 'isFunction',
  message: '@restriction.isFunction'
})
