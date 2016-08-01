import {Check} from "./check";

export class BooleanCheck extends Check {

  static boolean() {
    let v = new BooleanCheck()
    return v.isBoolean()
  }

  isBoolean() {
    this.restrictions.isBoolean = true
    return this
  }

  _doInit(): this {
    return this
  }
}







