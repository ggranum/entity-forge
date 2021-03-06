import {BaseGen} from "./base-gen";
import {NumberRestrictions, NumberRestrictionsFluent} from "../validator/number-validator";


export class NumberGen extends BaseGen implements NumberRestrictionsFluent {

  restrictions: NumberRestrictions

  constructor() {
    super()
  }

  getDefaults():NumberRestrictions {
    return {
      isNumber: true,
      isInt: false,
      min: {
        value: Number.MIN_VALUE,
        inclusive: false
      },
      max: {
        value: Number.MAX_VALUE,
        inclusive: false
      },
    }
  }

  isInt(value?:boolean): this {
    this.restrictions.isInt = value !== false
    return this
  }

  isNumber(value?:boolean): this {
    this.restrictions.isNumber = value !== false
    return this
  }

  min(value: number, inclusive?: boolean): this {
    this.restrictions.min = {value: value, inclusive: inclusive !== false}
    return this
  }

  max(value:number, inclusive?: boolean): this {
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

  doGen(R: NumberRestrictions): number {
    let data: number
    let max = R.max.value
    let min = R.min.value
    let delta: number
    if (R.isInt) {
      data = NumberGen.nextInt(
        min > Number.MIN_SAFE_INTEGER ? min : Number.MAX_SAFE_INTEGER,
        max < Number.MAX_SAFE_INTEGER ? max : Number.MAX_SAFE_INTEGER,
        R.min.inclusive,
        R.max.inclusive
      )
    } else {
      delta = Number.EPSILON
      max = R.max.inclusive ? max : max - delta
      min = R.min.inclusive ? min : min + delta
      data = Math.random() * (max - min) + min;
    }
    return data
  }

  static nextInt(min:number, max:number, minInclusive?:boolean, maxInclusive?:boolean):number {
    minInclusive = minInclusive !== false // default to true
    minInclusive = minInclusive === true // default to false
    min = minInclusive ? min : min + 1
    max = maxInclusive ? max : max - 1
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
