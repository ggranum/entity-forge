

import {Forge} from "./forge";
import {BooleanForge} from "./boolean-forge";
import {EnumForge} from "./enum-forge";
import {NumberForge} from "./number-forge";
import {StringForge} from "./string-forge";
import {ObjectForge} from "./object-forge";


export let EntityForge = {
  any: Forge.any,
  bool: BooleanForge.bool,
  enumeration: EnumForge.enumeration,
  number: NumberForge.number,
  int: NumberForge.int,
  string: StringForge.string,
  obj: ObjectForge.obj

}