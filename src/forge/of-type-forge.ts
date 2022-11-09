import {Forge} from "./forge";
import {NotNullRestriction, NotNullRestrictionFluent} from "../validator/base-validator";
import {BaseForge} from "./base-forge";
import {EntityResolver} from "./store/resolver";
import {EntityType} from "./entity-type";


export interface OfTypeRestrictions extends NotNullRestriction {
  // Define the type that we are referencing.
  to: { type: any }
  resolvedBy: EntityResolver,
  createIfAbsent: boolean
}

export interface OfTypeRestrictionsFluent extends NotNullRestrictionFluent {
  to(toType: Forge): this
  createIfAbsent(value?: boolean): this
}

/**
 * [Incomplete]
 *
 * Model a reference to any non-primitive data type that we don't have built in forges for already.
 *
 * For instance, in a typical 'Address Book' application, there will be a Contact model, as well as a User
 * model, to represent the current user, and that User will likely have their own Contact field that OfTypes a
 * contact instance.
 *  @todo: ggranum: Implement.
 */
export class OfTypeForge extends BaseForge implements OfTypeRestrictionsFluent {

  restrictions: OfTypeRestrictions

  constructor() {
    super()
  }

  static ofType(type: any): OfTypeForge {
    return new OfTypeForge().to(type)
  }

  newInstance(defaultOverride?: any, parent?: EntityType): any {
    let reference: any = super.newInstance(defaultOverride, parent)
    if (this.restrictions.createIfAbsent) {
      reference = this.restrictions.to.type.newInstance(defaultOverride)
    }
    return reference
  }

  gen(): any {
    this.ignite()
    return this.newInstance()
  }

  to(toType: Forge): this {
    this.restrictions.to = {type: toType}
    return this
  }

  resolvedBy(resolver: EntityResolver): this {
    this._resolver = resolver
    return this
  }

  createIfAbsent(value?: boolean): this {
    this.restrictions.createIfAbsent = value !== false
    return this
  }

}