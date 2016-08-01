import {DataGen} from "./data-gen";
import {FluentNumberRestrictions, NumberRestrictions, NumberRestrictionDefaults} from "validator/index";


export class NumberGen extends DataGen implements FluentNumberRestrictions {

  restrictions: NumberRestrictions

  constructor(cfg:any = null) {
    super(cfg, NumberRestrictionDefaults)
  }

  isInt(): this {
    this.restrictions.integral = true
    return this
  }

  isNumber(): this {
    this.restrictions.numeric = true
    return this
  }

  min(value: number, inclusive?: boolean): this {
    this.restrictions.min = {value: value, inclusive: inclusive !== false}
    return this
  }

  max(value: number, inclusive?: boolean): this {
    this.restrictions.max = {value: value, inclusive: inclusive !== false}
    return this
  }

  positive(): this {
    this.restrictions.min.value = 0
    return this
  }

  negative(): this {
    this.restrictions.max.value = 0
    return this
  }

  gen(): number {
    let data = super.gen()
    if (data !== null) {
      data = NumberGen._doGen(this.restrictions)
    }
    return data
  }

  static _doGen(restrictions: NumberRestrictions): number {
    let data: number
    let max = restrictions.max.value
    let min = restrictions.min.value
    let delta: number
    if (restrictions.integral) {
      delta = 1
      max = max < Number.MAX_SAFE_INTEGER ? max : Number.MAX_SAFE_INTEGER
      min = min > Number.MIN_SAFE_INTEGER ? min : Number.MAX_SAFE_INTEGER
      max = restrictions.max.inclusive ? max : max - delta
      min = restrictions.min.inclusive ? min : min + delta
      data = Math.floor(Math.random() * (max - min + 1)) + min
    } else {
      delta = Number.EPSILON
      max = restrictions.max.inclusive ? max : max - delta
      min = restrictions.min.inclusive ? min : min + delta
      data = Math.random() * (max - min) + min;
    }
    return data
  }
}
