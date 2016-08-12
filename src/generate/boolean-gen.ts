import {DataGen} from "./data-gen";
import {Restriction} from "../validator/base-validator";

export class BooleanGen extends DataGen {

  constructor() {
    super()
  }

  doGen(R?: Restriction): boolean {
    return Math.random() < 0.5
  }
}



