import {DataGen} from "./data-gen";
import {IsFunctionValidator,BaseRestrictions} from "validator/index";
import {BaseRestrictionsFluent} from "../validator/base-validator";
import {BaseGen} from "./base-gen";

export interface ObjectGenRestrictions extends BaseRestrictions {
  base:any
  fields:any
}

export interface ObjectGenFluent extends BaseRestrictionsFluent {
  fields(value:any):this
  base(value:any):this
}

export class ObjectGen extends BaseGen implements ObjectGenFluent{

  restrictions:ObjectGenRestrictions

  constructor() {
    super()
  }

  getDefaults():ObjectGenRestrictions{
    return {
      base:{},
      fields: {}
    }
  }

  fields(fields:any):this {
    this.restrictions.fields = fields
    return this
  }

  base(baseObject:any):this{
    this.restrictions.base = baseObject
    return this
  }

  doGen(R:ObjectGenRestrictions):Number{
    let n = this.nextBaseObject(R)
    Object.keys(R.fields).forEach((fieldName)=> {
      let field = R.fields[fieldName]
      n[fieldName] = field.gen(field.restrictions)
    })
    return n
  }

  //noinspection JSMethodCanBeStatic
  nextBaseObject(R?:ObjectGenRestrictions):any{
    let next:any
    if(!R.base){
      next = {}
    }
    else if(IsFunctionValidator.instance().isValid(R.base)){
      next = R.base()
    } else {
      next = Object.assign({}, R.base)
    }
    return next
  }

}



