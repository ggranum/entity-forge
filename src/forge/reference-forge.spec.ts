import 'mocha';
import { expect } from 'chai';
import {EF} from "./entity-forge";
import {PseudoRandom} from "../generate/psuedo-random";

describe('Forge', function () {
  describe('ReferenceForge', function () {

    let UserContact: any
    let User: any
    let HOUR = 1000*60*60
    let DAY = 24*HOUR
    let now = Date.now()

    beforeEach(function () {
      UserContact = EF.obj({
        uid: EF.uid(),
        name: EF.string().minLength(3).maxLength(255),
        surname: EF.string().maxLength(255),
        birthYear: EF.int(2016).min(1900).max(2100),
        address: EF.obj({
          line1: EF.string().minLength(10).maxLength(255),
          line2: EF.string().minLength(0).maxLength(255)
        })
      })
      User = EF.obj({
        uid: EF.uid(),
        email: EF.string().minLength(5).maxLength(255),
        name: EF.string().minLength(10).maxLength(25),
        created: EF.date().before(now + 10*DAY).after(now - 10*DAY ).initTo(Date.now()).notNull(),
        /** @todo: ggranum:  Implement references */
        // contact: EF.ref('/', UserContact).createIfAbsent()
      }).notNull()
    })

    describe("#newInstance ", function () {

      it("creates child references and stores them.", function () {

        new PseudoRandom(100).patchMath()
        for (let i = 0; i < 1; i++) {
          try {
            let user = User.newInstance()
            expect(user).to.be.ok // "Should create a user.")
            expect(user.name).to.be.null
            expect(user.email).to.be.null
            expect(user.uid.length).to.equal(20)
            expect(user.created).to.be.at.most(Date.now())
          } catch (e) {
            throw e
          }
        }

      })
    })

  })
})
