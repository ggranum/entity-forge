"use strict"
import {Check} from "./check";
import {Validators, MinLengthValidator, MaxLengthValidator, Strings, CodePointsValidator} from "../validation/index";


export class StringCheck extends Check {

  static string():StringCheck {
    let v = new StringCheck()
    v.add(Validators.isString, Validators.exists)
    return v
  }

  minLength(min:number, inclusive:boolean = true):StringCheck {
    this.add(new MinLengthValidator(min, inclusive), Validators.isString, Validators.exists)
    return this
  }

  maxLength(max:number, inclusive:boolean = true):StringCheck {
    this.add(new MaxLengthValidator(max, inclusive), Validators.isString, Validators.exists)
    return this
  }

  allowCodePoints(codePointRanges = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP):StringCheck{
    this.add(new CodePointsValidator(codePointRanges))
    return this
  }
}


