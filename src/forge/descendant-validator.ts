import {Validator} from "@entityforge/validator";

/**
 * Validator that validates child fields.
 */
export class DescendantValidator extends Validator {
  constructor(fieldForge:any) {
    super({fieldForge: fieldForge})
  }

  validate(value:any):any {
    let errors:any = null
    Object.keys(this.args.fieldForge.fieldDefinitions).forEach((key)=> {
      let fieldDef = this.args.fieldForge.fieldDefinitions[key]
      let result = fieldDef.validate(value[key], key)
      if (result) {
        errors = errors || {}
        errors[key] = result
      }
    })
    let result:any = null
    if (errors) {
      result = this.toError(value, errors)
    }
    return result
  }

  toError(value:any, childErrors:any) {
    let response = {}
    response[this.args.fieldForge.fieldName || 'instance'] = {
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


