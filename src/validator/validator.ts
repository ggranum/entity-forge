

import {Restriction} from "./restriction/restriction";
export interface ValidatorError {
  [key:string]: {
    restrictions:any,
    message:string,
    value:any,
  }
}

export interface ValidatorIF {
  restrictions:any
  name:string
  message:string
  ordinal:number

  isValid(value:any):boolean
  validate(value:any):any
}

 export class Validator implements ValidatorIF {
  restrictions:any
  name:string
  message:string
  ordinal:number = 1

  constructor(providedArgs?:any) {
    this.restrictions = Object.assign({}, this.restrictions, providedArgs)
  }

  isValid(value:any):boolean {
    throw new Error("Not implemented: " + this.name)
  }

  validate(value:any):ValidatorError {
    let r:any = null
    if (!this.isValid(value)) {
      r = this.generateError(value)
    }
    return r
  }

  generateError(value:any, childErrors?:any, alternateMessage?:string):ValidatorError {
    let response:ValidatorError = {}
    response[this.name] = {
      restrictions: this.restrictions,
      message: alternateMessage || this.message,
      value: value,
    }
    if (childErrors) {
      Object.assign(response[this.name], childErrors)
    }
    return response
  }
}