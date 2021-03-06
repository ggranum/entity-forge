import {BaseForge} from "./base-forge";
import {NotNullRestriction} from "../validator/base-validator";
import {Strings, StringValidator} from "../validator/string/string-validator";
import {UIDGen} from "../generate/uid-gen";

export class UidForge extends BaseForge {

  restrictions: NotNullRestriction

  constructor() {
    super()
    this.validatedBy(
      new StringValidator()
        .allowedCodePoints(Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII)
        .minLength(20)
        .maxLength(20))
  }


  newInstance(): any {
    return this.gen()
  }

  notNull(value?: boolean): this {
    let v:StringValidator = <StringValidator>this.getValidator()
    v.notNull(value)
    return super.notNull(value);
  }

  static uid(defaultValue?:string) {
    return new UidForge().initTo(defaultValue)
  }
}

UidForge.generatedByType(UIDGen)
