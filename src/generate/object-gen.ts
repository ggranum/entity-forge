import {BaseGen} from "./base-gen";
import {ObjectRestrictions, ObjectRestrictionsFluent} from "../forge/object-forge";


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
    let n:any = {}
    Object.keys(R.fields).forEach((fieldName)=> {
      let field = R.fields[fieldName]
      n[fieldName] = field.gen(field.restrictions)
    })
    return n
  }

}



