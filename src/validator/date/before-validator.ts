import {ValidatorErrorInfo, ValidatorErrorsIF, Validator, ValidatorIF} from "../validator";
import {Restriction} from "../base-validator";
import {IsDateValidator} from "./is-date-validator";



export interface BeforeRestriction extends Restriction {
  before: { value: number, inclusive: boolean }
}

export interface BeforeRestrictionFluent {
  before(value: Date|number, inclusive?:boolean): this
}

export class BeforeValidator extends Validator implements BeforeRestrictionFluent  {

  static key = 'before'
  static message = '@restriction.date.before'

  restrictions: BeforeRestriction

  constructor() {
    super()
  }

  getPreconditions():ValidatorIF[]{
    return [IsDateValidator.instance()]
  }

  before(value: number|Date, inclusive?:boolean): this {
    let millis:number = value instanceof Date ? (<Date>value).valueOf() : value
    this.restrictions.before = { value: millis, inclusive:inclusive !== false }
    return this
  }

  doValidate(value: any, R: BeforeRestriction): ValidatorErrorsIF | null {
    let isValid = true
    if(R.before ){
      let millis = value instanceof Date ? (<Date>value).valueOf() : value
      isValid = R.before.inclusive ? millis <= R.before.value : millis < R.before.value
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(BeforeValidator.key, BeforeValidator.message, R, value).toComposite()
  }
}