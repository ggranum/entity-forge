"use strict"


class EnumGen extends DataGen {
  constructor(cfg = null) {
    super(Object.assign({}, {allowedValues: []}, cfg || {}))
  }

  values(allowedValues){
    this.allowedValues = allowedValues
    return this
  }

  gen() {
    if (this.allowedValues.length == 0) {
      throw new Error("No valid enumeration allowedValues available to generate.")
    }
    let data = super.gen()
    if (data !== null) {
      let randomIndex = Math.floor(Math.random() * this.allowedValues.length)
      data = this.allowedValues[randomIndex]
    }
    return data
  }
}
Object.assign(EnumGen.prototype, {
  allowedValues: null
})



