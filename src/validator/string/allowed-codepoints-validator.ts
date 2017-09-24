import {ValidatorErrorInfo, Validator, ValidatorErrorsIF, ValidatorIF} from "../validator";
import {Strings} from "./string-validator";
import {IsStringValidator} from "./is-string-validator";


export interface AllowedCodePointsRestriction {
  allowedCodePoints?: number[]
}

export interface AllowedCodePointsRestrictionFluent {
  allowedCodePoints(value: number[]): this
}

export class AllowedCodePointsValidator extends Validator implements AllowedCodePointsRestrictionFluent {

  static key = 'allowedCodePoints'
  static message = '@restriction.allowedCodePoints'
  restrictions: AllowedCodePointsRestriction

  constructor(allowedCodePoints = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP) {
    super({allowedCodePoints: allowedCodePoints})
  }

  getPreconditions(): ValidatorIF[] {
    return [IsStringValidator.instance()]
  }

  allowedCodePoints(value: number[]): this {
    this.restrictions.allowedCodePoints = value
    return this
  }

  doValidate(value: any, R: AllowedCodePointsRestriction): ValidatorErrorsIF | null {
    let isValid = true
    let msg:string = ''
    if (R.allowedCodePoints) {
      let L = value.length
      for (let i = 0; i < L; i++) {
        let cp = value.codePointAt(i)
        let charCode = value.charCodeAt(i)
        if (charCode >= 0xD800 && charCode <= 0xDBFF && i < L) {
          // it's more than 16 bit (length of char is 2)
          i++
        }
        isValid = R.allowedCodePoints.indexOf(cp) >= 0
        if(!isValid){
          msg = AllowedCodePointsValidator.message + `[index:${i}, code point:${value.codePointAt(i)}, char:${value[i]}]`
          break
        }
      }
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(
      AllowedCodePointsValidator.key,
      msg, R, value).toComposite()
  }


}