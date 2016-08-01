# EntityForge

An integer isn't a data type, it's a compiler hint.

## Models are sophisticated entities, not bundles of generic primitives.

*If you clone the project you can see the following in a browser by running `npm run docs' and opening the debug console in your browser.* 


Define a model to match reality:

```javascript
let EF = EntityForge
let UserForge = EF.obj({
    uuid: EF.string().minLength(20).maxLength(20).ascii(),
    email: EF.string().minLength(5).maxLength(255),
    memberSince: EF.int(2016).min(2000).max(2200)
})
```

Unless we specify otherwise, we can't create or modify the created model type in a way that would cause it to become invalid:

```javascript
let NullableUserModel = UserForge.asNewable()
let example = new NullableUserModel()
console.log("UUID: ", example.uuid) // null
console.log("Email: ", example.email) // null
console.log("MemberSince: ", example.memberSince) // 2016
example.uuid = "-JhLeOlGIEjaIOFHR0xd"
example.email = "foo@bar.com"

try {
    example.uuid = example.uuid.substring(0, 10)
} catch (e) {
    console.log("I'm sorry dave....") // Nope, not allowed.
    console.log("Validation errors provide a cause", e.cause) // cause: { minLength: { value: theBadVal, message: aMessageKey, args: theValidationArgs} }
    console.log("To be clear, the messaging system needs some work. The cause message is: ", e.cause.minLength.message) // @restriction.minLength
}
console.log("UUID wasn't modified by the attempt to set it to illegal value:", example.uuid) // "-JhLeOlGIEjaIOFHR0xd" --- value not modified if invalid.

```

Take care to recognize that there is a difference between setting minLength to zero and not allowing null. A null string is still valid even if minLength is set to zero.

### Generating data
One advantage of specifying our data type in detail is that we can use that specification to do cool things. Like generate semi-random instances of our models:

```javascript
let randomUser = UserForge.gen()
console.log(randomUser) // This instance will be as valid (or invalid) as your Forge definition constraints allow.
```

There is still work to be done on the data generation side. Of the missing functionality, the most important is the handling of cases that are hard to code for explicitly, such as string matching on a regex.

### Built In Forges

The initial batch of forges cover only the basic primitive types, with Arrays/Lists 'on the way'.

```javascript
let BiggerUserForge = EF.obj({
    uuid: EF.string().minLength(20).maxLength(20).ascii(),
    email: EF.string().minLength(5).maxLength(255),
    memberSince: EF.int(2016).min(2000).max(2200),
    karmaScore: EF.number().min(0).max(1).initTo(0.5),
    groups: EF.enumeration().values(["admin", "guest", "subscriber", "paid-member"]),
    contact: EF.obj({
        surname: EF.string().minLength(1).maxLength(255).ascii(),
        forename: EF.string().minLength(1).maxLength(255).ascii(),
        addressLine1: EF.string().minLength(1).maxLength(255).ascii(),
        addressLine2: EF.string().minLength(1).maxLength(255).ascii(),
        postcode: EF.string().minLength(3).maxLength(25).ascii(),
    })

})
let biggerUser = BiggerUserForge.gen()
console.log("A randomly generated 'BiggerUser:", biggerUser)
```
 


## Contributing

### Getting started


```console
npm install typings --global
npm install typescript --global
npm install
npm run build.test
```
