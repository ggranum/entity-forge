import {Validator, ValidatorErrorsIF, ValidatorErrorInfo, CompositeValidator, ValidatorIF} from "./validator";

export interface Restriction {
}


export interface NotNullRestriction extends Restriction {
  notNull?: boolean
}

export interface NotNullRestrictionFluent {
  notNull(value?: boolean): this
}

export class NotNullValidator extends Validator implements NotNullRestrictionFluent {


  static key = 'notNull'
  static message = '@restriction.notNull'
  restrictions: NotNullRestriction

  constructor() {
    super();
    this.notNull()
  }

  notNull(value?: boolean): this {
    this.restrictions.notNull = value !== false
    return this
  }

  doValidate(value: any, R: NotNullRestriction): ValidatorErrorsIF {
    let isValid = R.notNull ? !(value === null || value === undefined) : true
    return isValid
      ? null
      : new ValidatorErrorInfo(NotNullValidator.key, NotNullValidator.message, R, value).toComposite()
  }
}


export interface IsOneOfRestriction extends Restriction {
  isOneOf?: any[]
}

export interface IsOneOfRestrictionFluent {
  isOneOf(value: any[]): this
}

export class IsOneOfValidator extends Validator implements IsOneOfRestrictionFluent {

  static key = 'isOneOf'
  static message = '@restriction.isOneOf'

  restrictions: IsOneOfRestriction

  constructor() {
    super()
  }

  getPreconditions(): ValidatorIF[] {
    return [NotNullValidator.instance()]
  }

  isOneOf(value: any[]): this {
    this.restrictions.isOneOf = value
    return this
  }

  doValidate(value: any, R?: IsOneOfRestriction): ValidatorErrorsIF {
    let isValid = true
    if (R.isOneOf) {
      isValid = R.isOneOf.some((allowedValue: any)=> {
        return allowedValue === value
      })
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(IsOneOfValidator.key, IsOneOfValidator.message, R, value).toComposite()
  }
}


export interface BaseRestrictions extends NotNullRestriction, IsOneOfRestriction {
}
export interface BaseRestrictionsFluent extends NotNullRestrictionFluent, IsOneOfRestrictionFluent {
}


export class BaseValidator extends CompositeValidator implements NotNullValidator,
  IsOneOfValidator {

  static key = 'base'
  static message = '@restriction.base'

  restrictions: BaseRestrictions

  constructor() {
    super()
  }

  notNull(value?: boolean): this {
    this.restrictions.notNull = value !== false
    return this
  }

  isOneOf(value: any[]): this {
    this.restrictions.isOneOf = value
    return this
  }

  doValidate(value: any, R: BaseRestrictions): ValidatorErrorsIF {
    let chain = [
      NotNullValidator.instance(),
      IsOneOfValidator.instance()
    ]
    return super.doValidateComposite(value, R, chain)
  }
}

