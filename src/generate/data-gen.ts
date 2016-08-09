import {ValidatorIF, Restriction} from "validator/index";

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

export class DataGen implements DataGenerator {

  private _nullChance:number = 1 / 1000

  validator:ValidatorIF
  restrictions:any

  constructor() {
    this.restrictions = this.getDefaults()
  }

  reset(){}

  applyRestrictions(config:any):this{
    this.restrictions = Object.assign({}, this.getDefaults(), this.restrictions,  config)
    return this
  }

  validatedBy(validator: ValidatorIF): this {
    this.validator = validator
    return this
  }

  getDefaults(): Restriction {
    return { }
  }

  nullChance(probabilityOfNull = 1 / 1000):this {
    this._nullChance = probabilityOfNull
    return this
  }

  gen():any {
    let data:any
    if (this.provideNull()) {
      data = null
    }
    return data
  }

  provideNull():boolean {
    return !this.restrictions.notNull && Math.random() < this._nullChance
  }
}




