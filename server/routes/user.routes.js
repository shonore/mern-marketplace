import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()
/** the /api/users route is used for
a. Listing users with GET
b. Creating a new user with POST
*/
router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)
/**  the api/users/:userId is used for
  a. Fetching a user with GET
  b. Updating a user with PUT
  c. Deleting a user with DELETE
  */
router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin,authCtrl.hasAuthorization ,userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.param('userId', userCtrl.userByID)

export default router
