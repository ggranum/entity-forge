import {Validator, ValidatorErrorsIF, ValidatorErrorInfo, ValidatorIF, CompositeValidator} from "./validator";
import {Restriction, NotNullValidator, NotNullRestriction, NotNullRestrictionFluent} from "./base-validator";
import {RangeLimitRestriction} from "./common-validator";


export interface IsNumberRestriction extends Restriction {
  isNumber?: boolean
}

export interface IsNumberRestrictionFluent {
  isNumber(value: boolean): this
}
export class IsNumberValidator extends Validator implements IsNumberRestrictionFluent {

  static key = "isNumber"
  static message = '@restriction.isNumber'

  restrictions: IsNumberRestriction


  constructor() {
    super()
    this.isNumber()
  }

  getPreconditions(): ValidatorIF[] {
    return [NotNullValidator.instance()]
  }

  isNumber(value?: boolean): this {
    this.restrictions.isNumber = value !== false
    return this
  }

  doValidate(value: any, R: IsNumberRestriction): ValidatorErrorsIF | null {
    let isValid = true
    if (R.isNumber) {
      let isNumeric = (typeof value === 'number' || value instanceof Number)
      isValid = isNumeric && !Number.isNaN(value)
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(IsNumberValidator.key, IsNumberValidator.message, R, value).toComposite()
  }
}


export interface IsIntRestriction extends Restriction {
  isInt?: boolean
}

export interface IsIntRestrictionFluent {
  isInt(value: boolean): this
}
export class IsIntValidator extends Validator implements IsIntRestrictionFluent {


  static key = 'isInt'
  static message = '@restriction.isInt'


  restrictions: IsIntRestriction

  constructor() {
    super()
    this.isInt()
  }

  isInt(value?: boolean): this {
    this.restrictions.isInt = value !== false
    return this
  }

  getPreconditions(): ValidatorIF[] {
    return [IsNumberValidator.instance()]
  }

  doValidate(value: any, R: IsIntRestriction): ValidatorErrorsIF | null{
    let isValid: boolean = true
    if (R.isInt) {
      let isNumeric:boolean = (typeof value === 'number' || value instanceof Number)
      isValid = isNumeric && (value % 1 === 0)
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(IsIntValidator.key, IsIntValidator.message, R, value).toComposite()
  }
}


export interface MaxRestriction extends Restriction {
  max: RangeLimitRestriction
}

export interface MaxRestrictionFluent {
  max(value: number, inclusive: boolean): this
}

export class MaxValidator extends Validator implements MaxRestrictionFluent {

  static key = 'max'
  static message = '@restriction.max'
  restrictions: MaxRestriction

  constructor(value?: RangeLimitRestriction) {
    super()
    if (value) {
      this.max(value.value, value.inclusive)
    }
  }

  getPreconditions(): ValidatorIF[] {
    return [IsNumberValidator.instance()]
  }

  max(value: number, inclusive?: boolean): this {
    this.restrictions.max = {value: value, inclusive: inclusive !== false}
    return this
  }


  doValidate(value: number, R: MaxRestriction): ValidatorErrorsIF | null {
    let isValid: boolean = true
    if (R.max) {
      isValid = R.max.inclusive ? value <= R.max.value : value < R.max.value
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(MaxValidator.key, MaxValidator.message, R, value).toComposite()
  }
}

export interface MinRestriction extends Restriction {
  min: RangeLimitRestriction
}

export interface MinRestrictionFluent {
  min(value: number, inclusive?: boolean): this
}

export class MinValidator extends Validator implements MinRestrictionFluent {

  static key = 'min'
  static message = '@restriction.min'

  restrictions: MinRestriction

  constructor(value?: RangeLimitRestriction) {
    super()
    if (value) {
      this.min(value.value, value.inclusive)
    }
  }

  getPreconditions(): ValidatorIF[] {
    return [IsNumberValidator.instance()]
  }

  min(value: number, inclusive?: boolean): this {
    this.restrictions.min = {value: value, inclusive: inclusive !== false}
    return this
  }

  doValidate(value: number, R: MinRestriction): ValidatorErrorsIF | null {
    let isValid: boolean = true
    if (R.min) {
      isValid = R.min.inclusive ? value >= R.min.value : value > R.min.value
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(MinValidator.key, MinValidator.message, R, value).toComposite()
  }
}


export interface NumberRestrictions extends NotNullRestriction,
  IsNumberRestriction,
  IsIntRestriction,
  MinRestriction,
  MaxRestriction {
}
export interface NumberRestrictionsFluent extends NotNullRestrictionFluent,
  IsNumberRestrictionFluent,
  IsIntRestrictionFluent,
  MinRestrictionFluent,
  MaxRestrictionFluent {
}

export class NumberValidator extends CompositeValidator implements NumberRestrictionsFluent {

  restrictions: NumberRestrictions

  constructor() {
    super()
    this.isNumber()
  }

  static number(): NumberValidator {
    return new NumberValidator()
  }

  static int(): NumberValidator {
    let v = new NumberValidator()
    return v.isInt()
  }

  notNull(value?: boolean): this {
    this.restrictions.notNull = value !== false
    return this
  }

  isNumber(): this {
    this.restrictions.isNumber = true
    return this
  }

  isInt(): this {
    this.restrictions.isInt = true
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

  doValidate(value: any, R: NumberRestrictions): ValidatorErrorsIF | null{
    let chain = [
      NotNullValidator.instance(),
      IsNumberValidator.instance(),
      IsIntValidator.instance(),
      MinValidator.instance(),
      MaxValidator.instance()
    ]
    return super.doValidateComposite(value, R, chain)
  }
}





