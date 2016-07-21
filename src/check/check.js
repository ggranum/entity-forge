"use strict";


class Check {

  constructor() {
    this.constraints = []
  }

  /**
   *
   * @returns {Check}
   */
  static any() {
    return new Check()
  }

  add(primaryValidation, ...preconditions) {
    this.constraints.push(new Constraint(primaryValidation, ...preconditions))
  }

  /**
   *
   * @param {Constraint[]} restrictions
   */
  addConstraints(restrictions) {
    this.constraints.push(...restrictions)
  }

  check(value) {
    return this.validate(value) === null
  }

  validate(value) {
    let results = null
    let failed = false
    this.constraints.forEach((test) => {
      let r = test.validate(value)
      if (r != null) {
        failed = true
        results = Object.assign(results || {}, r)
      }
    })
    return results
  }


  exists() {
    this.add(Validators.exists)
    return this
  }

  isObject() {
    this.add(Validators.isObject, Validators.exists)
  }


  isFunction() {
    this.add(Validators.isFunction, Validators.exists)
  }

  isOneOf(values = []) {
    this.add(new IsOneOfValidator(values), Validators.exists)
    return this
  }
}
