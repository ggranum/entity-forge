import {BaseRestrictions} from "../base-validator";
import {
  MaxLengthRestriction,
  MaxLengthRestrictionFluent,
  MinLengthRestriction,
  MinLengthRestrictionFluent
} from "../common-validator";
import {Strings, StringValidator, ValidatorErrorInfo, ValidatorErrorsIF, Validators} from "../index";
// noinspection TypeScriptPreferShortImport
import {AllowedCodePointsValidator} from "../string/allowed-codepoints-validator";
import {Validator} from "../validator";
import {UNICODE} from "./identifier_constants";

export const RESERVED = {
  KEYWORDS: [
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "return",
    "static",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
  ],
  FUTURE: ["await", "enum"],
  STRICT_MODE_FUTURE: ["implements", "interface", "package", "private", "protected", "public"],
  LITERALS: ["null", "true", "false"]
}


export interface IdentifierRestrictions extends BaseRestrictions, MinLengthRestriction, MaxLengthRestriction {
  isIdentifier?: boolean
  arrayIndex?: boolean
  objectKey?: boolean
  quoted?: boolean,
}

export interface IdentifierFluent extends MinLengthRestrictionFluent,
  MaxLengthRestrictionFluent {
  isIdentifier(value?: boolean): this

  arrayIndex(value?: boolean): this

  objectKey(value?: boolean): this

  quoted(value?: boolean): this
}

let allReserved = [].concat(RESERVED.KEYWORDS, RESERVED.FUTURE, RESERVED.STRICT_MODE_FUTURE, RESERVED.LITERALS).sort()
let startValidator = new AllowedCodePointsValidator(UNICODE.ID_Start)
let continueValidator = new AllowedCodePointsValidator(UNICODE.ID_Continue)

export class IsIdentifierValidator extends Validator implements IdentifierFluent {


  static key = 'isIdentifier'
  static message = '@restriction.identifier'
  restrictions: IdentifierRestrictions

  constructor() {
    super()
    this.isIdentifier()
  }

  private static isNotNull(v: any): string {
    return (v !== null && v !== undefined) ? null : "@identifier.cannotBeNull"
  }

  private static isValidObjectKey(v: any, isValidIdentifier: boolean, quoted: boolean): string {
    let isValid = isValidIdentifier || Validators.isNumber.isValid(v, true) || ( quoted && Validators.isString.isValid(v, true) )
    return isValid ? null : "@identifier.invalidObjectKey"
  }

  private static isString(value: any): string {
    return Validators.isString.isValid(value) ? null : "@identifier.mustBeString"
  }

  private static isAtLeastOneCharLong(value: any): string {
    return value.length > 0 ? null : "@identifier.mustBeAtLeastOneCharacter"
  }

  private static isValidArrayIndex(value: string | number): string {
    let isValid = true
    if (Validators.isString.isValid(value)) {
      try {
        value = Number.parseInt(<string>value)
      } catch (e) {
        isValid = false
      }
    }
    isValid = isValid && Validators.isInt.isValid(value, true)
    return isValid ? null : "@identifier.notAnArrayIndex"
  }

  private static startsWithValidCodePoint(value: string) {
    return startValidator.isValid(String.fromCodePoint(value.codePointAt(0))) ? null : "@identifier.illegalStartCharacter"
  }

  private static containsOnlyValidCodePoints(value: string) {
    let isValid: any = null
    if (value.length >= 1) {
      let L = Strings.isHighSurrogate(value.charCodeAt(0)) ? 2 : 1
      if (value.length >= L) {
        isValid = continueValidator.validate(value.substring(L))
      }
    }
    return isValid === null ? null : isValid[(<any>continueValidator.constructor)['key']].message
  }

  private static isNotReserved(value: string) {
    return allReserved.indexOf(value) == -1 ? null : "@identifier.reservedWord"
  }

  minLength(value: number, inclusive?: boolean): this {
    this.restrictions.minLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  maxLength(value: number, inclusive?: boolean): this {
    this.restrictions.maxLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  isIdentifier(value?: boolean): this {
    this.restrictions.isIdentifier = value !== false
    return this
  }

  arrayIndex(value?: boolean): this {
    this.restrictions.arrayIndex = value !== false
    return this
  }

  objectKey(value?: boolean): this {
    this.restrictions.objectKey = value !== false
    return this
  }

  quoted(value?: boolean): this {
    this.restrictions.quoted = value !== false
    return this
  }

  doValidate(value: any, R: IdentifierRestrictions): ValidatorErrorsIF {
    let r: ValidatorErrorsIF = null
    let msg: string = null
    try {
      let V = IsIdentifierValidator
      if (R.quoted) {
        value = '' + value
      }
      msg = V.isNotNull(value)
      if (!msg && R.arrayIndex) {
        msg = V.isValidArrayIndex(value)
      } else if (!msg) {
        msg = V.isString(value)
        if (!msg) {
          msg = V.isAtLeastOneCharLong(value)
        }
        if (!msg) {
          msg = V.startsWithValidCodePoint(value)
        }
        if (!msg) {
          msg = V.containsOnlyValidCodePoints(value)
        }
        if (!msg) {
          let strValidate = StringValidator.instance().validate(value, R)
          msg = strValidate !== null ? strValidate.toString() : null
        }
      }
      if (R.objectKey) {
        msg = V.isValidObjectKey(value, msg === null, R.quoted)
      } else {
        if (!msg) {
          msg = V.isNotReserved(value)
        }
      }
    } catch (e) {
      msg = "@identifier.unknownError"
      console.log("IsIdentifierValidator", "doValidate", e)
    }

    if (msg != null) {
      r = new ValidatorErrorInfo(IsIdentifierValidator.key, msg, R, value).toComposite()
    }
    return r
  }

}






