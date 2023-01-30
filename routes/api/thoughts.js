const router = require('express').Router();
const {
  // controller functions that handle route responses
} = require('../../controllers');

router.route('/').get(getPosts).post(createPost);

router.route('/:postId').get(getSinglePost);

module.exports = router;
