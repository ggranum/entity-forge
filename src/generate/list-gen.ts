import {DataGen} from "./data-gen";


export class ListGen extends DataGen {
  private fields:any = {}

  constructor(cfg?:any ) {
    super(cfg)
  }

  getDefaults():any{
    return {
      notNull: false,
      arrayLike: false,
      of: null,
      minLength: {
        value:0,
        inclusive: true
      },
      maxLength: {
        value:100,
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
  of(type:DataGen){

  }

  gen() {
    let data = super.gen()
    if (data !== null) {
      data = this._doGen()
    }
    return data
  }

  _doGen() {
  }



}



