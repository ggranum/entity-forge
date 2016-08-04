import {Validator, ValidatorIF, ValidatorError} from "./validator";
import {
  FluentNumberRestrictions, MinRestrictionFn, RangeLimitRestriction,
  MinRestriction
} from "./restriction/restriction";


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
    return this.restrictions.inclusive ? value <= this.restrictions.max : value < this.restrictions.max
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



export class MinValidator extends Validator implements MinRestrictionFn {

  name ='min'
  ordinal = 100
  message ='@restriction.min'

  constructor(value?: RangeLimitRestriction) {
    super()
    this.min(value)
  }

  min(value: RangeLimitRestriction): this {
    this.restrictions.min = Object.assign({}, this.restrictions.min, value)
    return this
  }

  isValid(value:any){
    return this.doValidate(value, this.restrictions) !== null
  }

  validate(value:any):ValidatorError {
    return this.doValidate(value, this.restrictions)
  }

  doValidate(value:any, restrictions:MinRestriction):ValidatorError {
    let isValid = restrictions.min.inclusive ? value >= restrictions.min.value : value > restrictions.min.value
    return isValid ? null : this.generateError(value, null)
  }
}


