import {DateValidator, DateRestrictionsFluent, DateRestrictions} from "validator/index";
import {BaseForge} from "./base-forge";

export class DateForge extends BaseForge implements DateRestrictionsFluent{

  restrictions: DateRestrictions

  constructor() {
    super()
    this.validatedBy(DateValidator.instance())
  }

  static date(defaultValue?:number) {
    return new DateForge().initTo(defaultValue)
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

import {DateGen} from "generate/index";
DateForge.generatedByType(DateGen)
