import {StringGen} from "generate/index";


describe("Data Generation", function(){
  describe("StringGen", function () {

    it("Default generator should generate null about 1 in 1000 calls.", function () {

      let seed = 5
      Math.seedrandom(seed)
      let gen = new StringGen()
      let count = 0
      for (let i = 0; i < 10000; i++) {
        let x = gen.gen()
        if (x === null) {
          count++
        }
      }
      expect(count).toBe(11)
    })

    /**
     */
    it("Should generate a string exactly 20 characters long.", function(){
      let cfg = {minLength: {value:20}, maxLength:{value:20}, notNull: true}
      let gen = new StringGen().applyRestrictions(cfg)
      let s = gen.gen()
      expect(s).toBeDefined()
      expect(s.length).toEqual(20)
    })
  })
})