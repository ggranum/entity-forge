import {
  Restriction,
  Validators,
  Validator,
  ValidatorErrorsIF,
  ValidatorErrorInfo,
  AllowedCodePointsValidator,
  Strings
} from "validator/index";
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


export interface IdentifierRestrictions extends Restriction {
  isIdentifier?: boolean
  arrayIndex?: boolean
  objectKey?: boolean
  quoted?: boolean,
}

export interface IdentifierValidatorFluent {
  isIdentifier(value?: boolean): this
  arrayIndex(value?: boolean): this
  objectKey(value?: boolean): this
  quoted(value?: boolean): this
}

let allReserved = [].concat(RESERVED.KEYWORDS, RESERVED.FUTURE, RESERVED.STRICT_MODE_FUTURE, RESERVED.LITERALS).sort()
let startValidator = new AllowedCodePointsValidator(UNICODE.ID_Start)
let continueValidator = new AllowedCodePointsValidator(UNICODE.ID_Continue)

export class IsIdentifierValidator extends Validator implements IdentifierValidatorFluent {

  restrictions: IdentifierRestrictions

  static key = 'isIdentifier'
  static message = '@restriction.identifier'


  constructor() {
    super()
    this.isIdentifier()
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

  doValidate(value: any, restrictions: IdentifierRestrictions): ValidatorErrorsIF {
    let r: ValidatorErrorsIF = null
    let msg: string = null
    try {
      let V = IsIdentifierValidator
      if (restrictions.quoted) {
        value = '' + value
      }
      msg = V.isNotNull(value)
      if (!msg && restrictions.arrayIndex) {
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
      }
      if (restrictions.objectKey) {
        msg = V.isValidObjectKey(value, msg === null, restrictions.quoted)
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
      r = new ValidatorErrorInfo(IsIdentifierValidator.key, msg, restrictions, value).toComposite()
    }
    return r
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
    return isValid === null ? null : isValid[continueValidator.constructor['key']].message
  }

  private static isNotReserved(value: string) {
    return allReserved.indexOf(value) == -1 ? null : "@identifier.reservedWord"
  }

}






