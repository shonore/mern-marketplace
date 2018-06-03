//use mongoose to define the user schema with the necessary user data fields
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
name: {
  type: String,
  trim: true,
  required: 'Name is required'
},
email: {
  type: String,
  trim: true,
  unique: 'Email already exists',
  match:[/.+\@.+\..+/, 'Please fill a valid email address'],
  required: 'Email is required'
},
created: {
  type: Date,
  default: Date.now
},
updated: Date,
//hashed passwords and salts represent encrypted user passwords used for authentication
hashed_password: {
    type: String,
    required: "Password is required"
},
salt: String
})

/**The password string provided by the user is not stored directly into the user document.
Insted, it is handled as a virtual field. It is encrypted into a new hashed value and set to the
hashed password field, along with the salt value in the salf field */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })
