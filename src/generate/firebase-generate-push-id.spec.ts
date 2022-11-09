import 'mocha';
import { expect } from 'chai';
import {generatePushID} from "./firebase-generate-push-id";

xdescribe("Data Generation", function () {

  describe("generatePushID", function () {
    it('Should get some actual tests', () => {
      expect(true).to.equal(true);
    })


    // it("generates reproducibly random values if the time is fixed", function () {
    //   let seed = 100
    //   seedrandom('' + seed)
    //
    //   let x = new Array(100)
    //   for (let i = 0; i < x.length; i++) {
    //     x[i] = generatePushID()
    //   }
    //
    //   seedrandom('' + seed)
    //   for (let i = 0; i < x.length; i++) {
    //     expect(x[i]).toEqual(generatePushID())
    //   }
    //
    // })

  })
})
