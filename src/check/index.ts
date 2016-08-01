import {Check} from "./check";
import {ArrayCheck} from "./array-check";
import {BooleanCheck} from "./boolean-check";
import {StringCheck} from "./string-check";
import {NumberCheck} from "./number-check";

let Checks: {any: (()=>Check); array: (()=>ArrayCheck); boolean: (()=>BooleanCheck); string: (()=>StringCheck); number: (()=>NumberCheck); int: (()=>NumberCheck)} = {
  any: Check.any,
  array: ArrayCheck.array,
  boolean: BooleanCheck.boolean,
  string: StringCheck.string,
  number: NumberCheck.number,
  int: NumberCheck.int,
}

export {Checks, Check, ArrayCheck, BooleanCheck, StringCheck, NumberCheck}
export * from './constraint'