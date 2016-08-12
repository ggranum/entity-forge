import {BaseForge} from "./base-forge";
import {BooleanForge} from "./boolean-forge";
import {EnumForge} from "./enum-forge";
import {NumberForge} from "./number-forge";
import {StringForge} from "./string-forge";
import {ObjectForge} from "./object-forge";
import {UidForge} from "./uid-forge";


export let EntityForge: {
  any: ((defaultValue?:any)=>BaseForge);
  bool: ((defaultValue?: boolean)=>BooleanForge);
  enumeration: ((defaultValue?: any)=>EnumForge);
  number: ((defaultValue?: number)=>NumberForge);
  int: ((defaultValue?: number)=>NumberForge);
  string: ((defaultValue?: string)=>StringForge);
  uid: ((defaultValue?: string)=>UidForge);
  obj: ((fields?: any, defaultValue?: any, fieldName?: string)=>ObjectForge)
};



EntityForge = {
  any: BaseForge.any,
  bool: BooleanForge.bool,
  enumeration: EnumForge.enumeration,
  number: NumberForge.number,
  int: NumberForge.int,
  string: StringForge.string,
  uid: UidForge.uid,
  obj: ObjectForge.obj
};

export * from './forge'
export * from './base-forge'
export * from "./boolean-forge";
export * from "./enum-forge";
export * from "./number-forge";
export * from "./string-forge";
export * from "./uid-forge";
export * from "./object-forge";

