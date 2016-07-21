"use strict"


class NumberGen extends DataGen {
  constructor(cfg = null) {
    super(cfg, NumberRestrictions)
  }

  isInt() {
    this.restrictions.integral = true
    this.restrictions.min = this.min === Number.MIN_VALUE ? Number.MIN_SAFE_INTEGER : this.restrictions.min
    this.restrictions.max = this.max === Number.MAX_VALUE ? Number.MAX_SAFE_INTEGER : this.restrictions.max
    return this
  }

  positive(){
    this.restrictions.min = 0
    return this
  }

  negative(){
    this.restrictions.max = 0
  }

  gen() {
    let data = super.gen()
    if(data !== null){
      if(this.restrictions.integral){
        data = Math.floor(Math.random() * (this.restrictions.max - this.restrictions.min + 1)) + this.restrictions.min
      } else{
        data = Math.random() * (this.restrictions.max - this.restrictions.min) + this.restrictions.min;
      }
    }
    return data
  }
}


