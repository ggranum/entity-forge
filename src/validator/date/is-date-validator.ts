import {ValidatorErrorInfo, ValidatorErrorsIF, Validator, ValidatorIF} from "../validator";
import {Restriction, NotNullValidator} from "../base-validator";
import {IsIntValidator} from "../number-validator";
export interface IsDateRestriction extends Restriction {
  isDate?: boolean
}

export interface IsDateRestrictionFluent {
  isDate(value: boolean): this
}

export class IsDateValidator extends Validator implements IsDateRestrictionFluent {

  static key = 'isDate'
  static message = '@restriction.date.isDate'

  restrictions: IsDateRestriction

  constructor() {
    super()
  }

  getPreconditions():ValidatorIF[]{
    return [NotNullValidator.instance()]
  }

  isDate(value: boolean): this {
    this.restrictions.isDate = value !== false
    return this
  }

  doValidate(value: any, R: IsDateRestriction): ValidatorErrorsIF {
    let isValid = true
    if(R.isDate ){
      isValid = value instanceof Date || IsIntValidator.instance().isValid(value, true)
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(IsDateValidator.key, IsDateValidator.message, R, value).toComposite()
  }
}