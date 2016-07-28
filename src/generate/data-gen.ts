import {CommonRestrictionDefaults} from "../validator/restriction/restriction";

export class DataGen {
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


  gen() {
    let data:any
    if (!this.restrictions.notNull && Math.random() < this._nullChance) {
      data = null
    }
    return data
  }
}




