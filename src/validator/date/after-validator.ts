import {ValidatorErrorInfo, ValidatorErrorsIF, Validator, ValidatorIF} from "../validator";
import {Restriction} from "../base-validator";
import {IsDateValidator} from "./is-date-validator";



export interface AfterRestriction extends Restriction {
  after: { value: number, inclusive: boolean }
}

export interface AfterRestrictionFluent {
  after(value: Date|number, inclusive?:boolean): this
}

export class AfterValidator extends Validator implements AfterRestrictionFluent  {

  static key = 'after'
  static message = '@restriction.date.after'

  restrictions: AfterRestriction

  constructor() {
    super()
  }

  getPreconditions():ValidatorIF[]{
    return [IsDateValidator.instance()]
  }

  after(value: number|Date, inclusive?:boolean): this {
    let millis:number = value instanceof Date ? (<Date>value).valueOf() : value
    this.restrictions.after = { value: millis, inclusive:inclusive !== false }
    return this
  }

  doValidate(value: any, R: AfterRestriction): ValidatorErrorsIF | null {
    let isValid = true
    if(R.after ){
      let millis = value instanceof Date ? (<Date>value).valueOf() : value
      isValid = R.after.inclusive ? millis >= R.after.value : millis > R.after.value
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(AfterValidator.key, AfterValidator.message, R, value).toComposite()
  }
}