import {Forge} from "./forge";
import {BaseGen} from "../generate/base-gen";
import {BaseRestrictionsFluent} from "../validator/base-validator";
import {BaseRestrictions} from "../validator/base-validator";
import {BaseValidator} from "../validator/base-validator";


export class BaseForge extends Forge implements BaseRestrictionsFluent{

  restrictions:BaseRestrictions

  constructor() {
    super()
    super.validatedBy(BaseValidator.instance())
  }

  static any(defaultValue?:any):BaseForge {
    return new BaseForge().initTo(defaultValue)
  }

  notNull(value?:boolean):this {
    this.restrictions.notNull = value !== false
    return this
  }

  isOneOf(value: any[]): this {
    this.restrictions.isOneOf = value
    return this
  }
}
/**
 * @todo ggranum: At some point this registration should be moved into an 'entityForge-with-generation.ts' file,
 * so we can ship without requiring Generators (which are only meant for use in testing environments)
 */
BaseForge.generatedByType(BaseGen)
