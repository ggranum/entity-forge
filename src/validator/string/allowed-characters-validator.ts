import {ValidatorErrorInfo, ValidatorErrorsIF, Validator, ValidatorIF} from "../validator";
import {IsStringValidator} from "./is-string-validator";
export interface AllowedCharactersRestriction {
  allowedChars: string[]
}

export interface AllowedCharactersRestrictionFluent {
  allowedChars(value: string[]): this
}

export class AllowedCharactersValidator extends Validator implements AllowedCharactersRestrictionFluent {

  static key = 'allowedChars'
  static message = '@restriction.allowedChars'


  restrictions: AllowedCharactersRestriction

  constructor(allowedChars: string[]) {
    super({allowedChars: allowedChars})
  }

  getPreconditions():ValidatorIF[]{
    return [IsStringValidator.instance()]
  }

  allowedChars(value: string[]): this {
    this.restrictions.allowedChars = value
    return this
  }

  doValidate(value: any, R: AllowedCharactersRestriction): ValidatorErrorsIF {
    let isValid = true
    if (R.allowedChars) {
      let L = value.length
      for (let i = 0; i < L; i++) {
        isValid = AllowedCharactersValidator.isCharInRange(value.charAt(i), R.allowedChars)
        if (!isValid) {
          break
        }
      }
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(AllowedCharactersValidator.key, AllowedCharactersValidator.message, R, value).toComposite()
  }

  static isCharInRange(char: string, allowed: string[]) {
    return allowed.indexOf(char) >= 0
  }
}