import {DataGen} from "./data-gen";
import {BaseRestrictions, BaseRestrictionsFluent} from "../validator/base-validator";


export class BaseGen extends DataGen implements BaseRestrictionsFluent {

  constructor() {
    super()
  }

  getDefaults(): BaseRestrictions {
    return {
      notNull: false,
      isOneOf: undefined
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

  /**
   * @todo: For BaseForges that do not provide an 'isOneOf' restriction, provide a value from a list that includes
   * all the major types, such as decimal, string, null (unless notNull set), Object, etc.
   * @param R The set of restrictions.
   */
  doGen(R?:BaseRestrictions):any{
    let data:any = null
    if(R && R.isOneOf){
      if (R.isOneOf.length == 0) {
        throw new Error("No valid values - add items via 'isOneOf'.")
      }
      let randomIndex = Math.floor(Math.random() * R.isOneOf.length)
      data = R.isOneOf[randomIndex]
    }
    return data
  }

}




