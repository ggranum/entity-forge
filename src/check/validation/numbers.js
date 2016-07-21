"use strict"

let NumberRestrictions = Object.assign({
  isNumber: true,
  integral: false,
  min: Number.MIN_VALUE,
  max: Number.MAX_VALUE,
}, BaseRestrictions)

Object.freeze(NumberRestrictions)


class IsNumberValidator extends Validator {
  check(value) {
    return (typeof value === 'number' || value instanceof Number)
  }
}
Object.assign(IsNumberValidator.prototype, {
  ordinal: 10,
  name: 'number',
  message: '@restriction.number'
})


class IsIntValidator extends Validator {
  check(value) {
    return (value % 1 === 0)
  }
}
Object.assign(IsIntValidator.prototype, {
  ordinal: 100,
  name: 'int',
  message: '@restriction.int'
})

class MaxValidator extends Validator {
  constructor(max = Number.MAX_VALUE, inclusive = false) {
    super({max: max, inclusive: inclusive})

  }

  check(value) {
    return this.args.inclusive ? value <= this.args.max : value < this.args.max
  }
}
Object.assign(MaxValidator.prototype, {
  ordinal: 100,
  name: 'max',
  args: {
    max: Number.MAX_SAFE_INTEGER,
    inclusive: false
  },
  message: '@restriction.max'
})


class MinValidator extends Validator {
  constructor(min = Number.MIN_VALUE, inclusive = true) {
    super({min: min, inclusive: inclusive})
  }

  check(value) {
    return this.args.inclusive ? value >= this.args.min : value > this.args.min
  }
}
Object.assign(MinValidator.prototype, {
  ordinal: 100,
  name: 'min',
  args: {
    min: Number.MIN_VALUE,
    inclusive: true
  },
  message: '@restriction.min'
})



