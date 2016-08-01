import {Validator} from "./validator";

class IsArrayValidator extends Validator {
  isValid(value:any) {
    return (value instanceof Array)
  }
}
Object.assign(IsArrayValidator.prototype, {
  ordinal: 10,
  name: 'isArray',
  message: '@restriction.array'
})


class MaxSizeValidator extends Validator {
  constructor(maxLength:number, inclusive:boolean = true) {
    super({maxLength: maxLength, inclusive: inclusive})
  }

  isValid(value:any) {
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
  constructor(minLength:number, inclusive:boolean = true) {
    super({minLength: minLength, inclusive: inclusive})
  }

  isValid(value:any) {
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


export {IsArrayValidator,MaxSizeValidator,MinSizeValidator}