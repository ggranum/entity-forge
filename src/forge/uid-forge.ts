import {Strings, StringValidator, NotNullRestriction} from "validator/index";
import {UIDGen} from "generate/index";
import {BaseForge} from "./base-forge";

export class UidForge extends BaseForge {

  restrictions: NotNullRestriction

  constructor() {
    super()
    this.validatedBy(
      new StringValidator()
        .allowedCodePoints(Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII)
        .minLength(20)
        .maxLength(20)
        .notNull())
  }

  static uid(defaultValue?:string) {
    return new UidForge().initTo(defaultValue)
  }


}

UidForge.generatedByType(UIDGen)
