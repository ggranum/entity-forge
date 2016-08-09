import {ValidatorErrorInfo, ValidatorErrorsIF, Validator, ValidatorIF} from "../validator";
import {Restriction, NotNullValidator} from "../base-validator";
export interface IsStringRestriction extends Restriction {
  isString?: boolean
}

export interface IsStringRestrictionFluent {
  isString(value: boolean): this
}

export class IsStringValidator extends Validator implements IsStringRestrictionFluent {

  static key = 'isString'
  static message = '@restriction.isString'

  restrictions: IsStringRestriction

  constructor() {
    super()
  }

  getPreconditions():ValidatorIF[]{
    return [NotNullValidator.instance()]
  }

  isString(value: boolean): this {
    this.restrictions.isString = value !== false
    return this
  }

  doValidate(value: any, R: IsStringRestriction): ValidatorErrorsIF {
    let isValid = R.isString ? (typeof value === 'string' || value instanceof String) : true
    return isValid
      ? null
      : new ValidatorErrorInfo(IsStringValidator.key, IsStringValidator.message, R, value).toComposite()
  }
}