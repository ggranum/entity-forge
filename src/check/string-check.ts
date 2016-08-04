import {Check} from "./check";
import {Validators, MinLengthValidator, MaxLengthValidator, Strings, CodePointsValidator, StringRestrictions, FluentStringRestrictions} from "validator/index";
import {ConfigurationError} from "../forge/configuration-error";
import {AllowedCharactersValidator} from "../validator/string";


export class StringCheck extends Check implements FluentStringRestrictions {

  restrictions: StringRestrictions

  constructor() {
    super()
    this.isString()
  }

  static string():StringCheck {
    return new StringCheck()
  }

  isString(): this {
    this.restrictions.isString = true
    return this._init()
  }

  matchesRegex(value: string|RegExp, negate?: boolean): this {
    let R = this.restrictions
    R.matchesRegex = R.matchesRegex || []
    R.matchesRegex.push({value:value, negate:negate === true})
    return this._init()
  }

  notMatchesRegex(value: string|RegExp, negate?: boolean): this {
    let R = this.restrictions
    R.notMatchesRegex = R.notMatchesRegex || []
    R.notMatchesRegex.push({value:value, negate:negate === true})
    return this._init()
  }

  minLength(value:number, inclusive:boolean = true):this {
    this.restrictions.minLength = {
      value:value,
      inclusive: inclusive !== false
    }
    return this._init()
  }

  maxLength(value:number, inclusive:boolean = true):this {
    this.restrictions.maxLength = {
      value:value,
      inclusive: inclusive !== false
    }
    return this._init()
  }


  allowedChars(values: string[]): this {
    this.restrictions.allowedChars = values
    return this._init()
  }

  allowedCodePoints(values:number[] = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP):this{
    this.restrictions.allowedCodePoints = values
    return this._init()
  }


  _doInit(): this {
    var restrict = this.restrictions;

    if(restrict.isString){
      this.add(Validators.isString, Validators.notNull);
    }

    if(restrict.allowedCodePoints && restrict.allowedChars) {
      throw new ConfigurationError("the alloweCodePoints and allowedChars restrictions cannot be used together.")
    }
    if(restrict.allowedCodePoints) {
      this.add(new CodePointsValidator(restrict.allowedCodePoints), Validators.isString, Validators.notNull)
    }

    if(restrict.allowedChars) {
      this.add(new AllowedCharactersValidator(restrict.allowedChars), Validators.isString, Validators.notNull)
    }

    if(restrict.maxLength){
      this.add(new MaxLengthValidator(restrict.maxLength.value, restrict.maxLength.inclusive), Validators.isString, Validators.notNull)
    }

    if(restrict.minLength){
      this.add(new MinLengthValidator(restrict.minLength.value, restrict.minLength.inclusive), Validators.isString, Validators.notNull)
    }

    if(restrict.matchesRegex){
      console.error("StringCheck", "init", "MatchesRegex is not yet implemented.")
    }


    return this
  }
}


