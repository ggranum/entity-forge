import {IsIdentifierValidator} from "validator/index";


(function () {
  describe("IsIdentifierValidator", function () {

    let invalidIdentifiers = [
      "1abc",
      "-10",
      "+sdfs",
      "\u200CHi",
      "_-_",
      " asdf",
      " ",
      "\t",
      "abc\t",
      "abc\t",
      "~asdf",
      "var",
      "let",
      "do",
      "const",
    ]

    let validIdentifiers = [
      "joe",
      "abc123",
      "$hello",
      "_hello",
      "_hello_$$$",
      "sadfasdf",
      // ahh, StackOverflow: http://stackoverflow.com/questions/1661197/what-characters-are-valid-for-javascript-variable-names
      "जावास्क्रिप्ट",
      "KingGeorgeⅦ",
      "ĦĔĽĻŎ",
      "〱〱〱〱",
      "ᾩ",

    ]

    it("Should provide error for invalid identifiers", function () {
      let foo = new IsIdentifierValidator()
      invalidIdentifiers.forEach((id)=> {
        let x = foo.validate(id)
        expect(x).not.toBe(null, "Id should have been invalid: " + id)
      })
    })

    it("Should not provide error for valid identifiers", function () {
      let foo = new IsIdentifierValidator()
      validIdentifiers.forEach((id)=> {
        let x = foo.validate(id)
        expect(x).toBe(null, "Id should have been valid: " + id)
      })
    })

    describe("#arrayIndex", function () {
      it(" quoted numbers are valid array indices.", function () {
        let validArrayIds = [0, 1,2,3, 100, 0x99]
        let validator = new IsIdentifierValidator().arrayIndex()

        validArrayIds.forEach((id)=> {
          let x = validator.validate('' + id)
          expect(x).toBe(null, "A quoted number should be valid as an array index: " + id)
        })
      })

      it(" should only allow numeric values", function () {
        let validator = new IsIdentifierValidator().arrayIndex()
        validIdentifiers.forEach((id)=> {
          let x = validator.validate(id)
          expect(x).not.toBe(null, "Id should have been invalid as an array index: " + id)
        })
        let validArrayIds = [0, 1,2,3, 100, 0x99]
        validArrayIds.forEach((id)=> {
          let x = validator.validate(id)
          expect(x).toBe(null, "Id should have been valid as an array index: " + id)
        })
      })
    })

    describe("#objectKey", function () {

      let validUnquotedKeys:any[] = ["abc", 0, 1, "π", "var", "null"]
      let validQuotedKeys:any[] = ["foo bar", "foo-bar", "", '', null]

      it("allows valid unquoted values for property names / object keys", function () {
        let validator = new IsIdentifierValidator().objectKey()
        validUnquotedKeys.forEach((id)=> {
          let x = validator.validate(id)
          expect(x).toBe(null, "Id should have been valid as property key: " + id)
        })
      })

      it("does not allow invalid unquoted values for property names / object keys", function () {
        let validator = new IsIdentifierValidator().objectKey()
        validQuotedKeys.forEach((id)=> {
          let x = validator.validate(id)
          expect(x).not.toBe(null, `'${id} is an invalid property key unless it's quoted.`)
        })
      })

      it("allows valid quoted values for property names / object keys", function () {
        let validator = new IsIdentifierValidator().objectKey().quoted()
        let allKeys:any[] = validQuotedKeys.concat(validUnquotedKeys)
        allKeys.forEach((id:any)=> {
          let x = validator.validate(id)
          expect(x).toBe(null, `${id} should have been treated as valid.`)
        })
      })
    })
  })
})()




