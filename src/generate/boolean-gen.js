"use strict"


class BooleanGen extends DataGen {

  constructor(cfg = null) {
    super(cfg, BooleanRestrictions)
  }

  gen() {
    let data = super.gen()
    if (data !== null) {
      data = Math.random() < 0.5
    }
    return data
  }
}



