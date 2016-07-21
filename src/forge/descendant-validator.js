"use strict"

/**
 * Validator that validates child fields.
 */
class DescendantValidator extends Validator {
  constructor(fieldForge) {
    super({fieldForge: fieldForge})
  }

  validate(value) {
    let errors = null
    Object.keys(this.args.fieldForge.fieldDefinitions).forEach((key)=> {
      let fieldDef = this.args.fieldForge.fieldDefinitions[key]
      let result = fieldDef.validate(value[key], key)
      if (result) {
        errors = errors || {}
        errors[key] = result
      }
    })
    let result = null
    if (errors) {
      result = this.toError(value, errors)
    }
    return result
  }

  toError(value, childErrors) {
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


