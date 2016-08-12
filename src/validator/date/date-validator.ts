import {ValidatorErrorsIF, CompositeValidator} from "../validator";
import {NotNullRestriction, NotNullRestrictionFluent, NotNullValidator} from "../base-validator";
import {IsDateRestriction, IsDateRestrictionFluent, IsDateValidator} from "./is-date-validator";
import {BeforeRestriction, BeforeRestrictionFluent, BeforeValidator} from "./before-validator";
import {AfterRestriction, AfterRestrictionFluent, AfterValidator} from "./after-validator";



export interface DateRestrictions extends NotNullRestriction,
  IsDateRestriction,
  BeforeRestriction,
  AfterRestriction
{}

export interface DateRestrictionsFluent extends NotNullRestrictionFluent,
  IsDateRestrictionFluent,
  BeforeRestrictionFluent,
  AfterRestrictionFluent {
}

export class DateValidator extends CompositeValidator implements DateRestrictionsFluent{

  static key = 'date'
  static message = '@restriction.date.date'

  restrictions: DateRestrictions

  constructor() {
    super()
    this.isDate()
  }

  static date(): DateValidator {
    return new DateValidator()
  }

  notNull(value?: boolean): this {
    this.restrictions.notNull = value !== false
    return this
  }

  isDate(value?: boolean): this {
    this.restrictions.isDate = value !== false
    return this
  }


  before(value: number|Date, inclusive?:boolean): this {
    let millis:number = value instanceof Date ? (<Date>value).valueOf() : value
    this.restrictions.before = { value: millis, inclusive:inclusive !== false }
    return this
  }


  after(value: number|Date, inclusive?:boolean): this {
    let millis:number = value instanceof Date ? (<Date>value).valueOf() : value
    this.restrictions.after = { value: millis, inclusive:inclusive !== false }
    return this
  }


  doValidate(value: any, R: DateRestrictions): ValidatorErrorsIF {
    let chain = [
      NotNullValidator.instance(),
      IsDateValidator.instance(),
      BeforeValidator.instance(),
      AfterValidator.instance(),
    ]
    return super.doValidateComposite(value, R, chain)
  }
}


