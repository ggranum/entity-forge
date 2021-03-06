import {IsArrayValidator} from "./array";
import {IsNumberValidator, IsIntValidator} from "./number-validator";
import {NotNullValidator} from "./base-validator";
import {IsObjectValidator, IsFunctionValidator, IsBooleanValidator} from "./common-validator";
import {IsStringValidator} from "./string/is-string-validator";

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
export * from "./base-validator";
export * from "./common-validator";
export * from "./composite-validator";
export * from "./number-validator";
export * from "./string/allowed-characters-validator";
export * from "./string/allowed-codepoints-validator";
export * from "./string/is-string-validator";
export * from "./string/string-validator";
export * from "./date/is-date-validator";
export * from "./date/before-validator";
export * from "./date/after-validator";
export * from "./date/date-validator";
export * from "./array";



export * from "./identifier/identifier";
export * from "./identifier/identifier_constants";
