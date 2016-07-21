"use strict"

class Validator {

  constructor(providedArgs) {
    this.args = Object.assign({}, this.args, providedArgs)
  }

  check(value) {
    throw new Error("Not implemented: " + this.name)
  }

  validate(value) {
    let r = null
    if (!this.check(value)) {
      r = this.toError(value)
    }
    return r
  }

  toError(value, additionalData = null) {
    let response = {}
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