import {DataGen} from "./data-gen";
import {ObjectRestrictions} from "../validation/restriction/restriction";
import {Validators} from "../validation/index";


export class ObjectGen extends DataGen {
  private fields:any = {}
  private baseObject:any = null
  constructor(cfg:any = null) {
    super(cfg , ObjectRestrictions)
  }

  childFields(fields:any) {
    this.fields = fields
    return this
  }

  base(baseObject:any){
    this.baseObject = baseObject
    return this
  }

  gen() {
    let data = super.gen()
    if (data !== null) {
      data = this._doGen()
    }
    return data
  }

  _doGen() {
    let n = this.nextBaseObject()
    Object.keys(this.fields).forEach((fieldName)=> {
      let gen = this.fields[fieldName]
      n[fieldName] = gen.gen()
    })
    return n
  }

  nextBaseObject():any{
    let next
    if(!this.baseObject){
      next = {}
    }
    else if(Validators.isFunction.check(this.baseObject)){
      next = this.baseObject()
    } else {
      next = Object.assign({}, this.baseObject)
    }
    return next
  }

}



