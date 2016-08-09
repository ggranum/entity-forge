import {Validator, ValidatorErrorsIF, ValidatorErrorInfo} from "./validator";
import {Restriction} from "./base-validator";


export interface IsArrayRestriction extends Restriction {
  isArray?: boolean
}

export interface IsArrayRestrictionFluent {
  isArray(value: boolean): this
}
export class IsArrayValidator extends Validator implements IsArrayRestrictionFluent {

  static message = '@restriction.isArray'

  restrictions: IsArrayRestriction

  constructor() {
    super()
  }

  isArray(value: boolean): this {
    this.restrictions.isArray = value !== false
    return this
  }

  doValidate(value: any, R: IsArrayRestriction): ValidatorErrorsIF {
    let isValid = R.isArray ? (value instanceof Array) : true
    return isValid
      ? null
      : new ValidatorErrorInfo(IsArrayValidator.name, IsArrayValidator.message, R, value).toComposite()
  }
}