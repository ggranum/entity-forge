import 'mocha';
import { expect } from 'chai';
import {IsIdentifierValidator} from "./identifier";


  describe("Validator > IsIdentifier", function () {

    let invalidIdentifiers = [
      "_-_",
      "1abc",
      "-10",
      "+sdfs",
      "\u200CHi",
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
      "ᾩ"
    ]

    it("Should provide error for invalid identifiers", function () {
      let foo = new IsIdentifierValidator()
      invalidIdentifiers.forEach((id) => {
        let x = foo.validate(id)
        expect(x).not.to.be.null //, `${id} should have been invalid.`)
      })
    })

    it("Should not provide error for valid identifiers", function () {
      let foo = new IsIdentifierValidator()
      validIdentifiers.forEach((id) => {
        let x = foo.validate(id)
        expect(x).to.be.null// `${id} should have been valid.`)
      })
    })

    describe("#arrayIndex", function () {
      it(" quoted numbers are valid array indices.", function () {
        let validArrayIds = [0, 1, 2, 3, 100, 0x99]
        let validator = new IsIdentifierValidator().arrayIndex()

        validArrayIds.forEach((id) => {
          let x = validator.validate('' + id)
          expect(x).to.be.null// "A quoted number should be valid as an array index: " + id)
        })
      })

      it(" should only allow numeric values", function () {
        let validator = new IsIdentifierValidator().arrayIndex()
        validIdentifiers.forEach((id) => {
          let x = validator.validate(id)
          expect(x).not.to.be.null//, `${id} should have been invalid as an array index.`)
        })
        let validArrayIds = [0, 1, 2, 3, 100, 0x99]
        validArrayIds.forEach((id) => {
          let x = validator.validate(id)
          expect(x).to.be.null//, "Id should have been valid as an array index: " + id)
        })
      })
    })

    describe("#objectKey", function () {

      let validUnquotedKeys: any[] = ["abc", 0, 1, "π", "var", "null"]
      let validQuotedKeys: any[] = ["foo bar", "foo-bar", "", '', null]

      it("allows valid unquoted values for property names / object keys", function () {
        let validator = new IsIdentifierValidator().objectKey()
        validUnquotedKeys.forEach((id) => {
          let x = validator.validate(id)
          expect(x).to.be.null//, "Id should have been valid as property key: " + id)
        })
      })

      it("does not allow invalid unquoted values for property names / object keys", function () {
        let validator = new IsIdentifierValidator().objectKey()
        validQuotedKeys.forEach((id) => {
          let x = validator.validate(id)
          expect(x).not.to.be.null//, `'${id}' is an invalid property key unless it's quoted.`)
        })
      })

      it("allows valid quoted values for property names / object keys", function () {
        let validator = new IsIdentifierValidator().objectKey().quoted()
        let allKeys: any[] = validQuotedKeys.concat(validUnquotedKeys)
        allKeys.forEach((id: any) => {
          let x = validator.validate(id)
          expect(x).to.be.null//, `${id} should have been treated as valid.`)
        })
      })
    })
  })
