import {BooleanGen} from "generate/index";
(function () {
  describe("BooleanGen", function () {

    it("Default generator should generate null about 1 in 1000 calls.", function () {
      let seed = 4
      Math.seedrandom(seed)
      let gen = new BooleanGen()
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
    it("Should generate true and false values.", function(){
      let gen = new BooleanGen().nullChance(1/3)
      let seed = 1
      Math.seedrandom(seed)

      let found = {'true': 0, 'false': 0, 'null': 0}
      let tries = 10
      while(tries--){
        let x = gen.gen()
        found[x + '']++
      }

      let find = [true, false, null]
      find.forEach((v)=>{
        expect(found[v + '']).toBeGreaterThan(0, "Should have found '" + v + "'")
      })
    })
  })
})()