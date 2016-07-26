import {DataGen} from "./data-gen";
import {NumberRestrictions} from "../validation/restriction/restriction";


export class NumberGen extends DataGen {
  constructor(cfg = null) {
    super(cfg, NumberRestrictions)
  }

  isInt():NumberGen {
    this.restrictions.integral = true
    this.restrictions.min = this.restrictions.min === Number.MIN_VALUE ? Number.MIN_SAFE_INTEGER : this.restrictions.min
    this.restrictions.max = this.restrictions.max === Number.MAX_VALUE ? Number.MAX_SAFE_INTEGER : this.restrictions.max
    return this
  }

  positive():NumberGen{
    this.restrictions.min = 0
    return this
  }

  negative():NumberGen {
    this.restrictions.max = 0
    return this
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


