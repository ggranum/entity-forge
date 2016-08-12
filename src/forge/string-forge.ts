import {Strings, StringValidator, StringRestrictions, StringRestrictionsFluent} from "validator/index";
import {StringGen} from "generate/index";
import {BaseForge} from "./base-forge";

export class StringForge extends BaseForge implements StringRestrictionsFluent{

  restrictions: StringRestrictions

  constructor() {
    super()
    this.validatedBy(StringValidator.instance())
    this.allowedCodePoints(Strings.COMMON_UTF_RANGES.UTF_PLANE_BMP)
  }

  static string(defaultValue: string = null) {
    return new StringForge().initTo(defaultValue)
  }

  notNull(value?:boolean): this {
    if (this.defaultValue == null) {
      this.initTo("")
    }
    super.notNull(value)
    return this
  }

  ascii() {
    this.allowedCodePoints(Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII)
    return this
  }

  isString(value?:boolean): this {
    this.restrictions.isString = value !== false
    return this
  }

  matchesRegex(value: string|RegExp, negate?: boolean): this {
    let R = this.restrictions
    R.matchesRegex = R.matchesRegex || []
    R.matchesRegex.push({value:value, negate:negate === true})
    return this
  }

  notMatchesRegex(value: string|RegExp, negate?: boolean): this {
    let R = this.restrictions
    R.notMatchesRegex = R.notMatchesRegex || []
    R.notMatchesRegex.push({value:value, negate:negate === true})
    return this
  }

  minLength(value:number, inclusive:boolean = true):this {
    this.restrictions.minLength = {
      value:value,
      inclusive: inclusive !== false
    }
    return this
  }

  maxLength(value:number, inclusive:boolean = true):this {
    this.restrictions.maxLength = {
      value:value,
      inclusive: inclusive !== false
    }
    return this
  }


  allowedChars(values: string[]): this {
    this.restrictions.allowedChars = values
    return this
  }

  allowedCodePoints(values:number[] = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP):this{
    this.restrictions.allowedCodePoints = values
    return this
  }
}

StringForge.generatedByType(StringGen)
