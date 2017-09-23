import {EntityResolver} from "./store/resolver";
import {Forge} from "./forge";
import {ObjectForge} from "./object-forge";
import {EntityType, MapEntityType} from "./entity-type";
import {MapGen, MapRestrictions, MapRestrictionsFluent} from "../generate/map-gen";
import {StringValidator} from "../validator/string/string-validator";


/**
 * It isn't possible to intercept each possible entry to the map, so we have to insist on using setters.
 */
export class MapForge extends ObjectForge implements MapRestrictionsFluent {

  restrictions: MapRestrictions

  constructor() {
    super()
  }

  setResolver(resolver: EntityResolver): void {
    if (this.restrictions.of) {
      let f: Forge = <Forge>this.restrictions.of;
      f.setResolver(resolver)
    }
    super.setResolver(resolver)
  }

  ignite(): any {
    super.ignite(false)
    Object.freeze(this._entityType)
  }

  _createEntityConstructor(): typeof EntityType {
    let theCtor = function (cfg: any) {
      this.init()
      Object.assign(this, cfg)
    }
    return EntityType.enhanceSubclass(theCtor, this, this.fieldName, this.parent, MapEntityType)
  }

  newInstance<K,V>(): MapEntityType<any, any> {
    return <MapEntityType<string,any>>new this._entityType()
  }

  static map() {
    return new MapForge()
  }

  notNull(value?: boolean): this {
    let v: StringValidator = <StringValidator>this.getValidator()
    v.notNull(value)
    return super.notNull(value);
  }

  fields(value: any): this {
    return super.fields(value)
  }

  of(type: Forge): this {
    this.restrictions.of = type
    return this
  }

  keyedBy(keyGen: any): this {
    this.restrictions.keyedBy = keyGen
    return this
  }

  minLength(value: number, inclusive?: boolean): this {
    this.restrictions.minLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  maxLength(value: number, inclusive?: boolean): this {
    this.restrictions.maxLength = {value: value, inclusive: inclusive !== false}
    return this
  }

}

MapForge.generatedByType(MapGen)
