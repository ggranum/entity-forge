"use strict"



let ordinalSortFn = (a, b) => {
  return a.ordinal - b.ordinal
}


class Constraint {

  constructor(primaryValidation, ...preconditions) {
    this.name = primaryValidation.name
    this.primary = primaryValidation
    this.preconditions = []

    preconditions.forEach((p)=> {
      this.preconditions.push(new Constraint(p))
    })
    this.preconditions.sort(ordinalSortFn)
  }

  check(value) {
    return this.validate(value) === null
  }

  validate(value) {
    let result = null
    let preconditionsPass = this.preconditions.every((p)=> {
      return p.check(value)
    })
    if (preconditionsPass) {
      result = this.primary.validate(value)
    }
    // result is null even if preconditionsPass === false.
    // This allows, for example, a string to be either null or have a minLength of 0.
    return result
  }
}
