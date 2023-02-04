const { Thought, User } = require('../models');

module.exports = {
  // functions that handle thoughts api routes
  getAllThoughts(req, res) {
    // gets all thoughts and returns the documents
    Thought.find()
      .select('-__v')
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    // creates a new thought then returns the new document
    Thought.create(req.body).then((newThought) => {
      const user = newThought.username;
      const thoughtId = newThought._id;
      // updates the user to include thought _id in thoughts array
      User.findOneAndUpdate(
        { username: user },
        { $addToSet: { thoughts: thoughtId } },
        { new: true }
      )
        .then((data) => {
          !data
            ? res.status(500).json({ message: 'Something went wrong' })
            : res.json(data);
        })
        .catch((err) => res.status(500).json(err));
    });
  },
  getSingleThought(req, res) {
    // find a thought by ObjectId then returns the document
    Thought.findOne({ _id: req.params.thoughtId })
      .populate('reactions')
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      );
  },
  updateThought(req, res) {
    // find thought by _id the update the thoughtText
    const filter = { _id: req.params.thoughtId };
    const update = { thoughtText: req.body.thoughtText };
    Thought.findOneAndUpdate(filter, update, { new: true }, (err, results) => {
      err ? res.status(500).end() : res.json(results);
    });
  },
  deleteThought(req, res) {
    const thought = { _id: req.params.thoughtId };
    // deletes a thought by ObjectId
    Thought.findOneAndDelete(thought)
      .then(({ _id, username, thoughtText }) => {
        if (!_id) {
          res.status(404).json({ message: 'No thought with that ID' });
        }
        // uses the response object to update user, removing thought _id from thoughts array
        const filter = { username };
        const update = { $pull: { thoughts: _id } };
        User.findOneAndUpdate(filter, update, function () {
          res.json({ _id, username, thoughtText });
        });
      })
      .catch((err) => res.status(500).json(err));
  },
  createReaction(req, res) {
    // creates reaction to thought and nests the document inside reactions array
    // needs debugging, creates reaction but doesn't use req.body
    const filter = { _id: req.params.thoughtId };
    const newReaction = {
      reactionBody: req.body.reactionBody,
      username: req.body.username,
    };
    const update = { $addToSet: { reactions: newReaction } };
    Thought.findOneAndUpdate(filter, update, { new: true }, (err, results) => {
      err ? res.status(500).end() : res.json(results);
    });
  },
  deleteReaction(req, res) {
    // delete nested reaction document by _id
    const filter = { _id: req.params.thoughtId };
    const reaction = { _id: req.params.reactionId };
    const update = { $pull: { reactions: reaction } };
    Thought.findOneAndUpdate(filter, update, { new: true }, (err, results) => {
      err ? res.status(500).end() : res.json(results);
    });
  },
};
