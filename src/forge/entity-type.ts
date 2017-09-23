import {Forge, CompositeForgeIF} from "./forge";


let applyMixins = function (subtype: any, supertypes: any[]) {
  supertypes.forEach((supertype: any)=> {
    Object.getOwnPropertyNames(supertype.prototype).forEach((property) => {
      subtype.prototype[property] = supertype.prototype[property]
    })
  })
}

export interface EntityTypeIF {
  _defaults: any
  _forge: Forge
  _fieldName: string
  _parent: EntityType
}

export class EntityType {
  _defaults: any
  _forge: Forge
  _fieldName: string
  _parent: EntityType
  static defineValidateFn: Function
  static enhanceSubclass: Function

  init():this {
    Object.keys(this._defaults).forEach((key) => {
      let def = this._defaults[key]
      if (def instanceof Forge) {
        (<any>this)[key] = def.newInstance(undefined, this)
      }
      else {
        (<any>this)[key] = def
      }
    })
    return this
  }

  path(childFieldName?: string) {
    let path: string = this._parent ? this._parent.path() + '.' : ''
    path = path + this._fieldName
    return childFieldName == null ? path : path + '.' + childFieldName
  }

  toJsonString() {
    return JSON.stringify(this)
  }

  toJSON() {
    let json = {
      _path: this.path(),
      _fieldName: this._fieldName
    }

    Object.keys(this._defaults).forEach((key) => {
      (<any>json)[key] = (<any>this)[key]
    })
    return json
  }
}

let noClone: string[] = ['constructor']

EntityType.enhanceSubclass = function (ctor: any, forge: Forge, fieldName: string, parent: CompositeForgeIF, superClassCtor: any = EntityType): typeof EntityType {
  superClassCtor.defineValidateFn(ctor.prototype)
  Object.getOwnPropertyNames(superClassCtor.prototype).forEach((property) => {
    if (noClone.indexOf(property) === -1) {
      ctor.prototype[property] = superClassCtor.prototype[property]
    }
  })
  ctor.prototype._forge = forge
  ctor.prototype._fieldName = fieldName
  ctor.prototype._parent = parent ? parent._entityType : null
  return ctor
}

/**
 * Defines a validate function on the EntityType we are creating.
 * Refers to the validate function of its forge.
 */
EntityType.defineValidateFn = function (proto: any) {
  Object.defineProperty(proto, 'validate', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function () {
      return (<any>this)._forge.validate(this, (<any>this)._forge.fieldName)
    }
  })
}



/**
 * Delegation over mixin for Map. See http://stackoverflow.com/a/29436039/1867101
 * Short story: native map implementations aren't built be extended.
 */
class MapEntityType<K, V> extends EntityType implements Map<K,V> {

  static defineValidateFn: Function
  private _map:Map<K,V>


  init(): this {
    super.init()
    this._map = new Map<K,V>()
    this[Symbol.iterator] = this._map[Symbol.iterator]
    return this
  }

  [Symbol.toStringTag]: "Map";

  [Symbol.iterator](): IterableIterator<[K,V]> {
    return undefined
  }

  size: number;

  clear(): void {
    this._map.clear()
  }

  //noinspection ReservedWordAsName
  delete(key: K): boolean {
    return this._map.delete(key)
  }

  entries(): IterableIterator<any> {
    return this._map.entries()
  }

  forEach(callbackfn: (value: V, index: K, map: Map<K, V>)=>void, thisArg?: any): void {
    this._map.forEach(callbackfn)
  }

  get(key: K): V {
    return this._map.get(key)
  }

  has(key: K): boolean {
    return this._map.has(key)
  }

  keys(): IterableIterator<K> {
    return this._map.keys()
  }

  set(key: K, value?: V): this {
    this._map.set(key, value)
    return this
  }

  values(): IterableIterator<V> {
    return this._map.values()
  }
}

MapEntityType.defineValidateFn = EntityType.defineValidateFn
export {MapEntityType}
