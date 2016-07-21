"use strict"


class DataGen {

  constructor(cfg = null) {
    Object.assign(this, cfg || {})
  }

  gen() {
    let data
    if (!this.notNull && Math.random() < this.nullChance) {
      data = null
    }
    return data
  }
}
Object.assign(DataGen.prototype, BaseRestrictions, {
  nullChance: 1 / 1000,
})



