const router = require('express').Router();
const {
  // import functions from thoughtControllers
  getAllUsers,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
  addFriend,
  deleteFriend,
} = require('../../controllers');

// routes for users
router.route('/').get(getAllUsers).post(createUser);
router.route('/:userId').get(getSingleUser).delete(deleteUser).put(updateUser);
router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend);



module.exports = router;
