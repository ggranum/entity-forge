import {Validator} from "./validator";


export class IsNumberValidator extends Validator {
  isValid(value:any):boolean {
    return (typeof value === 'number' || value instanceof Number)
  }
}
Object.assign(IsNumberValidator.prototype, {
  ordinal: 10,
  name: 'number',
  message: '@restriction.number'
})


export class IsIntValidator extends Validator {
  isValid(value:any):boolean {
    return (typeof value === 'number' || value instanceof Number) && (value % 1 === 0)
  }
}
Object.assign(IsIntValidator.prototype, {
  ordinal: 100,
  name: 'int',
  message: '@restriction.int'
})

export class MaxValidator extends Validator {
  constructor(max = Number.MAX_VALUE, inclusive:boolean = false) {
    super({max: max, inclusive: inclusive})
  }

  isValid(value:any):boolean {
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


export class MinValidator extends Validator {
  constructor(min = Number.MIN_VALUE, inclusive:boolean = true) {
    super({min: min, inclusive: inclusive})
  }

  isValid(value:any):boolean {
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



