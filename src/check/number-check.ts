import {Check} from "./check";
import {Validators, MinValidator, MaxValidator} from "../validator/index";
import {
  FluentNumberRestrictions,
  NumberRestrictions,
  RangeLimitRestriction
} from "../validator/restriction/restriction";


export class NumberCheck extends Check implements FluentNumberRestrictions {

  restrictions: NumberRestrictions

  constructor() {
    super()
    this.isNumber()
  }

  static number(): NumberCheck {
    return new NumberCheck()
  }

  static int(): NumberCheck {
    let v = new NumberCheck()
    return v.isInt()
  }

  isNumber(): this {
    this.restrictions.numeric = true
    return this._init()
  }

  isInt(): this {
    this.restrictions.integral = true
    return this._init()
  }

  min(value: number, inclusive?: boolean): this {
    this.restrictions.min = {value: value, inclusive: inclusive !== false}
    return this._init()
  }

  max(value: number, inclusive?: boolean): this {
    this.restrictions.max = {value: value, inclusive: inclusive !== false}
    return this._init()
  }

  _doInit() {
    if (this.restrictions.integral) {
      this.add(Validators.isInt, Validators.notNull)
    } else {
      this.add(Validators.isNumber, Validators.notNull)
    }
    if (this.restrictions.min) {
      this.add(new MinValidator(this.restrictions.min.value, this.restrictions.min.inclusive), Validators.isNumber, Validators.notNull)
    }
    if (this.restrictions.max) {
      this.add(new MaxValidator(this.restrictions.max.value, this.restrictions.max.inclusive), Validators.isNumber, Validators.notNull)
    }
  }


}





