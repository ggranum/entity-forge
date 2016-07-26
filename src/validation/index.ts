import {Validator} from "./validator";
import {IsBooleanValidator} from "./boolean";

import {IsStringValidator} from "./string";
import {IsArrayValidator} from "./array";
import {IsNumberValidator, IsIntValidator} from "./number";
import {IsFunctionValidator, IsObjectValidator, ExistsValidator} from "./object";






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



export {
  Validator,
  Validators,
  IsBooleanValidator,
  IsStringValidator,
  IsArrayValidator
};
export {ExistsValidator, IsOneOfValidator, IsObjectValidator, IsFunctionValidator} from "./object";
export {IsIntValidator, IsNumberValidator,MaxValidator, MinValidator} from "./number";
export {MaxLengthValidator, MinLengthValidator, Strings, CodePointsValidator} from "./string";
export {MaxSizeValidator, MinSizeValidator} from "./array";
export {StringRestrictions, BaseRestrictions, NumberRestrictions,
  ObjectRestrictions, BooleanRestrictions} from './restriction/restriction'