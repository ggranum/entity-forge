"use strict"

class NumberCheck extends Check {

  static number() {
    let v = new NumberCheck()
    return v.isNumber()
  }

  static int() {
    let v = new NumberCheck()
    return v.isInt()
  }

  isNumber() {
    this.add(Validators.isNumber, Validators.exists)
    return this
  }

  isInt() {
    this.add(Validators.isInt, Validators.exists)
    return this
  }

  min(min, inclusive = true) {
    this.add(new MinValidator(min, inclusive), Validators.isNumber, Validators.exists)
    return this
  }

  max(max, inclusive = false) {
    this.add(new MaxValidator(max, inclusive), Validators.isNumber, Validators.exists)
    return this
  }

}





