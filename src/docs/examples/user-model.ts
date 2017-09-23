import {EF} from "@entity-forge/forge";


let UIDForge = EF.string().minLength(20).maxLength(20).ascii()
let URLForge = EF.string().minLength(5).maxLength(2000).ascii()

let PermissionsF = EF.enumeration([
  'auth.register',
  'auth.login',
  'create',
  'read',
  'update',
  'delete',
])

let aclF = EF.enumeration(['read', 'write', 'execute'])

let UserGroupForge = EF.obj({
  uid: UIDForge,
  name: EF.enumeration().values(["user", "admin", "guest", "returning-guest"])
})


let UserInfo = EF.obj({
  uid: UIDForge,
  email: EF.string().minLength(5).maxLength(255),
  memberSince: EF.int(2016).min(2000).max(2200),
  // groups: EF.map({
  //   // keys: EF.key()
  // })
})

