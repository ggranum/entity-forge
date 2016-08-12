import {Validator, ValidatorErrorsIF, ValidatorErrorInfo, ValidatorIF} from "./validator";
import {Restriction, NotNullValidator} from "./base-validator";


export interface LengthRangeRestriction extends MinLengthRestriction, MaxLengthRestriction {
}
export interface LengthRangeRestrictionFluent extends MinLengthRestrictionFluent, MaxLengthRestrictionFluent {
}

export interface RangeLimitRestriction extends Restriction {
  value: number,
  inclusive?: boolean
}

export interface MinLengthRestriction extends Restriction {
  minLength: RangeLimitRestriction
}
export interface MinLengthRestrictionFluent extends Restriction {
  minLength(value: number, inclusive?: boolean): this
}

export class MinLengthValidator extends Validator implements MinLengthRestrictionFluent {

  static key = 'minLength'
  static message = '@restriction.minLength'
  static INSTANCE = new MinLengthValidator()
  restrictions: MinLengthRestriction

  constructor(minLength?: number, inclusive?: boolean) {
    super({minLength: {value: minLength || 0, inclusive: inclusive !== false}})
  }

  getPreconditions():ValidatorIF[]{
    return [NotNullValidator.instance()]
  }

  minLength(value: number, inclusive?: boolean): this {
    this.restrictions.minLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  doValidate(value: any, R: MinLengthRestriction): ValidatorErrorsIF {
    let isValid = true
    if (R.minLength) {
      isValid = R.minLength.inclusive ? value.length >= R.minLength.value : value.length > R.minLength.value
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(MinLengthValidator.key, MinLengthValidator.message, R, value).toComposite()
  }
}


export interface MaxLengthRestriction extends Restriction {
  maxLength: RangeLimitRestriction
}

export interface MaxLengthRestrictionFluent extends Restriction {
  maxLength(value: number, inclusive?: boolean): this
}

export class MaxLengthValidator extends Validator implements MaxLengthRestrictionFluent {

  static key = 'maxLength'
  static message = '@restriction.maxLength'

  restrictions: MaxLengthRestriction

  constructor(maxLength?: number, inclusive: boolean = true) {
    super({maxLength: {value: maxLength || 255, inclusive: inclusive !== false}})
  }

  getPreconditions():ValidatorIF[]{
    return [NotNullValidator.instance()]
  }

  maxLength(value: number, inclusive?: boolean): this {
    this.restrictions.maxLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  doValidate(value: any, R: MaxLengthRestriction) {
    let isValid = true
    if (R.maxLength) {
      isValid = R.maxLength.inclusive ? value.length <= R.maxLength.value : value.length < R.maxLength.value
    }
    return isValid
      ? null
      : new ValidatorErrorInfo(MaxLengthValidator.key, MaxLengthValidator.message, R, value).toComposite()
  }
}


export interface IsObjectRestriction extends Restriction {
  isObject?: boolean
}

export interface IsObjectRestrictionFluent {
  isObject(value: boolean): this
}
export class IsObjectValidator extends Validator implements IsObjectRestrictionFluent {

  static key = 'isObject'
  static message = '@restriction.isObject'

  restrictions: IsObjectRestriction

  constructor() {
    super()
  }

  isObject(value: boolean): this {
    this.restrictions.isObject = value !== false
    return this
  }

  doValidate(value: any, R: IsObjectRestriction): ValidatorErrorsIF {
    let isValid = R.isObject ? (typeof value === 'object' || value.constructor === Object) : true
    return isValid
      ? null
      : new ValidatorErrorInfo(IsObjectValidator.key, IsObjectValidator.message, R, value).toComposite()
  }
}


export interface IsFunctionRestriction extends Restriction {
  isFunction?: boolean
}

export interface IsFunctionRestrictionFluent {
  isFunction(value: boolean): this
}
export class IsFunctionValidator extends Validator implements IsFunctionRestrictionFluent {

  static key = 'isFunction'
  static message = '@restriction.isFunction'

  restrictions: IsFunctionRestriction

  constructor() {
    super()
    this.isFunction()
  }

  isFunction(value?: boolean): this {
    this.restrictions.isFunction = value !== false
    return this
  }

  doValidate(value: any, R: IsFunctionRestriction): ValidatorErrorsIF {
    let isValid = R.isFunction ? (typeof value === 'function' || value instanceof Function) : true
    return isValid
      ? null
      : new ValidatorErrorInfo(IsFunctionValidator.key, IsFunctionValidator.message, R, value).toComposite()
  }
}


export interface IsBooleanRestriction extends Restriction {
  isBoolean?: boolean
}

export interface IsBooleanRestrictionFluent {
  isBoolean(value: boolean): this
}
export class IsBooleanValidator extends Validator implements IsBooleanRestrictionFluent {

  static key = 'isBoolean'
  static message = '@restriction.isBoolean'

  restrictions: IsBooleanRestriction

  constructor() {
    super()
  }

  isBoolean(value: boolean): this {
    this.restrictions.isBoolean = value !== false
    return this
  }

  doValidate(value: any, R: IsBooleanRestriction): ValidatorErrorsIF {
    let isValid = R.isBoolean ? (value === true || value === false) : true
    return isValid
      ? null
      : new ValidatorErrorInfo(IsBooleanValidator.key, IsBooleanValidator.message, R, value).toComposite()
  }
}


export interface CommonRestrictions extends IsFunctionRestriction,
  IsObjectRestriction,
  IsBooleanRestriction {
}

export interface CommonRestrictionsFluent extends IsFunctionRestrictionFluent,
  IsObjectRestrictionFluent,
  IsBooleanRestrictionFluent {
}




