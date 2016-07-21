"use strict"


class IsArrayValidator extends Validator {
  check(value) {
    return (value instanceof Array)
  }
}
Object.assign(IsArrayValidator.prototype, {
  ordinal: 10,
  name: 'isArray',
  message: '@restriction.array'
})


class MaxSizeValidator extends Validator {
  constructor(maxLength, inclusive = true) {
    super({maxLength: maxLength, inclusive: inclusive})
  }

  check(value) {
    return this.args.inclusive ? value.length <= this.args.maxLength : value.length < this.args.maxLength
  }
}
Object.assign(MaxSizeValidator.prototype, {
  ordinal: 100,
  name: 'maxSize',
  args: {
    maxLength: Number.MAX_SAFE_INTEGER,
    inclusive: true
  },
  message: '@restriction.array.maxSize'
})


class MinSizeValidator extends Validator {
  constructor(minLength, inclusive = true) {
    super({minLength: minLength, inclusive: inclusive})
  }

  check(value) {
    return this.args.inclusive ? value.length >= this.args.minLength : value.length > this.args.minLength
  }
}
Object.assign(MinSizeValidator.prototype, {
  ordinal: 100,
  name: 'minSize',
  args: {
    minLength: 0,
    inclusive: true
  },
  message: '@restriction.array.minSize'
})
