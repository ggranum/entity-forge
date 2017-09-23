import {StringGen} from "./string-gen";
import {MapGen} from "./map-gen";
import {PseudoRandom} from "./psuedo-random";

let keyGen = new StringGen().allowedChars("abcdefg123456".split('')).minLength(2).maxLength(3)
describe("Data Generation", function () {
  describe("MapGen", function () {

    it("Default generator should generate null about 1 in 1000 calls.", function () {
      let gen = new MapGen().of(new StringGen().minLength(2).maxLength(3))
        .keyedBy(keyGen)
        .minLength(1)
        .maxLength(2)
      let count = 0
      let seed = 2
      new PseudoRandom(seed).patchMath()
      for (let i = 0; i < 2500; i++) {
        let x = gen.gen()
        if (x === null) {
          count++
        }
      }
      expect(count).toBe(2)
    })
    it("should generate random string members when provided with a string generator as a child field.", function () {

      let stringGen = new StringGen().minLength(2).maxLength(5).notNull()
      let gen = new MapGen().of(stringGen).keyedBy(keyGen).minLength(2).maxLength(2)
      let seed = 4
      new PseudoRandom(seed).patchMath()

      let x = gen.gen()
      expect(Object.keys(x).length).toBe(2)

    })
  })
})


class TimedTest {

  count:number = 1000
  start:number
  end:number
  deltaT:number
  deltaTPerTest:number



  generator:MapGen

  perform(){
    this.setup()
    this.start = Date.now()
    for (let i = 0; i < this.count; i++) {
      this.testCase()
    }
    this.end = Date.now()
    this.deltaT = this.end - this.start
    this.deltaTPerTest = this.deltaT / this.count
    this.printResults()
  }


  printResults(){
    console.log("TimedTest", `Ran ${this.count} times in ${this.deltaT/1000} seconds ( ${this.deltaTPerTest} ms/execution)`)
  }


  setup(){
    this.generator = new MapGen().of(new StringGen().minLength(2).maxLength(3))
      .keyedBy(keyGen)
      .minLength(1)
      .maxLength(2)
    let seed = 4
    new PseudoRandom(seed).patchMath()
  }

  testCase(){
    let x = this.generator.gen()

  }

}



