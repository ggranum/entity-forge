import {BooleanGen} from "generate/index";


describe("Data Generation", function () {
  describe("Boolean", function () {

    /**
     */
    it("Should generate true and false values.", function () {
      let gen = new BooleanGen().nullChance(1 / 3)
      let seed = 1
      Math.seedrandom(seed)

      let found = {'true': 0, 'false': 0, 'null': 0}
      let tries = 10
      while (tries--) {
        let x = gen.gen()
        found[x + '']++
      }

      let find = [true, false, null]
      find.forEach((v)=> {
        expect(found[v + '']).toBeGreaterThan(0, "Should have found '" + v + "'")
      })
    })
  })
})
