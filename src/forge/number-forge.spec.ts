import {expect} from 'chai';
import 'mocha';
import {PseudoRandom} from "../generate/psuedo-random";
import {EF} from "./entity-forge";


describe('Number Forge', function () {
  describe('NumberForge #int', function () {
    beforeEach(function () {
      new PseudoRandom(4).patchMath()
    });

    it('Allows null values by default', function () {
      let Model = EF.obj({
        foo: EF.int()
      }).asNewable()
      let m = new Model()
      let error: any = null
      try {
        m.foo = null
      } catch (e) {
        error = e
      }
      expect(error).to.be.null //"Null is allowed, an error should not be thrown.")
      expect(m.foo).to.be.null//, "Value should now be null.")
    });

    it('Does not allow null values when notNull set', function () {
      let Model = EF.obj({
        foo: EF.int().notNull()
      }).asNewable()
      let m = new Model()
      let error: any = null
      try {
        m.foo = null
      } catch (e) {
        error = e
      }
      expect(error).not.to.be.undefined
      expect(m.foo).to.equal(0)//, "Value should be reset to previous value (default).")
    });

    it('Does not allow non-numeric values', function () {
      let model = {
        foo: EF.int()
      }
      let disallowed: any = ['1', 1.001, "bob", ((x: any) => false), model];
      for (let i = 0; i < disallowed.length; i++) {
        let result = model.foo.validate(disallowed[i])
        expect(result).to.be.ok//"The value '" + disallowed[i] + "' should not be allowed.")
        expect(result!['isNumber'] || result!['isInt']).not.to.be.undefined //disallowed[i] + " should not be allowed.")
      }
    });

    describe('#gen', function () {

      it('Generates random integers', function () {
        let forge = EF.int()
        let ex = forge.gen()
        expect(ex).not.to.be.undefined
      })

      it('Generates null integers when null values allowed: ', function () {
        let forge = EF.int().min(0).max(3)
        new PseudoRandom(100).patchMath()
        let values = [0, 1, 2, 3, null]

        let found: any = {}
        values.forEach((value) => {
          found[value + ''] = 0
        })
        let tries = values.length * 5
        forge.ignite()
        forge._generatedBy.nullChance(1 / (values.length))
        while (tries--) {
          let x = forge.gen()
          found[x + '']++
        }
        Object.keys(found).forEach((v) => {
          expect(found[v + '']).to.be.above(0)//, "Should have generated all values. Missed: '" + v + "'")
        })
      })

      it('Does not generate null ints when null values are not allowed: ', function () {
        let forge = EF.int().min(0).max(3).notNull()
        let ex: any
        let generatedNull = false
        for (let i = 0; i < 10000; i++) {
          ex = forge.gen()
          if (ex === null) {
            generatedNull = true
            break
          }
        }
        expect(generatedNull).to.equal(false)//, "Should not generate null values")
      })

    })

  })


  it('is just showing stuff', () => {


    // let mean = (ary: number[]): number => {
    //   const sum = ary.reduce((prev, val) => prev + val, 0);
    //   return sum / ary.length;
    // }
    //
    // let average = (ary: number[], avgMethod: (ary: number[]) => number) => {
    //   return avgMethod(ary);
    // }

    // console.log('Average is', average([1, 2, 3, 4, 5], mean));
    //
    // const names: NamePair[] = [
    //   {first: 'Bob', last: 'Vila'},
    //   {first: 'Stan', last: 'Jones'},
    //   {first: 'Sue', last: 'Smith'},
    //   {first: 'Sally', last: 'James'},
    //   {first: 'Anthony', last: 'Java'},
    // ];


    const mappedNames = names
      .filter(entry => entry.first.length > 3)
      .filter(entry => entry.first.startsWith('S'))
      .map(name => name.first + ' ' + name.last);

    console.log('mappedNames', mappedNames);
    //last name starts with J and map it to last, fist


    const mappedNames2 = names
      .filter(entry => entry.last.startsWith('J'))
      .map(entry => entry.last + ',' + entry.first)

    console.log('mappedNames2', mappedNames2);

    const mappedNames3 = names

      .filter(entry => !entry.last.startsWith('J'))
      .filter(entry => !entry.last.startsWith('K'))
      .filter(entry => !entry.last.startsWith('A'))
      .filter(entry => !entry.last.startsWith('E'))
      .map(entry => entry.last + ', ' + entry.first)

    console.log('mappedNames3', mappedNames3.length, mappedNames3);


    // // k, j,a remove last names
    const regex = /^.*[A-Za-z]/;
    const bob = lines
      .filter(line => !regex.test(line))
      .map(line => line.replace('\t',','))
      .map(line => line.split(','))
      .map(numberStrings => numberStrings.map(numberString => parseFloat(numberString)))

    console.log('bob', bob.length, bob);


  });


})


const lines:string[] = [
  '872.1850567006162, 5157.935411490144	4918.669258800363, 7068.112210603122',
  '4451.3300674762, 882.4252146936562	8049.0024825500495, 9399.830293404275',
  '8918.542480834423, 7500.603619818109	9166.16436488049, 9720.821927959656',
  '418.21853741756064, 8155.953190191176	1224.274841616324, 6682.497766656459',
  '5760.826164480628, 4259.41896368043	1795.7851627426135, 496.13631764998',
  '867.8883642649771, 3310.2110548402065	9237.01160869719, 8772.17386068211',
  '5704.261386542082, 5551.285562532747	3555.160604305505, 8606.355237725717',
  '1452.2492671899622, 4231.818206203116	4143.815224050675, 2074.00599795313',
  'Some random text with 2.5892113541241324 numbers in it 65.28626081947439 ',
  '8384.812302330294, 3017.0996289210116	4114.189041788428, 6455.74869215175',
  '3112.6626355642384, 8396.24028767243	3170.878685736254, 6418.861327400687',
  'Some random text with 86.01510072611818 numbers in it 16.585541295454263 ',
  '6363.864885826629, 6304.158013732211	7137.200296309993, 574.9659030341214',
  '6245.922894131557, 1946.076597959776	8913.36353844258, 6124.251805048441',
  'Some random text with 49.696515777507734 numbers in it 88.41650054974312 ',
  '5330.459883527843, 2173.78922658501	8690.554283544496, 5262.317522200028',
  '7282.131275386228, 1179.755668775937	6885.073561497319, 7368.134093835368',
  '6042.8591721429, 6961.017504507292	4132.884854691068, 9722.275442924014',
  '242.76348040666696, 9490.433620070087	3363.7112066483055, 2584.7838966099857',
  '6960.1444953687915, 669.8443642126883	4891.472874104499, 831.6175206881015',
  '8125.894944582055, 3362.064168781229	5183.148364431804, 5227.684633622036',
  '1388.4074165446568, 3082.3530490751905	3623.3987586944872, 5712.493096023756',
  '808.7854706916331, 8364.956493548349	486.982077702105, 352.4602659670295',
  '1578.8505774597827, 8183.0152272813	8415.587749678198, 3667.6293223772527',
  '5620.127368604369, 8431.199881464667	4441.0588406475445, 2396.432635238326',
  '2487.8409342878995, 2753.1210210040126	3254.0502353505694, 4173.893792553556',
  '9508.372733936769, 2688.0711675655775	666.0386926647832, 5355.924690103347',
  '3586.1815639837037, 5968.4684345378255	102.49050610095844, 5908.365009445595',
  '9963.640315387036, 5609.829825739563	3953.479627903356, 6539.595916678993',
  '6622.614422040829, 6134.931630099587	5731.652518660891, 7099.8635770440615',
  '9336.588149034887, 2070.160341672176	5956.840140413886, 8284.665906846927',
  '8040.946517802443, 3471.1278472739473	7417.2214529660405, 2527.560741235495',
  '6793.050283153941, 6341.014440095525	1404.6013939641223, 2575.176670712276',
  '7056.833893957973, 2929.8572536164634	7347.735578469536, 7277.18976039236',
  '9975.244697298398, 4721.864534274058	6738.5885636596195, 8930.706289962427',
  '3702.459966083722, 5097.611971470821	7235.610002782664, 1516.7726061063513',
  '6809.428290241992, 3723.478510146723	5166.754613776796, 8948.417580939307',
  '5759.351133358159, 7289.721095915686	2144.8815569338176, 9573.747404965163',
  '9872.299994784553, 468.5064431268238	6293.393744559406, 6699.898998867408',
  '1460.3655939822047, 8578.828556831226	1847.737170642776, 9450.091882425339',
  '834.9116287271929, 3911.9280612317953	5131.273381476593, 4786.792549854393',
  '9159.077707081418, 6356.527076153627	4473.25739118068, 8253.182166941022',
  '7148.977474344362, 487.550654308615	6571.262702695697, 4979.015445558488',
  '6602.975515512355, 9052.512335646159	6749.440967041062, 5752.392492480927',
  '7189.822031058273, 7793.999074492661	2381.872315632327, 4992.146430694615',
  '3155.8916604488486, 7607.874318684449	5710.97895879938, 2308.337045134521',
  '7726.16683950118, 790.6241111675638	5001.159394417216, 6688.748331107353',
  'Some random text with 6.470814562795213 numbers in it 33.39097139259195 ',
  '4993.555811876953, 9201.224112980892	5258.611496744256, 7530.4100287952115',
  '4430.260629513638, 3173.722372484207	6893.509383982794, 3885.8222691198007',
  '5705.428974260014, 22.31160375230079	9932.247920134449, 3250.0680296611927',
  '9614.847332060093, 541.8573150090799	5275.148827698908, 579.5591283577495',
  '6116.101181576583, 4529.795619746715	257.55742343055886, 3483.0236914201328',
  '7903.61046376936, 5163.336848719196	6421.930877687161, 7149.332431768998',
];

type NamePair = { first: string, last: string };

const names: NamePair[] = [
  {first: 'Eliz', last: 'erlandson'},
  {first: 'Kati', last: 'Kamel'},
  {first: 'Livia', last: 'Loya'},
  {first: 'Mellisa', last: 'Miltenberger'},
  {first: 'Grace', last: 'Gilliam'},
  {first: 'Madlyn', last: 'Mukai'},
  {first: 'Tristan', last: 'Tindall'},
  {first: 'Terese', last: 'Tilley'},
  {first: 'Bob', last: 'Bland'},
  {first: 'Dahlia', last: 'Dearman'},
  {first: 'Keitha', last: 'Kinoshita'},
  {first: 'Shannan', last: 'Stair'},
  {first: 'Louisa', last: 'Lauria'},
  {first: 'Beatrice', last: 'Brigmond'},
  {first: 'Brad', last: 'Bemis'},
  {first: 'Laurence', last: 'Linnell'},
  {first: 'Felica', last: 'Furlough'},
  {first: 'Reynalda', last: 'Reagle'},
  {first: 'Alayna', last: 'Alber'},
  {first: 'Von', last: 'Viviano'},
  {first: 'Roma', last: 'Ricco'},
  {first: 'Stanford', last: 'Spano'},
  {first: 'Arielle', last: 'Amyx'},
  {first: 'Lu', last: 'Leng'},
  {first: 'Timothy', last: 'Texeira'},
  {first: 'Wendi', last: 'Wei'},
  {first: 'Marva', last: 'Mountain'},
  {first: 'Irena', last: 'Ice'},
  {first: 'Tobie', last: 'Tapper'},
  {first: 'Kate', last: 'Kurtz'},
  {first: 'Sherilyn', last: 'Steinberg'},
  {first: 'Clemmie', last: 'Clapper'},
  {first: 'Maxie', last: 'Moulton'},
  {first: 'Jonnie', last: 'Juliano'},
  {first: 'Coleen', last: 'Cagley'},
  {first: 'Jutta', last: 'Jordan'},
  {first: 'Arletha', last: 'Abelson'},
  {first: 'Shayla', last: 'Schmalz'},
  {first: 'Krystina', last: 'Kuntz'},
  {first: 'Princess', last: 'Polly'},
  {first: 'Gayle', last: 'Gallardo'},
  {first: 'Napoleon', last: 'Naff'},
  {first: 'Ida', last: 'Indelicato'},
  {first: 'Cassy', last: 'Coutu'},
  {first: 'Arnetta', last: 'Alvelo'},
  {first: 'Claris', last: 'Cunniff'},
  {first: 'Kimberley', last: 'Ko'},
  {first: 'Trina', last: 'Taunton'},
  {first: 'Philip', last: 'Pinkley'},
  {first: 'Ima', last: 'Ing'},


];


