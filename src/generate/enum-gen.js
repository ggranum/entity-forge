"use strict"


class EnumGen extends DataGen {
  constructor(cfg = null) {
    super(cfg, ObjectRestrictions)
  }

  values(values){
    this.restrictions.values = values
    return this
  }

  gen() {
    if (this.restrictions.values.length == 0) {
      throw new Error("No valid enumeration allowedValues available to generate.")
    }
    let data = super.gen()
    if (data !== null) {
      let randomIndex = Math.floor(Math.random() * this.restrictions.values.length)
      data = this.restrictions.values[randomIndex]
    }
    return data
  }
}



