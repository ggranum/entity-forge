import {EntityForge} from "./index";
import {Strings} from "@entityforge/validator";
import {DataGen} from "@entityforge/generate";
(function() {
  let EF = EntityForge


  describe('StringForge', function () {
    beforeEach(function () {
    });

    it('accepts null by default', function () {
      let model = {
        foo: EF.string()
      }
      let result = model.foo.validate(null)
      expect(result).toBeNull()
    });

    it('is valid when no constraints and is string, character or null', function () {
      let validValues = [
        null,
        "null",
        "undefined",
        "",
        "\n",
        "abc",
        "123",
        "Sort of a long value to test, but not really all that long. \n Etc."
      ]
      let model = {
        foo: EF.string()
      }
      validValues.map((value)=> {
        expect(model.foo.validate(value)).toBeNull()
      })
    });

    it('is valid when minLength set and value is valid', function () {
      let model = {
        foo: EF.string().minLength(4)
      }
      let result = model.foo.validate("abcdef")
      expect(result).toBeNull()
    });

    it('is valid when maxLength set and value is valid', function () {
      let model = {
        foo: EF.string().maxLength(10)
      }
      let result = model.foo.validate("abcdef")
      expect(result).toBeNull()
    });

    it('is valid when minLength and maxLength are set and value is valid', function () {
      let model = {
        foo: EF.string().minLength(5).maxLength(10)
      }
      let result = model.foo.validate("12345")
      expect(result).toBeNull()
    });

    it('minLength is inclusive', function () {
      let model = {
        foo: EF.string().minLength(5)
      }
      expect(model.foo.validate("12345")).toBeNull()
      expect(model.foo.validate("1234")).toBeDefined()
    });

    it('maxLength is inclusive', function () {
      let model = {
        foo: EF.string().maxLength(5)
      }
      expect(model.foo.validate("12345")).toBeNull()
      expect(model.foo.validate("123456")).toBeDefined()
    });

    it('handles minLength == maxLength', function () {
      let model = {
        foo: EF.string().minLength(5).maxLength(5)
      }
      expect(model.foo.validate("12345")).toBeNull()
      expect(model.foo.validate("123456")).toBeDefined()
      expect(model.foo.validate("1234")).toBeDefined()
    });

    it('Provides error when value is a number.', function () {
      let model = {
        foo: EF.string()
      }
      let result = model.foo.validate(100)
      expect(result).toBeDefined()
    });

    it('Provides error when value is an object.', function () {
      let model = {
        foo: EF.string()
      }
      let result = model.foo.validate({"asdfasdf": "Asdfsd"})
      expect(result).toBeDefined()
    });


    it('Provides error when value is a function.', function () {
      let model = {
        foo: EF.string()
      }
      let result = model.foo.validate(()=> {
        return "a string";
      })
      expect(result).toBeDefined()
    });

    it('Allows null value by default.', function () {
      let model = {
        foo: EF.string().minLength(4)
      }
      let result = model.foo.validate(null)
      expect(result).toBeNull()

    });

    it('is invalid when minLength set and value is a string and is too short', function () {
      let model = {
        foo: EF.string().minLength(4)
      }
      let result = model.foo.validate("abc")
      expect(result).toBeDefined()
      expect(result.minLength).toBeDefined()
    });


  })


  describe('StringForge.string.accessors', function () {

    it('handles minLength == maxLength on set operation', function () {
      let Model = EF.obj({
        name: EF.string().minLength(5).maxLength(5)
      }).asNewable()
      let model = new Model()
      let e:any = null
      try {
        model.name = "1234"
      } catch (error) {
        e = error
      }
      expect(model.name).toBe(null)
      expect(e).not.toBe(null)
    });
  })


  describe('EntityForge.string.generate', function () {

    it('generates random strings', function () {
      let forge = EF.string().notNull().minLength(25).maxLength(50).allowedCodePoints(Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII)
      let ex = forge.gen()
      expect(ex).toBeDefined()
      expect(ex.length).toBeGreaterThan(24)
      expect(ex.length).toBeLessThan(51)
    })

    /**
     * This test requires Math.seedrandom: https://github.com/davidbau/seedrandom
     */
    it('is reproducibly random', function () {
      expect(Math.seedrandom).toBeDefined("This test requires Math.seedrandom: see https://github.com/davidbau/seedrandom")
      let forge = EF.string().notNull().minLength(25).maxLength(50).allowedCodePoints(Strings.COMMON_UTF_RANGES.PRINTABLE_ASCII)
      Math.seedrandom(100)
      let first:DataGen[] = []
      first.push(forge.gen(), forge.gen(), forge.gen())

      Math.seedrandom(100)
      let second:DataGen[] = []
      second.push(forge.gen(), forge.gen(), forge.gen())

      Math.seedrandom(101)
      let third:DataGen[] = []
      third.push(forge.gen(), forge.gen(), forge.gen())

      for (let i = 0; i < first.length; i++) {
        expect(first[i]).toBe(second[i])
        expect(first[i]).not.toBe(third[i])
      }
    })

  })

})()