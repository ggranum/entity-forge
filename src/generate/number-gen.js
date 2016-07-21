"use strict"


class NumberGen extends DataGen {
  constructor(cfg = null) {
    super(cfg)
    Object.assign(this, cfg || {})
  }

  isInt() {
    this.integral = true
    this.min = this.min === Number.MIN_VALUE ? Number.MIN_SAFE_INTEGER : this.min
    this.max = this.max === Number.MAX_VALUE ? Number.MAX_SAFE_INTEGER : this.max
    return this
  }

  positive(){
    this.min = 0
    return this
  }

  negative(){
    this.max = 0
  }

  gen() {
    let data = super.gen()
    if(data !== null){
      if(this.integral){
        data = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min
      } else{
        data = Math.random() * (this.max - this.min) + this.min;
      }
    }
    return data
  }
}
Object.assign(NumberGen.prototype, {
  max: Number.MAX_VALUE,
  min: Number.MIN_VALUE,
})



