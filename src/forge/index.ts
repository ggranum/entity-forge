import {Forge} from "./forge";
import {BooleanForge} from "./boolean-forge";
import {EnumForge} from "./enum-forge";
import {NumberForge} from "./number-forge";
import {StringForge} from "./string-forge";
import {ObjectForge} from "./object-forge";


export let EntityForge: {any: (()=>Forge); bool: ((defaultValue?: boolean)=>BooleanForge);
  enumeration: ((defaultValue?: any)=>EnumForge); number: ((defaultValue?: number)=>NumberForge); int: ((defaultValue?: number)=>NumberForge); string: ((defaultValue?: string)=>StringForge); obj: ((fields?: any, defaultValue?: any, fieldName?: string)=>ObjectForge)} = {
  any: Forge.any,
  bool: BooleanForge.bool,
  enumeration: EnumForge.enumeration,
  number: NumberForge.number,
  int: NumberForge.int,
  string: StringForge.string,
  obj: ObjectForge.obj

}