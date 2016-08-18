import {IsFunctionValidator} from "validator/index";
import {ObjectRestrictions, ObjectRestrictionsFluent} from "forge/index";
import {BaseGen} from "./base-gen";


export class ObjectGen extends BaseGen implements ObjectRestrictionsFluent{

  restrictions:ObjectRestrictions

  constructor() {
    super()
  }

  getDefaults():ObjectRestrictions{
    return {
      fields: {}
    }
  }

  fields(fields:any):this {
    this.restrictions.fields = fields
    return this
  }

  doGen(R:ObjectRestrictions):any{
    let n = {}
    Object.keys(R.fields).forEach((fieldName)=> {
      let field = R.fields[fieldName]
      n[fieldName] = field.gen(field.restrictions)
    })
    return n
  }

}



