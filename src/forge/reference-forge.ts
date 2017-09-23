import {Forge} from "./forge";
import {NotNullRestriction, NotNullRestrictionFluent} from "../validator/base-validator";
import {BaseForge} from "./base-forge";
import {EntityResolver} from "./store/resolver";
import {EntityType} from "./entity-type";
// import {ReferenceRestrictions, ReferenceRestrictionsFluent, ReferenceValidator} from "@entity-forge/validator";


export interface ReferenceRestrictions extends NotNullRestriction {
  // Define the type that we are referencing.
  to?: {type: Forge, path: string}
  resolvedBy?: EntityResolver,
  createIfAbsent?: boolean
}

export interface ReferenceRestrictionsFluent extends NotNullRestrictionFluent {
  to(path: string, toType: Forge): this
  createIfAbsent(value?: boolean): this
}

export class ReferenceForge extends BaseForge implements ReferenceRestrictionsFluent {

  restrictions: ReferenceRestrictions

  constructor() {
    super()
  }

  static ref(path: string, to: Forge): ReferenceForge {
    return new ReferenceForge().to(path, to)
  }

  newInstance(defaultOverride?:any, parent?:EntityType): any {
    let reference: string = null
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