import User from '../models/user.model'
import _ from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'

//POST function for creating a new user
const create = (req, res, next) => {
  const user = new User(req.body)
  user.save((err, result) => {
    if (err) {
      //error response is returned
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    //success response is returned
    res.status(200).json({
      message: "Successfuly signed up!"
    })
  })
}

//GET function for listing all of the users in the db
const list = (req, res) => {
  User.find((err, users) => {
    if(err) {
      return res.status(400).json ({
        error: errorHandler.getErrorMessage(err)
      })
    }
    //return the list of users
    res.json(users)
  }).select('name email updated created') //populates only these fields in the resulting user list in JSON as array
}
//a function to run a query in the db for a user's detail by their id
const userByID = (req, res, next, id) => {
User.findById(id).exec((err, user) => {
  if(err || !user)
    return res.status('400').json({
      error: "User not found"
    })
    req.profile = user
    next()
})
 }
/** a GET function to read a single user's data. It is used after the userById function */
const read = (req, res) => {
  //removing sensitive information
req.profile.hashed_password = undefined
req.profile.salt = undefined
return res.json(req.profile)
 }
//a PUT function to update the user record
const update = (req, res, next) => {
  let user = req.profile
  user = _.extend(user, req.body)
  user.updated = Date.now()
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  })
}
//DELETE request to remove a user record from the db
const remove = (req, res, next) => {
  let user = req.profile
  user.remove((err, deletedUser) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  })
}

export default {create, list, userByID, read, update, remove}
