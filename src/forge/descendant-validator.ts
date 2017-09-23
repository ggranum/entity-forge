import {ValidatorErrorInfo} from "../validator/validator";
import {Restriction} from "../validator/base-validator";
import {Validator} from "../validator/validator";


/**
 * Validator that validates child fields.
 */
export class DescendantValidator extends Validator {

  restrictions:any

  constructor(fieldForge:any) {
    super({fieldForge: fieldForge})
  }

  doValidate(value:any, R:Restriction):any {
    let errors:any = null
    Object.keys(this.restrictions.fieldForge._fieldDefinitions).forEach((key)=> {
      let fieldDef = this.restrictions.fieldForge._fieldDefinitions[key]
      let result = fieldDef.validate(value[key], key)
      if (result) {
        errors = errors || {}
        errors[key] = result
      }
    })
    let result:any = null
    if (errors) {
      result = new ValidatorErrorInfo("DescendantValidator", "@forge.descendantValidationFailed", value, errors)
    }
    return result
  }

  toError(value:any, childErrors:any) {
    let response = {};
    (<any>response)[this.restrictions.fieldForge.fieldName || 'instance'] = {
      message: this.message,
      value: value,
      causedBy: childErrors,
    }
    return response
  }
}
Object.assign(DescendantValidator.prototype, {
  ordinal: 1000,
  name: 'objectForgeValidation',
  message: '@restriction.forge.object',
  args: {
    fieldForge: undefined
  }
})


