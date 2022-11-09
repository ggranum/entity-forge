# EntityForge

An integer isn't a data type. It's a compiler hint.

## Models aren't just bundles of generic primitives.

Define a model to match reality:

```typescript
import {EF} from "entityforge";

let UserForge = EF.obj({
    uuid: EF.string().minLength(20).maxLength(20).ascii(),
    email: EF.string().minLength(5).maxLength(255),
    memberSince: EF.int(2016).min(2000).max(2200)
})
```

Now create an instance of your model:

```typescript
let NullableUserModel = UserForge.asNewable()
let example = new NullableUserModel()
console.log("UUID: ", example.uuid) // null
console.log("Email: ", example.email) // null
console.log("MemberSince: ", example.memberSince) // 2016


try {
    example.uuid = "-JhLeOlGIEjaIOFHR0xd" // Set succeeds.
    example.email = "foo@bar.com" // Set succeeds.
    example.uuid = example.uuid.substring(0, 10) // throws exception
} catch (e) {
    console.log("I'm sorry dave....") // Nope, not allowed.
    console.log("Validation errors provide a cause", e.cause); 
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

The initial batch of forges cover the basic primitive types, and object wrappers:

```typescript
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


### Composite Data Models

Plain Old TypeScript Classes can be referenced as well, allowing a cleaner version of the above:

```typescript
let ContactForge = EF.obj({
    surname: EF.string().minLength(1).maxLength(255).ascii(),
    forename: EF.string().minLength(1).maxLength(255).ascii(),
    addressLine1: EF.string().minLength(1).maxLength(255).ascii(),
    addressLine2: EF.string().minLength(1).maxLength(255).ascii(),
    postcode: EF.string().minLength(3).maxLength(25).ascii(),
})
let ContactModel = ContactForge.asNewable()
let BiggerUserForge = EF.obj({
    uuid: EF.string().minLength(20).maxLength(20).ascii(),
    email: EF.string().minLength(5).maxLength(255),
    memberSince: EF.int(2016).min(2000).max(2200),
    karmaScore: EF.number().min(0).max(1).initTo(0.5),
    groups: EF.enumeration().values(["admin", "guest", "subscriber", "paid-member"]),
    contact: EF.ofType(ContactModel).notNull().initTo(new UserContact())
})
let BiggerUserModel = BiggerUserForge.asNewable()
console.log("A new BiggerUserModel, ready for validated updates", new BiggerUserModel())
```

Generation of 'ofType' child fields is not yet implemented.

## Contributing

Please see CONTRIBUTING.adoc


```bash
npm install 
npm run test
```
