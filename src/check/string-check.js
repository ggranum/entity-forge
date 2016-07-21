"use strict"

class StringCheck extends Check {

  static string() {
    let v = new StringCheck()
    v.add(Validators.isString, Validators.exists)
    return v
  }

  minLength(min, inclusive = true) {
    this.add(new MinLengthValidator(min, inclusive), Validators.isString, Validators.exists)
    return this
  }

  maxLength(max, inclusive = true) {
    this.add(new MaxLengthValidator(max, inclusive), Validators.isString, Validators.exists)
    return this
  }

  allowCodePoints(codePointRanges = Strings.COMMON_UTF_RANGES.UTF_PRINTABLE_PLANE_BMP){
    this.add(new CodePointsValidator(codePointRanges))
    return this
  }
}


