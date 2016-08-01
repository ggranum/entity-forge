import {Check} from "./check";
import {Validators, MinLengthValidator, MaxLengthValidator, Strings, CodePointsValidator, StringRestrictions, FluentStringRestrictions} from "validator/index";


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
    return this
  }

  matchesRegex(value: string|RegExp, negate?: boolean): this {
    this.restrictions.matchesRegex = {value:value, negate:negate === true}
    return this
  }

  notMatchesRegex(value: string|RegExp): this {
    return this.matchesRegex(value, true)
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

  allowedCodePoints(values:number[] = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP):this{
    this.restrictions.allowedCodePoints = values
    return this
  }


  _doInit(): this {
    var restrict = this.restrictions;

    if(restrict.isString){
      this.add(Validators.isString, Validators.notNull);
    }

    if(restrict.allowedCodePoints) {
      this.add(new CodePointsValidator(restrict.allowedCodePoints), Validators.isString, Validators.notNull)
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


