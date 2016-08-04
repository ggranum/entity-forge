import {FluentCommonRestrictions} from "validator/index";
import {ValidatorIF} from "../validator/validator";

/**
 * Data generation avoid using the term 'generator' to avoid confusion with es2015 generators. Which we will hopefully
 * enable one day. But not yet.
 */

/**
 *
 */
export interface DataGenerator {
  gen():any
  reset():any
  /**
   * Provide a clean, mutable instance of the default options for this type, or an empty object if all defaults are
   * null. The provided object will be used directly as the restrictions for this object.
   */
  getDefaults():any
  applyRestrictions(config:any):this
  validatedBy(validator:ValidatorIF):this
}

export class DataGen implements FluentCommonRestrictions, DataGenerator {

  private _nullChance:number = 1 / 1000
  _validator:ValidatorIF

  restrictions:any

  constructor() {
    this.restrictions = Object.assign(this.getDefaults())
  }

  reset(){}

  applyRestrictions(config:any):this{
    this.restrictions = Object.assign(this.getDefaults(), config)
    return this
  }

  validatedBy(validator: ValidatorIF): this {
    this._validator = validator
    return this
  }

  getDefaults(): any {
    return {
      isFunction: false,
      isObject: false,
      notNull: false,
      isOneOf: null
    };
  }

  nullChance(probabilityOfNull = 1 / 1000):this {
    this._nullChance = probabilityOfNull
    return this
  }

  isFunction(): this {
    this.restrictions.isFunction = true
    return this
  }

  isObject(): this {
    this.restrictions.isObject = true
    return this
  }

  isBoolean(): this {
    this.restrictions.isBoolean = true
    return this
  }

  notNull(): this {
    this.restrictions.notNull = true
    return this
  }

  isOneOf(values: any[]): this {
    this.restrictions.isOneOf = values
    return this
  }

  isNoneOf(values: any[]): this {
    this.restrictions.isNoneOf = values
    return this
  }

  gen():any {
    let data:any
    if (this._provideNull()) {
      data = null
    }
    return data
  }

  _provideNull():boolean {
    return !this.restrictions.notNull && Math.random() < this._nullChance
  }
}




