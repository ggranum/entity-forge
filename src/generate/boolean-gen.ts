import {DataGen} from "./data-gen";
import {BooleanRestrictionDefaults} from "@entityforge/validator";

export class BooleanGen extends DataGen {

  constructor(cfg:any = null) {
    super(cfg, BooleanRestrictionDefaults)
  }

  gen() {
    let data = super.gen()
    if (data !== null) {
      data = Math.random() < 0.5
    }
    return data
  }
}



