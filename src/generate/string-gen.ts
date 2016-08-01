import {DataGen} from "./data-gen";
import {StringRestrictions, StringRestrictionDefaults} from "validator/index";


export class StringGen extends DataGen {

  restrictions:StringRestrictions

  constructor(cfg:StringRestrictions = null) {
    super(cfg, StringRestrictionDefaults)
  }

  allowedCodePoints(codePointRanges:number[]) {
    this.restrictions.allowedCodePoints = codePointRanges
    return this
  }

  gen() {
    let data = super.gen()
    if (data !== null) {
      let { start, range} = this._range()
      let charCount = start + Math.floor(Math.random() * range)
      data = []
      for (let i = 0; i < charCount; i++) {
        data[i] = this._generateChar()
      }
      data = data.join('')
    }
    return data
  }

  private _range():{start:number, range:number}{
    let range:number
    let {value: max, inclusive: maxI} = this.restrictions.maxLength
    let {value: min, inclusive: minI} = this.restrictions.minLength
    if(maxI === false){
      max--
    }
    if(minI === false){
      min++
    }
    range = max - min
    return {start: min, range:range}
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
Object.assign(StringGen.prototype, StringRestrictionDefaults)



