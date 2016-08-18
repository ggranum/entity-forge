import {DataGen} from "./data-gen";
import {uidGen} from "./uid-gen";
import {NumberGen} from "./number-gen";
import {
  MaxLengthRestriction,
  MinLengthRestriction,
  MaxLengthRestrictionFluent,
  MinLengthRestrictionFluent
} from "validator/index";
import {BaseGen} from "./base-gen";
import {Forge,ObjectRestrictions, ObjectRestrictionsFluent} from "forge/index";


export interface MapRestrictions extends ObjectRestrictions, MinLengthRestriction, MaxLengthRestriction {
  of: DataGen|Forge
  keyedBy: DataGen|string
  arrayLike: boolean
}

export interface MapRestrictionsFluent extends ObjectRestrictionsFluent,
  MinLengthRestrictionFluent,
  MaxLengthRestrictionFluent {
  of(type: Forge|DataGen): this
  keyedBy(keyGen: string|DataGen): this
}

export class MapGen extends BaseGen implements MapRestrictionsFluent {

  restrictions: MapRestrictions

  constructor() {
    super()
  }

  getDefaults(): MapRestrictions {
    return {
      notNull: false,
      isOneOf: null,
      fields: null,
      arrayLike: false,
      of: null,
      keyedBy: uidGen,
      minLength: {
        value: 0,
        inclusive: true
      },
      maxLength: {
        value: 100,
        inclusive: false
      }
    }
  }

  /**
   * Set the type of this list, and optionally provide a generator definition for creating keys.
   *
   * If _keyedBy_ is provided, a key will be generated for each entry, and the value provided by _type#gen_ will be
   * set using _foo = {}; foo[keyedBy.gen()] = type.gen();
   */
  of(type: DataGen): this {
    this.restrictions.of = type
    return this
  }

  keyedBy(keyGen: DataGen): this {
    this.restrictions.keyedBy = keyGen
    return this
  }


  minLength(value: number, inclusive?: boolean): this {
    this.restrictions.minLength = {value: value, inclusive: inclusive !== false}
    return this
  }

  maxLength(value: number, inclusive?: boolean): this {
    this.restrictions.maxLength = {value: value, inclusive: inclusive !== false}
    return this
  }


  fields(value: any): this {
    this.restrictions.fields = value
    return this
  }


  doGen(R?: MapRestrictions) {
    let data: any = null
    let elementCount = NumberGen.nextInt(R.minLength.value, R.maxLength.value, R.minLength.inclusive, R.maxLength.inclusive)
    data = {}
    for (let i = 0; i < elementCount; i++) {
      let dataGen:DataGen = <DataGen>R.keyedBy
      data[dataGen.gen()] = R.of.gen()
    }
    return data
  }

}



