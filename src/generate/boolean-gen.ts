import {DataGen} from "./data-gen";
import {BooleanRestrictions} from "../validation/restriction/restriction";

export class BooleanGen extends DataGen {

  constructor(cfg:any = null) {
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



