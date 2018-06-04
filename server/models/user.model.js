//use mongoose to define the user schema with the necessary user data fields
import mongoose from 'mongoose'
import crypto from 'crypto'

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
salt: String,
updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
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

  UserSchema.path('hashed_password').validate(function(v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}

export default mongoose.model('User', UserSchema)
