
import {StringValidator} from "./string-validator";

describe("Validators", function () {

  describe('String', function () {
    let validStrings = ["", "bob", "1", "0.00", "null", 'asfasdfdsfasdfwewefwefdgdag239823894 \n asdfasdf']

    describe('Defaults', function () {

      let c = new StringValidator()
      validStrings.forEach((v)=> {
        it(`Is valid if input is ${v}.`, function () {
          try {
            let result = c.validate(v)
            expect(result).toBeNull()
          } catch (e) {
            expect(e).toBeNull()
            fail(e);
          }
        })
      })
    })

    describe('MinLength', function(){
        it(`Is valid if length > minLength`, function(){
          let v = new StringValidator().minLength(3)
          expect(v.validate("abcd")).toBeNull()
        })

      it(`Is valid if length == minLength when inclusive (default)`, function(){
        let v = new StringValidator().minLength(3)
        expect(v.validate("abc")).toBeNull()
      })

      it(`Is invalid if length == minLength when inclusive=false`, function(){
        let v = new StringValidator().minLength(3, false)
        let result = v.validate("abc")
        expect(result).not.toBeNull()
        expect(result['minLength']).not.toBeNull()
      })

      it(`Is invalid if length < minLength`, function(){
        let v = new StringValidator().minLength(3)
        let result = v.validate("ab")
        expect(result).not.toBeNull()
        expect(result['minLength']).not.toBeNull()
      })
    })

    describe('MaxLength', function(){
      it(`Is valid if length < maxLength`, function(){
        let v = new StringValidator().maxLength(3)
        expect(v.validate("ab")).toBeNull()
      })

      it(`Is valid if length == maxLength when inclusive (default)`, function(){
        let v = new StringValidator().maxLength(3)
        expect(v.validate("abc")).toBeNull()
      })

      it(`Is invalid if length == maxLength when inclusive=false`, function(){
        let v = new StringValidator().maxLength(3, false)
        let result = v.validate("abc")
        expect(result).not.toBeNull()
        expect(result['maxLength']).not.toBeNull()
      })

      it(`Is invalid if length > maxLength`, function(){
        let v = new StringValidator().maxLength(3)
        let result = v.validate("abcd")
        expect(result).not.toBeNull()
        expect(result['maxLength']).not.toBeNull()
      })
    })

  })
})