"use strict"

class ArrayCheck extends Check {

  static array(){
    let v = new ArrayCheck()
    v.add(Validators.isArray, Validators.exists)
    return v
  }

  maxSize(max, inclusive = true) {
    this.add(new MaxSizeValidator(max, inclusive), Validators.isArray, Validators.exists)
    return this
  }

  minSize(min, inclusive = true) {
    this.add(new MinSizeValidator(min, inclusive), Validators.isArray, Validators.exists)
    return this
  }

}