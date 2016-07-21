"use strict"


class BooleanCheck extends Check {

  static boolean() {
    let v = new BooleanCheck()
    return v.isBoolean()
  }

  isBoolean() {
    this.add(Validators.isBoolean, Validators.exists)
    return this
  }
}







