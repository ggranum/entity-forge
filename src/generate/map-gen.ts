import {DataGen} from "./data-gen";
import {uidGen} from "./uid-gen";
import {NumberGen} from "./number-gen";


export class MapGen extends DataGen {

  constructor() {
    super()
  }

  getDefaults(): any {
    return {
      notNull: false,
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
    this.restrictions.minLength = { value:value, inclusive:inclusive !== false  }
    return this
  }

  maxLength(value: number, inclusive?: boolean): this {
    this.restrictions.maxLength = { value:value, inclusive:inclusive !== false  }
    return this
  }


  gen() {
    let data: any = null
    if (!this._provideNull()) {
      let R = this.restrictions
      let elementCount = NumberGen.nextInt(R.minLength.value, R.maxLength.value, R.minLength.inclusive, R.maxLength.inclusive)

      data = {}
      for (let i = 0; i < elementCount; i++) {
        data[R.keyedBy.gen()] = R.of.gen()
      }
    }
    return data
  }

}



