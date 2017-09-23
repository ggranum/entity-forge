import {DateRestrictionsFluent, DateRestrictions} from "@entity-forge/validator";
import {BaseGen} from "./base-gen";
import {NumberGen} from "./number-gen";


export class DateGen extends BaseGen implements DateRestrictionsFluent {

  restrictions: DateRestrictions

  constructor() {
    super()
  }

  getDefaults(): DateRestrictions {
    return {
      isDate: true,
      before: {
        value: Number.MAX_SAFE_INTEGER,
        inclusive: false
      },
      after: {
        value: Number.MIN_SAFE_INTEGER,
        inclusive: false
      },
    }
  }

  isDate(value?: boolean): this {
    this.restrictions.isDate = value !== false
    return this
  }


  before(value: number|Date, inclusive?: boolean): this {
    let millis: number = value instanceof Date ? (<Date>value).valueOf() : value
    this.restrictions.before = {value: millis, inclusive: inclusive !== false}
    return this
  }

  after(value: number|Date, inclusive?: boolean): this {
    let millis: number = value instanceof Date ? (<Date>value).valueOf() : value
    this.restrictions.after = {value: millis, inclusive: inclusive !== false}
    return this
  }

  doGen(R: DateRestrictions): number {
    let data: number
    let max = R.before.value
    let min = R.after.value
    data = NumberGen.nextInt(
      min > Number.MIN_SAFE_INTEGER ? min : Number.MAX_SAFE_INTEGER,
      max < Number.MAX_SAFE_INTEGER ? max : Number.MAX_SAFE_INTEGER,
      R.after.inclusive,
      R.before.inclusive
    )
    return data
  }
}
