
export class Validator {

  args:any
  name:string
  message:string
  ordinal:number = 1

  constructor(providedArgs:any = null) {
    this.args = Object.assign({}, this.args, providedArgs)
  }

  check(value:any):boolean {
    throw new Error("Not implemented: " + this.name)
  }

  validate(value:any):any {
    let r:any = null
    if (!this.check(value)) {
      r = this.toError(value)
    }
    return r
  }

  toError(value:any, additionalData:any = null):any {
    let response:any = {}
    response[this.name] = {
      message: this.message,
      value: value,
      args: this.args
    }
    if (additionalData) {
      Object.assign(response[this.name], additionalData)
    }
    return response
  }
}