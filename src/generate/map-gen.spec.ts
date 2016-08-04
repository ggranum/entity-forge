import {IdentifierGen, MapGen, StringGen} from "generate/index";


(function () {
  describe("MapGen", function () {

    it("Default generator should generate null about 1 in 1000 calls.", function () {
      let gen = new MapGen().of(new StringGen().minLength(2).maxLength(3))
        .keyedBy(new IdentifierGen())
        .minLength(1)
        .maxLength(2)
      let count = 0
      let seed = 4
      Math.seedrandom(seed)
      for (let i = 0; i < 10000; i++) {
        let x = gen.gen()
        if (x === null) {
          count++
        }
      }
      expect(count).toBe(11)
    })
    it("should generate random string members when provided with a string generator as a child field.", function () {

      let stringGen = new StringGen().minLength(2).maxLength(5).notNull()
      let gen = new MapGen().of(stringGen).keyedBy(new IdentifierGen()).minLength(2).maxLength(2)
      let seed = 4
      Math.seedrandom(seed)

      let x = gen.gen()
      expect(Object.keys(x).length).toBe(2)

    })
  })
})()