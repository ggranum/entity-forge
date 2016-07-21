"use strict"

class DataGen {

  constructor(cfg = null, restrictions = null) {
    this.restrictions = Object.assign({}, restrictions || BaseRestrictions)
    Object.assign(this.restrictions, cfg )
  }

  nullChance(probabilityOfNull = 1/1000 ){
    this._nullChance = probabilityOfNull
    return this
  }


  gen() {
    let data
    if (!this.restrictions.notNull && Math.random() < this._nullChance) {
      data = null
    }
    return data
  }
}
Object.assign(DataGen.prototype, { _nullChance: 1 / 1000, })



