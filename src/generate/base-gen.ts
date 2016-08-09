import {ValidatorIF, BaseRestrictionsFluent, BaseRestrictions} from "validator/index";
import {} from "../validator/base-validator";
import {DataGen} from "./data-gen";


export class BaseGen extends DataGen implements BaseRestrictionsFluent{

  constructor() {
    super()
  }

  getDefaults(): BaseRestrictions {
    return {
      notNull: false,
      isOneOf: null
    };
  }

  notNull(): this {
    this.restrictions.notNull = true
    return this
  }

  isOneOf(values: any[]): this {
    this.restrictions.isOneOf = values
    return this
  }

}




