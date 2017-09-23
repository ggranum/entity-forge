import {Restriction} from "./base-validator";


export interface ValidatorErrorIF {
  key: string,
  restrictions: any,
  message: string,
  value: any,
}
export interface ValidatorErrorsIF {
  [key: string]: ValidatorErrorIF | any
  toString():string
}

export interface ValidatorIF {
  restrictions: Restriction
  key: string
  message: string

  clone():this
  getPreconditions(): ValidatorIF[]
  isValid(value: any, preconditionsTriggerFailure?: boolean): boolean
  validate(value: any, restrictions?: Restriction, preconditionsTriggerFailure?: boolean): ValidatorErrorsIF
  doValidate(value: any, restrictions?: Restriction): ValidatorErrorsIF
}


export class ValidatorErrors implements ValidatorErrorsIF {

  _all:ValidatorErrorInfo[]
  [key: string]: ValidatorErrorIF|any


  constructor(infos:ValidatorErrorInfo[]) {
    infos.forEach((info)=>{
      this[info.key] = info
    })
    this._all = infos
  }

  toString():string{
    let s = ''
    s += this._all.map((info)=> `${info.key}: ${info.toString()}` ).join('\n')
    return s
  }


}
export class ValidatorErrorInfo implements ValidatorErrorIF {

  constructor(public key: string,
              public message: string,
              public restrictions: Restriction,
              public value: any,
              public childErrors?: ValidatorErrorsIF) {
  }

  toString(){
    let s = this.message
    if(this.childErrors){
      s += ' { ' + this.childErrors.toString() + ' }'
    }
    return this.message
  }

  toComposite(applyTo?: ValidatorErrorsIF): ValidatorErrorsIF {
    let temp:any = {}
    temp[this.key] = this
    if (this.childErrors) {
      Object.assign(temp[this.key], this.childErrors)
    }
    return new ValidatorErrors([this])
  }

  static fromValidator(validator: ValidatorIF, value: any, childErrors?: any): ValidatorErrorInfo {
    return new ValidatorErrorInfo(validator.key,
      validator.message,
      validator.restrictions,
      value,
      childErrors
    )
  }
}

export class Validator implements ValidatorIF {
  static INSTANCE:Validator
  restrictions: Restriction
  key: string
  message: string

  constructor(providedArgs?: any) {
    this.restrictions = Object.assign({}, this.restrictions, providedArgs)
  }

  static instance():ValidatorIF {
    if(!this.INSTANCE || this.INSTANCE.constructor !== this){
      this.INSTANCE = new this()
    }
    return this.INSTANCE
  }

  clone():this{
    let instance = this
    let ctor:any = instance.constructor
    let copy = new ctor()
    copy.key = instance.key
    copy.message = instance.message
    copy.restrictions = JSON.parse(JSON.stringify(instance.restrictions))

    return copy
  }

  getPreconditions(): ValidatorIF[] {
    return []
  }


  isValid(value: any, preconditionsTriggerFailure?: boolean): boolean {
    return this.validate(value, this.restrictions, preconditionsTriggerFailure) === null
  }

  validate(value: any, restrictionOverrides?: Restriction, preconditionsTriggerFailure?: boolean): ValidatorErrorsIF {
    let R = restrictionOverrides ? restrictionOverrides : this.restrictions
    let results: ValidatorErrorsIF = null
    let preResults = this.testPreconditions(value, R)

    if (preResults === null) {
      results = this.doValidate(value, R)
    } else if (preconditionsTriggerFailure === true) {
      results = preResults
    }
    return results
  }


  testPreconditions(value: any, R?: Restriction): ValidatorErrorsIF {
    let preconditions = this.getPreconditions()
    let preResult: ValidatorErrorsIF = null
    for (let i = 0; i < preconditions.length; i++) {
      preResult = preconditions[i].validate(value, null, true)
      if (preResult !== null) {
        break
      }
    }
    return preResult
  }


  /**
   * Subclasses should implement this method. It will be called by the parent classes 'validate' method,
   * after 'testPreconditions' has executed successfully.
   *
   * Implementations should use the restrictions provided and not pull from the instance object.
   *
   * @param value
   * @param restrictions
   */
  doValidate(value: any, restrictions?: Restriction): ValidatorErrorsIF {
    throw new Error("Not implemented. Either provide a static 'doValidate' function or override the validate method.")
  }
}


export class CompositeValidator extends Validator {


  //noinspection JSMethodCanBeStatic
  doValidateComposite(value: string, R: Restriction, validations: ValidatorIF[]): ValidatorErrorsIF {
    let result: ValidatorErrorsIF = null
    for (let i = 0; i < validations.length; i++) {
      result = validations[i].validate(value, R)
      if (result !== null) {
        break
      }
    }
    return result
  }

}
