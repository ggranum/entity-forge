import {EF} from "./entity-forge";
import {PseudoRandom} from "../generate/psuedo-random";

describe('Forge', function () {
  describe('AppForge', function () {

    let App: any
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
      }, null, "UserContact")
      User = EF.obj({
        uid: EF.uid(),
        email: EF.string().minLength(5).maxLength(255),
        name: EF.string().minLength(10).maxLength(25),
        created: EF.date().before(now + 10*DAY).after(now - 10*DAY ).initTo(Date.now()).notNull(),
        /** @todo: ggranum: Implement ref */
        // contact: EF.ref('/contacts/', UserContact).createIfAbsent()
      }, {}, "User").notNull()

      App = EF.app({
        contacts: EF.map().of(UserContact).keyedBy('uid'),
        users: EF.map().of(User)

      } )
    })




      // it("Throws an error if member created before App..", function () {})
      it("creates child references and stores them.", function () {

        new PseudoRandom(100).patchMath()

        for (let i = 0; i < 1; i++) {
          try {
            let app = App.newInstance()

            let user = User.newInstance()
            expect(user).toBeTruthy() // "Should create a user."
            expect(user.name).toBeNull() // 'name'
            expect(user.email).toBeNull() //'email'
            expect(user.uid.length).toBe(20)
            expect(user.created).toBeLessThan(Date.now()) //, 'created'
            // expect(user.contact).toBeTruthy('contact')

            // let x = App._resolver.resolve('/contacts/' + user.contact)
            // console.log(user.toJsonString())
          } catch (e) {
            console.log(i, e)
            throw e
          }
        }

      })
    })

})