import {Forge} from "./forge";
import {NotNullRestriction, NotNullRestrictionFluent} from "../validator/base-validator";
import {BaseForge} from "./base-forge";
import {EntityResolver} from "./store/resolver";
import {EntityType} from "./entity-type";


export interface ReferenceRestrictions extends NotNullRestriction {
  // Define the type that we are referencing.
  to: { type: Forge, path: string }
  resolvedBy: EntityResolver,
  createIfAbsent: boolean
}

export interface ReferenceRestrictionsFluent extends NotNullRestrictionFluent {
  to(path: string, toType: Forge): this

  createIfAbsent(value?: boolean): this
}

/**
 * [Incomplete]
 *
 * Model a reference to another Forge defined within a DomainModelForge.
 *
 * Probably this is just a bad idea that requires too much work for too little value.
 *
 * For instance, in a typical 'Address Book' application, there will be a Contact model, as well as a User
 * model, to represent the current user, and that User will likely have their own Contact field that references a
 * contact instance.
 *  @todo: ggranum: Implement or remove.
 */
export class ReferenceForge extends BaseForge implements ReferenceRestrictionsFluent {

  restrictions: ReferenceRestrictions

  constructor() {
    super()
  }

  static ref(path: string, to: Forge): ReferenceForge {
    return new ReferenceForge().to(path, to)
  }

  newInstance(defaultOverride?: any, parent?: EntityType): any {
    let reference: string = ''
    if (this.restrictions.createIfAbsent) {
      let path = this.restrictions.to.path
      reference = this._resolver.createAndStore(path, this.restrictions.to.type)
    }
    return reference
  }

  gen(): any {
    this.ignite()
    return this.newInstance()
  }

  to(path: string, toType: Forge): this {
    this.restrictions.to = {type: toType, path: path || 'uid'}
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