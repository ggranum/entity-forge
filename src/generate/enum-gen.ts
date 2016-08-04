import {DataGen} from "./data-gen";
import {CommonRestrictions} from "validator/index";

export class EnumGen extends DataGen {

  restrictions:CommonRestrictions

  constructor() {
    super()
  }

  values(values:any[]):this{
    super.isOneOf(values)
    return this
  }

  gen() {
    if (this.restrictions.isOneOf.length == 0) {
      throw new Error("No valid enumeration allowedValues available to generate.")
    }
    let data = super.gen()
    if (data !== null) {
      let randomIndex = Math.floor(Math.random() * this.restrictions.isOneOf.length)
      data = this.restrictions.isOneOf[randomIndex]
    }
    return data
  }
}



