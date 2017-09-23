import {StringGen} from "@entity-forge/generate";


describe("Data Generation", function(){
  describe("StringGen", function () {

    it("Default generator should generate null about 1 in 1000 calls.", function () {

      let r = Math.floor(100*Math.random());
      expect(r).toEqual(19)
      let gen = new StringGen()
      let count = 0
      for (let i = 0; i < 10000; i++) {
        let x = gen.gen()
        if (x === null) {
          count++
        }
      }
      expect(count).toBeGreaterThan(1)
      expect(count).toBeLessThan(15)
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