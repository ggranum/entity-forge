import {ValidatorIF, Restriction} from "validator/index";

/**
 * Data generation avoid using the term 'generator' to avoid confusion with es2015 generators. Which we will hopefully
 * enable one day. But not yet.
 */

/**
 *
 */
export interface DataGenerator {
  clone():this
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


  static INSTANCE:DataGen
  private _nullChance:number = 1 / 1000

  validator:ValidatorIF
  restrictions:any

  constructor() {
    this.restrictions = this.getDefaults()
  }

  static instance():DataGen{
    // 'this' being the ctor...
    if(!this.INSTANCE || this.INSTANCE.constructor !== this){
      this.INSTANCE = new this()
    }
    return this.INSTANCE
  }

  clone():this{
    let instance = this
    let ctor:any = instance.constructor
    let copy = new ctor()
    copy.validator = instance.validator
    copy._nullChance = instance._nullChance
    copy.restrictions = JSON.parse(JSON.stringify(instance.restrictions))
    return copy
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

  gen(R?:Restriction):any {
    R = R ? R : this.restrictions
    R = Object.assign({}, this.getDefaults(), R)
    let data:any
    if (this.provideNull(R)) {
      data = null
    } else {
      data = this.doGen(R)
    }
    return data
  }

  doGen(R:Restriction):any{
      throw new Error("Override doGen")
  }

  provideNull(R:any):boolean {
    return !R.notNull && Math.random() < this._nullChance
  }
}




