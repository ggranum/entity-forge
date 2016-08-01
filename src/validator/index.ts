import {Validator} from "./validator";
import {IsBooleanValidator} from "./boolean";

import {IsStringValidator} from "./string";
import {IsArrayValidator} from "./array";
import {IsNumberValidator, IsIntValidator} from "./number";
import {IsFunctionValidator, IsObjectValidator, NotNullValidator} from "./object";

let Validators = {
  notNull: new NotNullValidator(),
  isObject: new IsObjectValidator(),
  isFunction: new IsFunctionValidator(),
  isArray: new IsArrayValidator(),
  isBoolean: new IsBooleanValidator(),
  isNumber: new IsNumberValidator(),
  isInt: new IsIntValidator(),
  isString: new IsStringValidator()
}

export {
  Validator,
  Validators,
  IsBooleanValidator,
  IsStringValidator,
  IsArrayValidator
};
export {NotNullValidator, IsOneOfValidator, IsObjectValidator, IsFunctionValidator} from "./object";
export {IsIntValidator, IsNumberValidator,MaxValidator, MinValidator} from "./number";
export {MaxLengthValidator, MinLengthValidator, Strings, CodePointsValidator} from "./string";
export {MaxSizeValidator, MinSizeValidator} from "./array";
export * from './restriction/restriction'