import {EnumGen} from "generate/index";
(function () {
  let someEnumValues = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"]
  describe("EnumGen", function () {

    it("Default generator should generate null about 1 in 1000 calls.", function () {
      let seed = 4
      Math.seedrandom(seed)

      let gen = new EnumGen().values(someEnumValues)
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
    it("Should generate all values in the enumeration.", function(){
      let gen = new EnumGen().nullChance( 1/(someEnumValues.length)).values(someEnumValues)
      let seed = 1
      Math.seedrandom(seed)

      let found = {'null': 0}
      someEnumValues.forEach((value)=>{
        found[value] = 0
      })
      let tries = someEnumValues.length * 10
      while(tries--){
        let x = gen.gen()
        found[x + '']++
      }

      let find = Object.keys(found)
      find.forEach((v)=>{
        expect(found[v + '']).toBeGreaterThan(0, "Should have found '" + v + "'")
      })
    })
  })
})()


