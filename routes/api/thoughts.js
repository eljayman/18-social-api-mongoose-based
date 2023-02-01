const router = require('express').Router();
const {
  // import functions from thoughtControllers
  getAllThoughts,
  createThought,
  getSingleThought,
  deleteThought,
  updateThought,
  createReaction,
  deleteReaction,
} = require('../../controllers');

// routes for thoughts
router.route('/').get(getAllThoughts).post(createThought);
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .delete(deleteThought)
  .put(updateThought);
router.route('/:thoughtId/reactions').post(createReaction);
router.route('/:thoughtId/:reactionId').delete(deleteReaction);

module.exports = router;
