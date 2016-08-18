import {BaseForge} from "./index"
import {BooleanForge} from "./index"
import {EnumForge} from "./index"
import {NumberForge} from "./index"
import {StringForge} from "./index"
import {ObjectForge} from "./index"
import {UidForge} from "./index"
import {DateForge} from "./index"
import {ReferenceForge} from "./index"
import {Forge} from "./index"
import {EntityResolver, AppResolver} from "./store/resolver";
import {EntityStore} from "./store/entity-store";
import {AppForge} from "./app-forge";
import {MapForge} from "./map-forge";


export interface EntityForgeIF {
  any: ((defaultValue?: any)=>BaseForge);
  bool: ((defaultValue?: boolean)=>BooleanForge);
  enumeration: ((defaultValue?: any)=>EnumForge);
  number: ((defaultValue?: number)=>NumberForge);
  int: ((defaultValue?: number)=>NumberForge);
  string: ((defaultValue?: string)=>StringForge);
  ref: ((path: string, to: Forge)=>ReferenceForge);
  date: ((defaultValue?: number)=>DateForge);
  uid: ((defaultValue?: string)=>UidForge);
  map:  (() => MapForge)
  obj:  ((fields: any, defaultValue?: any, fieldName?: string) => ObjectForge)
  app:  ((fields: any, defaultValue?: any, fieldName?: string) => AppForge)

  setGlobalDefaultResolver(resovler: EntityResolver): void
  setGlobalDefaultStore(store: EntityStore): void
  registerForge(forge: typeof Forge, staticTarget: Function): void
}

/**
 * Intended as a singleton, but it doesn't really matter unless your extending with additional forges.
 */
export class EntityForge implements EntityForgeIF {
  any: (defaultValue?: any)=>BaseForge;
  bool: (defaultValue?: boolean)=>BooleanForge;
  enumeration: (defaultValue?: any)=>EnumForge;
  number: (defaultValue?: number)=>NumberForge;
  int: (defaultValue?: number)=>NumberForge;
  string: (defaultValue?: string)=>StringForge;
  ref: (path: string, to: Forge)=>ReferenceForge;
  date: (defaultValue?: number)=>DateForge;
  uid: (defaultValue?: string)=>UidForge
  map:  (() => MapForge)
  obj: (fields?: any, defaultValue?: any, fieldName?: string)=>ObjectForge
  app: (fields: any, defaultValue?: any, fieldName?: string)=>AppForge

  resolver: EntityResolver
  forgeTypes: typeof Forge[] = []

  setGlobalDefaultResolver(resolver: EntityResolver): void {
    this.resolver = resolver
    this.forgeTypes.forEach((forgeType: typeof Forge)=> {
      forgeType.DEFAULT_RESOLVER = resolver
    })
  }

  setGlobalDefaultStore(store: EntityStore): void {
  }


  registerForge(forgeType: typeof Forge, staticShortcutTarget?: Function): void {
    this.forgeTypes.push(forgeType)
    this._applyDefaults(forgeType)
    if (staticShortcutTarget) {

      let name: string = staticShortcutTarget.name
      if (!name) {
        throw new Error("Invalid name for forge target: " + forgeType)
      }
      else if(this[name]){
        throw new Error(`Shortcut target already exists for ${name} on forge ${forgeType}.`)
      } else {
        this[staticShortcutTarget.name] = staticShortcutTarget
      }
    }

  }


  private _applyDefaults(forgeType: typeof Forge) {
    forgeType.DEFAULT_RESOLVER = this.resolver
  }
}


export let EF: EntityForgeIF = new EntityForge()

EF.registerForge(BaseForge, BaseForge.any)
EF.registerForge(BooleanForge, BooleanForge.bool)
EF.registerForge(EnumForge, EnumForge.enumeration)
EF.registerForge(NumberForge, NumberForge.number)
EF.registerForge(NumberForge, NumberForge.int)
EF.registerForge(StringForge, StringForge.string)
EF.registerForge(ReferenceForge, ReferenceForge.ref)
EF.registerForge(DateForge, DateForge.date)
EF.registerForge(UidForge, UidForge.uid)
EF.registerForge(MapForge, MapForge.map)
EF.registerForge(ObjectForge, ObjectForge.obj)
EF.registerForge(AppForge, AppForge.app)




