const {  Thought, User } = require('../models');

module.exports = {
  // functions that handle thoughts api routes
  getAllThoughts(req, res) {
    // gets all thoughts and returns the objects
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    // creates a new thought then returns the new object
    Thought.create(req.body)
      .then((response) => {
        if (response.ok) {
          // finds user with the ObjectId
          User.findById(req.body.userId)
            .then((userData) => {
              if (!userData) {
                res.status(404).json({ message: 'No user with that ID' });
              }
              // add thought _id to user document
              const updatedUserData = userData.thoughts.push({
                _id: req.body.userId,
              });
              updatedUserData.save().then((data) => {
                res.json(data);
              });
            })
            .catch((err) => res.status(500).json(err));
        }
      })
      .catch((err) => res.status(500).json(err));
  },
  getSingleThought(req, res) {
    // find a thought by ObjectId then returns the object
    Thought.findOne({ _id: req.params.thoughtId })
      // include the user
      .populate('Users')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    // deletes a thought by ObjectId
    Thought.findByIdAndDelete(req.params.thoughtId)
      .then((response) => {
        if (response.ok) {
          // deletes thought _id from user
          User.findOne({ _id: req.params.userId })
            .then((userData) => {
              if (!userData) {
                res.status(404).json({ message: 'No thought with that ID' });
              }
              // remove thought _id from user document
              const updatedUser = { ...userData };
              updatedUser.thoughts.pull({ _id: req.params.thoughtId });
              updatedUser
                .save()
                .then((updatedUserData) => res.json(updatedUserData));
            })
            .catch((err) => res.status(500).json(err));
        }
      })
      .catch((err) => res.status(500).json(err));
  },
  updateThought(req, res) {
    // find thought by _id
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: 'No thought with that ID' });
        }
        // add new thought text to thought object
        const updatedThoughtData = {
          ...thoughtData,
          thoughtText: req.body.thoughtText,
        };
        updatedThoughtData
          .save()
          .then((response) => {
            if (response.ok) {
              return res.json(response);
            }
          })
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },
  createReaction(req, res) {
    // find thought by _id
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: 'No thought with that ID' });
        }
        // add reaction subdocument to thought document
        const updatedThoughtData = { ...thoughtData };
        updatedThoughtData.reactions.push({
          reactionBody: req.body.reactionBody,
          username: req.body.username,
        });
        updatedThoughtData.save().then((thought) => res.json(thought));
      })
      .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    // find thought by _id
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          res.status(404).json({ message: 'No thought with that ID' });
        }
        // remove reaction by _id
        const updatedThought = thoughtData.reactions.pull(
          req.params.reactionId
        );
        updatedThought
          .save()
          .then((thought) => res.json(thought))
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },
};
