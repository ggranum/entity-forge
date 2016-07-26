import {Validator,} from "../validation/validator";


let ordinalSortFn = (a:Validator, b:Validator) => {
  return a.ordinal - b.ordinal
}


export class Constraint {
  private name: string;
  private primary: Validator;
  private preconditions: Validator[];

  constructor(primaryValidation:Validator, ...preconditions:Validator[]) {
    this.name = primaryValidation.name
    this.primary = primaryValidation
    this.preconditions = []

    preconditions.forEach((p)=> {
      this.preconditions.push(p)
    })
    this.preconditions.sort(ordinalSortFn)
  }

  check(value:any):boolean {
    return this.validate(value) === null
  }

  validate(value:any):any {
    let result:any = null
    let preconditionsPass:boolean = this.preconditions.every((p:Validator)=> {
      return p.check(value)
    })
    if (preconditionsPass) {
      result = this.primary.validate(value)
    }
    // result is null even if preconditionsPass === false.
    // This allows, for example, a string to be either null or have a minLength of 0.
    return result
  }
}
