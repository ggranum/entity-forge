import {
  Validator,
  Validators,
  StringRestrictions,
  BaseRestrictions,
  NumberRestrictions,
  ObjectRestrictions,
  BooleanRestrictions,
  MinValidator,
  MaxValidator,
  MinLengthValidator,
  MaxLengthValidator,
  ExistsValidator,
  IsOneOfValidator,
  CodePointsValidator,
  Strings
} from './validation/index'


window['Validator'] = Validator
window['Validators'] = Validators
window['StringRestrictions'] = StringRestrictions
window['BaseRestrictions'] = BaseRestrictions
window['NumberRestrictions'] = NumberRestrictions
window['ObjectRestrictions'] = ObjectRestrictions
window['BooleanRestrictions'] = BooleanRestrictions
window['MinValidator'] = MinValidator
window['MaxValidator'] = MaxValidator
window['MinLengthValidator'] = MinLengthValidator
window['MaxLengthValidator'] = MaxLengthValidator
window['ExistsValidator'] = ExistsValidator
window['IsOneOfValidator'] = IsOneOfValidator
window['CodePointsValidator'] = CodePointsValidator
window['Strings'] = Strings

