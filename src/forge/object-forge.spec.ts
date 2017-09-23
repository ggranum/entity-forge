import {EF} from "@entity-forge/forge";
import * as seedrandom from "seedrandom";

describe('Forge', function () {
  describe('ObjectForge', function () {

    let UserContactForge: any
    let UserForge: any

    beforeEach(function () {
      UserContactForge = EF.obj({
        name: EF.string().minLength(3).maxLength(255),
        surname: EF.string().maxLength(255),
        birthYear: EF.int(2016).min(1900).max(2100),
        address: EF.obj({
          line1: EF.string().minLength(10).maxLength(255),
          line2: EF.string().minLength(0).maxLength(255)
        })
      })

      UserForge = EF.obj({
        uuid: EF.string().minLength(20).maxLength(20),
        email: EF.string().minLength(5).maxLength(255),
        name: EF.string().minLength(10).maxLength(25)
      })
    })


    describe("Generate", function () {

      let HOUR = 1000*60*60
      let DAY = 24*HOUR

      it("can generate a simple model instance.", function () {
        let now = Date.now()
        try {
          UserForge = EF.obj({
            uid: EF.uid(),
            email: EF.string().minLength(5).maxLength(255).ascii().notNull(),
            name: EF.string().minLength(10).maxLength(25).ascii().notNull(),
            created: EF.date().before(now + 10*DAY).after(now - 10*DAY ).notNull()
          }).notNull()
        } catch (e) {
          console.log(e)
          throw e
        }
        seedrandom('' + 100)
        for (let i = 0; i < 100; i++) {
          try {
            let user = UserForge.gen()
            expect(user).toBeDefined() // "Should create a user.")
            expect(user.name).toBeDefined() // "Name field not generated: " + i)
            expect(user.uid).toBeDefined() // "uid field not generated: " + i)
            expect(user.email).toBeDefined() // "Email field not generated: " + i)
            expect(user.uid.length).toBe(20)
            expect(user.name.length).toBeGreaterThan(9)
            expect(user.name.length).toBeLessThan(26)
            expect(user.created).toBeLessThan(now + 10*DAY)
            expect(user.created).toBeGreaterThan(now - 10*DAY)
          } catch (e) {
            console.log(i, e)
            throw e
          }
        }

      })
    })


    describe('#asNewable', function () {
      it('allows valid values', function () {
        let User = UserForge.asNewable()
        let u = new User()
        u.uuid = "-JhLeOlGIEjaIOFHR0xd"
        u.email = "bob@vila.com"
        u.name = "0123456789"
        expect(u.uuid).toBe("-JhLeOlGIEjaIOFHR0xd")
      })

      it('Should validate when created using a default.', function () {

        let defaultName = "defaultName"
        let UserContact = UserContactForge.initTo(
          {
            name: defaultName
          }
        ).asNewable()

        let uc = new UserContact()
        let e: any = null
        try {
          uc.name = "aa"
        } catch (error) {
          e = error
        }
        expect(e).toBeDefined() // "Exception should have been thrown")
        expect(uc.name).toBe(defaultName)

      })

      it("validates child objects set using '='", function () {
        let UserContact = UserContactForge.asNewable()
        let contact = new UserContact()
        let e: any
        try {
          contact.address = {
            line1: "bob",
            line2: "this is line two."
          }
        } catch (error) {
          e = error
        }
        expect(e).toBeDefined() // "Exception should have been thrown")
        console.log(contact, e)
      })

      it("does not allow setting child to null when notNull specified.", function () {
        let line1Val = "This is the default value for line one."
        let UserContactForge = EF.obj({
          name: EF.string().minLength(3).maxLength(255),
          surname: EF.string().maxLength(255),
          birthYear: EF.int(2016).min(1900).max(2100),
          address: EF.obj({
            line1: EF.string().minLength(10).maxLength(255),
            line2: EF.string().minLength(0).maxLength(255)
          }).notNull().initTo({
            line1: line1Val
          })
        })
        let e: any
        let contact: any
        try {
          let UserContact = UserContactForge.asNewable()
          contact = new UserContact()
          expect(contact.address).toBeDefined() // "Address should init to specified default value.")
          expect(contact.address.line1).toBe(line1Val)
          contact.address = null
        } catch (error) {
          e = error
        }
        expect(e).toBeDefined() // "Exception should have been thrown")
        console.log(contact, e)
      })
    })

    describe("Composite Objects", function () {

      it("initializes child objects correctly when 'initTo' specified.", function () {
        let line1Val = "This is the default value for line one."
        let UserContactForge = EF.obj({
          name: EF.string().minLength(3).maxLength(255),
          surname: EF.string().maxLength(255),
          birthYear: EF.int(2016).min(1900).max(2100),
          address: EF.obj({
            line1: EF.string().minLength(10).maxLength(255),
            line2: EF.string().minLength(0).maxLength(255)
          }).notNull().initTo({
            line1: line1Val
          })
        })
        let e: any
        let contact: any
        try {
          let UserContact = UserContactForge.asNewable()
          contact = new UserContact()
          expect(contact.address).toBeDefined() // "Address should init to specified default value.")
          expect(contact.address.line1).toBe(line1Val)
        } catch (error) {
          console.error(error)
          e = error
        }
        expect(e).toBeUndefined() // "Exception should not have been thrown")
      })

      it("Validates child objects after setting the child to a raw POJO.", function () {
        let line1Val = "This is the default value for line one."
        let pojoAddress = {
          line1: "This is the new line 1."
        }

        let UserContactForge = EF.obj({
          name: EF.string().minLength(3).maxLength(255),
          surname: EF.string().maxLength(255),
          birthYear: EF.int(2016).min(1900).max(2100),
          address: EF.obj({
            line1: EF.string().minLength(10).maxLength(255).notNull(),
            line2: EF.string().minLength(0).maxLength(255)
          }).notNull().initTo({
            line1: line1Val
          })
        })
        let e: any
        let contact: any
        try {
          let UserContact = UserContactForge.asNewable()
          contact = new UserContact()

          contact.address = Object.assign({}, pojoAddress)
          expect(contact.address.line1).toBe(pojoAddress.line1)

          // setting address line 1 to null should fail:
          contact.address.line1 = null
        } catch (error) {
          e = error
        }
        expect(contact.address.line1).toBe(pojoAddress.line1) // , "Value should have been reset to previous.")
        expect(e).toBeDefined() // "Exception should have been thrown")
      })
    })
  })
})