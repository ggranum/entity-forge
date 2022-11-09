import {AppForge} from "./app-forge";
import {Forge} from "./forge";
import {
  BaseForge,
  BooleanForge,
  DateForge,
  EnumForge,
  NumberForge,
  ObjectForge,
  ReferenceForge,
  StringForge,
  UidForge
} from "./index"
import {MapForge} from "./map-forge";
import {OfTypeForge} from "./of-type-forge";
// noinspection TypeScriptPreferShortImport
import {EntityStore} from "./store/entity-store";
import {EntityResolver} from "./store/resolver";


export interface EntityForgeIF {
  any: ((defaultValue?: any) => BaseForge);
  bool: ((defaultValue?: boolean) => BooleanForge);
  enumeration: ((defaultValue?: any) => EnumForge);
  number: ((defaultValue?: number) => NumberForge);
  int: ((defaultValue?: number) => NumberForge);
  string: ((defaultValue?: string) => StringForge);
  ref: ((path: string, to: Forge) => ReferenceForge);
  ofType: ((ofType?:any) => OfTypeForge);
  date: ((defaultValue?: number) => DateForge);
  uid: ((defaultValue?: string) => UidForge);
  map: (() => MapForge)
  obj: (<T>(fields: T, defaultValue?: any, fieldName?: string) => ObjectForge & T)
  app: ((fields: any, defaultValue?: any, fieldName?: string) => AppForge)

  setGlobalDefaultResolver(resovler: EntityResolver): void

  setGlobalDefaultStore(store: EntityStore): void

  registerForge(forge: typeof Forge, staticTarget: Function, name?: string): void
}

/**
 * Intended as a singleton, but it doesn't really matter unless you're extending with additional forges.
 */
export class EntityForge implements EntityForgeIF {
  any: (defaultValue?: any) => BaseForge;
  bool: (defaultValue?: boolean) => BooleanForge;
  enumeration: (defaultValue?: any) => EnumForge;
  number: (defaultValue?: number) => NumberForge;
  int: (defaultValue?: number) => NumberForge;
  string: (defaultValue?: string) => StringForge;
  ref: (path: string, to: Forge) => ReferenceForge;
  ofType: (type: any) => OfTypeForge;
  date: (defaultValue?: number) => DateForge;
  uid: (defaultValue?: string) => UidForge
  map: (() => MapForge)
  obj: (<T>(fields: T, defaultValue?: any, fieldName?: string) => ObjectForge & T)
  app: (fields: any, defaultValue?: any, fieldName?: string) => AppForge

  resolver: EntityResolver
  forgeTypes: typeof Forge[] = []

  setGlobalDefaultResolver(resolver: EntityResolver): void {
    this.resolver = resolver
    this.forgeTypes.forEach((forgeType: typeof Forge) => {
      forgeType.DEFAULT_RESOLVER = resolver
    })
  }

  setGlobalDefaultStore(store: EntityStore): void {
  }


  registerForge(forgeType: typeof Forge, staticShortcutTarget?: Function, name?: string): void {
    this.forgeTypes.push(forgeType)
    this._applyDefaults(forgeType)
    if (staticShortcutTarget) {

      name = name || staticShortcutTarget.name
      if (!name) {
        throw new Error("Invalid name for forge target: " + forgeType)
      }
      else if ((<any>this)[name]) {
        throw new Error(`Shortcut target already exists for ${name} on forge ${forgeType}.`)
      } else {
        (<any>this)[name] = staticShortcutTarget
      }
    }

  }


  private _applyDefaults(forgeType: typeof Forge) {
    forgeType.DEFAULT_RESOLVER = this.resolver
  }
}


export const EF: EntityForgeIF = new EntityForge()

EF.registerForge(BaseForge, BaseForge.any, "any")
EF.registerForge(BooleanForge, BooleanForge.bool, "bool")
EF.registerForge(EnumForge, EnumForge.enumeration, "enumeration")
EF.registerForge(NumberForge, NumberForge.number, "number")
EF.registerForge(NumberForge, NumberForge.int, "int")
EF.registerForge(StringForge, StringForge.string, "string")
EF.registerForge(ReferenceForge, ReferenceForge.ref, "ref")
EF.registerForge(OfTypeForge, OfTypeForge.ofType, "ofType")
EF.registerForge(DateForge, DateForge.date, "date")
EF.registerForge(UidForge, UidForge.uid, "uid")
EF.registerForge(MapForge, MapForge.map, "map")
EF.registerForge(ObjectForge, ObjectForge.obj, "obj")
EF.registerForge(AppForge, AppForge.app, "app")




