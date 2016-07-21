"use strict"


class ObjectGen extends DataGen {
  constructor(cfg = null) {
    super(Object.assign({}, cfg || { fields: {}}))
  }

  childFields(fields) {
    this.fields = fields
    return this
  }

  base(baseObject){
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

  nextBaseObject(){
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
Object.assign(ObjectGen.prototype, {
  fields: null,
  baseObject: function(){ return {} }
})



