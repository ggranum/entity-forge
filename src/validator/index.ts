import {IsBooleanValidator} from "./boolean";
import {IsStringValidator} from "./string";
import {IsArrayValidator} from "./array";
import {IsNumberValidator, IsIntValidator} from "./number";
import {IsFunctionValidator, IsObjectValidator, NotNullValidator} from "./object";

export const Validators = {
  notNull: new NotNullValidator(),
  isObject: new IsObjectValidator(),
  isFunction: new IsFunctionValidator(),
  isArray: new IsArrayValidator(),
  isBoolean: new IsBooleanValidator(),
  isNumber: new IsNumberValidator(),
  isInt: new IsIntValidator(),
  isString: new IsStringValidator()
}

export * from "./validator";
export * from "./object";
export * from "./number";
export * from "./string";
export * from "./array";
export * from "./identifier";
export * from './restriction/restriction'