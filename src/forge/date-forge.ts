import {BaseForge} from "./base-forge";
import {DateGen} from "../generate/date-gen";
import {DateRestrictions, DateRestrictionsFluent, DateValidator} from "../validator/date/date-validator";

export class DateForge extends BaseForge implements DateRestrictionsFluent{

  restrictions: DateRestrictions

  constructor() {
    super()
    this.validatedBy(DateValidator.instance())
  }

  static date(defaultValue?:number) {
    return new DateForge().initTo(defaultValue === undefined ? null : defaultValue)
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
}


DateForge.generatedByType(DateGen)
