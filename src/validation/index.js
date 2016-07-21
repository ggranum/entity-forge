"use strict"



let Validators = {
  exists: new ExistsValidator(),
  isObject: new IsObjectValidator(),
  isFunction: new IsFunctionValidator(),
  isArray: new IsArrayValidator(),
  isBoolean: new IsBooleanValidator(),
  isNumber: new IsNumberValidator(),
  isInt: new IsIntValidator(),
  isString: new IsStringValidator()

}
