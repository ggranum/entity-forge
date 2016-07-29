import {Validator} from "./validator";
export class NotNullValidator extends Validator {
  check(value:any):boolean {
    return !(value === null || value === undefined)
  }
}
Object.assign(NotNullValidator.prototype, {
  ordinal: 1,
  name: 'notNull',
  message: '@restriction.notNull'
})


export class IsOneOfValidator extends Validator {
  constructor(values:any[]) {
    super({values: values})
  }

  check(value:any):boolean {
    return this.args.values.some((allowedValue:any)=> {
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


export class IsObjectValidator extends Validator {
  constructor() {
    super()
  }

  check(value:any):boolean {
    return (typeof value === 'object' || value.constructor === Object)
  }
}
Object.assign(IsObjectValidator.prototype, {
  ordinal: 10,
  name: 'isObject',
  message: '@restriction.isObject'
})


export class IsFunctionValidator extends Validator {
  constructor() {
    super()
  }

  check(value:any):boolean {
    return (typeof value === 'function' || value instanceof Function)
  }
}
Object.assign(IsFunctionValidator.prototype, {
  ordinal: 10,
  name: 'isFunction',
  message: '@restriction.isFunction'
})


