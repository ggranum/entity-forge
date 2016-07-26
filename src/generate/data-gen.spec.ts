import {DataGen} from "./data-gen";

(function () {
  describe("DataGen", function(){

    it("Default generator should generate null", function(){
      let seed = 4
      Math.seedrandom(seed)
      let gen = new DataGen()
      let count = 0
      for (let i = 0; i < 10000; i++) {
        let x = gen.gen()
        if(x === null){
          count++
        }
      }
      expect(count).toBe(11)
    })
  })
})()