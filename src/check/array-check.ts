"use strict"
import {Check} from "./check";
import {Validators,MaxSizeValidator, MinSizeValidator} from "../validation/index";

export class ArrayCheck extends Check {

  static array():ArrayCheck{
    let v = new ArrayCheck()
    v.add(Validators.isArray, Validators.exists)
    return v
  }

  maxSize(max:number, inclusive:boolean = true):ArrayCheck {
    this.add(new MaxSizeValidator(max, inclusive), Validators.isArray, Validators.exists)
    return this
  }

  minSize(min:number, inclusive:boolean = true):ArrayCheck {
    this.add(new MinSizeValidator(min, inclusive), Validators.isArray, Validators.exists)
    return this
  }

}