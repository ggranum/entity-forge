"use strict"
import {DataGen} from "./data-gen";
import {StringRestrictions} from "../validation/restriction/restriction";


export class StringGen extends DataGen {
  constructor(cfg:any = null) {
    super(cfg, StringRestrictions)
  }

  allowCodePoints(codePointRanges:number[]) {
    this.restrictions.allowedCodePoints = codePointRanges
    return this
  }

  gen() {
    let data = super.gen()
    if (data !== null) {
      let range = this.restrictions.maxLength - this.restrictions.minLength
      let charCount = this.restrictions.minLength + Math.floor(Math.random() * range)
      data = ""
      for (let i = 0; i < charCount; i++) {
        data += this._generateChar()
      }
    }
    return data
  }

  _generateChar() {
    let rand = Math.random()
    let allowedCount = 0
    let L = this.restrictions.allowedCodePoints.length
    let pointers:number[] = []
    for (let i = 0; i < L; i += 2) {
      allowedCount += this.restrictions.allowedCodePoints[i + 1] - this.restrictions.allowedCodePoints[i] + 1
      pointers.push(allowedCount)
    }
    let choiceIndex = Math.floor(rand * allowedCount)
    let randomCodePoint:number
    for (let i = 0; i < pointers.length; i++) {
      if (choiceIndex < pointers[i]) {
        let randomRangeMin = this.restrictions.allowedCodePoints[i * 2]
        let correction = i > 0 ? pointers[i - 1] : 0
        randomCodePoint = choiceIndex - correction + randomRangeMin
        break
      }
    }
    return String.fromCodePoint(randomCodePoint)
  }
}
Object.assign(StringGen.prototype, StringRestrictions)



