import {Validator, ValidatorError} from "./validator";
import {Restriction} from "./restriction/restriction";
import {CodePointsValidator} from "./string";
import {UNICODE} from "./identifier_constants";
import {Validators} from "./index";

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

export interface IdentifierRestrictionFn {
  isIdentifier(value?: boolean): this
  arrayIndex(value?: boolean): this
  objectKey(value?: boolean): this
  quoted(value?: boolean): this
}


let allReserved = [].concat(RESERVED.KEYWORDS, RESERVED.FUTURE, RESERVED.STRICT_MODE_FUTURE, RESERVED.LITERALS).sort()
let startValidator = new CodePointsValidator(UNICODE.ID_Start)
let continueValidator = new CodePointsValidator(UNICODE.ID_Continue)
export class IsIdentifierValidator extends Validator implements IdentifierRestrictionFn {

  restrictions: IdentifierRestrictions

  ordinal = 10
  name = 'isIdentifier'
  message = '@restriction.identifier'


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

  isValid(value: any): boolean {
    return this.doValidate(value, this.restrictions) === null
  }

  validate(value: any): ValidatorError {
    return this.doValidate(value, this.restrictions)
  }

  doValidate(value: any, restrictions: IdentifierRestrictions): ValidatorError {
    let r: ValidatorError = null
    let msg: string = null
    try {
      let V = IsIdentifierValidator
      if (restrictions.quoted) {
        value = '' + value
      }
      msg = V.isNotNull(value)
      if (restrictions.arrayIndex) {
        msg = msg || V.isValidArrayIndex(value)
      } else {
        msg = V.isString(value)
        msg = msg || V.isAtLeastOneCharLong(value)
        msg = msg || V.startsWithValidCodePoint(value)
        msg = msg || V.containsOnlyValidCodePoints(value)
      }
      if( restrictions.objectKey){
        msg = V.isValidObjectKey(value, msg === null, restrictions.quoted)
      } else {
        msg = msg || V.isNotReserved(value)
      }
    } catch (e) {
      msg = "@identifier.unknownError"
    }

    if (msg != null) {
      r = this.generateError(value, null, msg)
    }
    return r
  }

  private static isNotNull(v: any): string {
    return (v !== null && v !== undefined) ? null : "@identifier.cannotBeNull"
  }

  private static isValidObjectKey(v: any, isValidIdentifier: boolean, quoted: boolean): string {
    let isValid = isValidIdentifier || Validators.isNumber.isValid(v) || ( quoted && Validators.isString.isValid(v) )
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
        debugger
      }
    }
    isValid = isValid && Validators.isInt.isValid(value)
    return isValid ? null : "@identifier.notAnArrayIndex"
  }

  private static startsWithValidCodePoint(value: string) {
    return startValidator.isValid(value[0]) ? null : "@identifier.illegalStartCharacter"
  }

  private static containsOnlyValidCodePoints(value: string) {
    let isValid = true
    if (value.length >= 1) {
      isValid = continueValidator.isValid(value.substring(1))
    }
    return isValid ? null : "@identifier.illegalCharacter"
  }

  private static isNotReserved(value: string) {
    return allReserved.indexOf(value) == -1 ? null : "@identifier.reservedWord"
  }


}






