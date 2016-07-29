import {CommonRestrictionDefaults, FluentCommonRestrictions} from "../validator/restriction/restriction";

export class DataGen implements FluentCommonRestrictions {


  restrictions:any = CommonRestrictionDefaults
  private _nullChance:number = 1 / 1000


  constructor(cfg:any = null, restrictions:any = null) {
    this.restrictions = Object.assign({}, restrictions || CommonRestrictionDefaults)
    Object.assign(this.restrictions, cfg)
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

  gen() {
    let data:any
    if (!this.restrictions.notNull && Math.random() < this._nullChance) {
      data = null
    }
    return data
  }
}




