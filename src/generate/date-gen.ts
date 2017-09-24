import {BaseGen} from "./base-gen";
import {NumberGen} from "./number-gen";
import {DateRestrictions, DateRestrictionsFluent} from "../validator/date/date-validator";


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

  doGen(R?: Partial<DateRestrictions>): number {
    let data: number
    const defaults = this.getDefaults();
    R = R || defaults;

    let max = R.before ? R.before.value : defaults.before.value;
    let min = R.after ? R.after.value : defaults.after.value;
    data = NumberGen.nextInt(
      min > Number.MIN_SAFE_INTEGER ? min : Number.MAX_SAFE_INTEGER,
      max < Number.MAX_SAFE_INTEGER ? max : Number.MAX_SAFE_INTEGER,
      R.after ? R.after.inclusive : defaults.after.inclusive,
      R.before ? R.before.inclusive : defaults.before.inclusive
    )
    return data
  }
}
