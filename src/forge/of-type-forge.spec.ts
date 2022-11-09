import 'mocha';
import { expect } from 'chai';
import {EF} from "./entity-forge";
import {PseudoRandom} from "../generate/psuedo-random";

describe('Forge', function () {
  describe('OfTypeForge', function () {

    beforeEach(function () {

    })

    describe("Composite Forge Objects", function () {

      it("initializes child forge field correctly when 'initTo' specified.", function () {
        let line1Val = "This is the default value for line one."
        let UserContactForge = EF.obj({
          name: EF.string().minLength(3).maxLength(255),
          surname: EF.string().maxLength(255),
          birthYear: EF.int(2016).min(1900).max(2100).notNull(),
          address: EF.obj({
            line1: EF.string().minLength(10).maxLength(255),
            line2: EF.string().minLength(0).maxLength(255)
          }).notNull().initTo({
            line1: line1Val
          })
        })

        let UserContact = UserContactForge.asNewable()

        let UserForge = EF.obj({
          uuid: EF.string().minLength(20).maxLength(20),
          email: EF.string().minLength(5).maxLength(255),
          name: EF.string().minLength(10).maxLength(25),
          contact: EF.ofType(UserContact).notNull().initTo(new UserContact())
        })
        let e: any
        let contact: any
        try {
          let User = UserForge.asNewable()
          let user = new User()
          contact = user.contact
          expect(contact.address).not.to.be.undefined // "Address should init to specified default value.")
          expect(contact.address.line1).to.equal(line1Val)
        } catch (error) {
          e = error
        }
        expect(e).to.be.undefined // "Exception should not have been thrown")
      })

    })


  })
})
