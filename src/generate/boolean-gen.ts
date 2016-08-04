import {DataGen} from "./data-gen";

export class BooleanGen extends DataGen {

  constructor() {
    super()
  }

  gen() {
    let data = super.gen()
    if (data !== null) {
      data = Math.random() < 0.5
    }
    return data
  }
}



