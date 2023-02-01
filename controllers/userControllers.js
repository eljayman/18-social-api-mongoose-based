const { User, Thought } = require('../models');

module.exports = {
  // functions that handle users api routes
  getAllUsers(req, res) {
    // gets all users and returns the objects
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  createUser(req, res) {
    // creates a new user then returns the new object
    User.create(req.body)
      .then((newUserData) => res.json(newUserData))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    // find a user by ObjectId then returns the user object
    User.findOne({ _id: req.params.userId })
      .populate('Thoughts')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  updateUser(req, res) {
    // finds a user by its ObjectId
    User.findOne({ _id: req.params.userId }).then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user with that ID' });
      }
      // spreads out the response object and replaces the username and email fields with req.body
      const updatedUser = {
        ...userData,
        username: req.body.username,
        email: req.body.email,
      };
      // saves the new object with the same ObjectId
      updatedUser
        .save()
        .then((updatedUserData) => res.json(updatedUserData))
        .catch((err) => res.status(500).json(err));
    });
  },
  deleteUser(req, res) {
    // deletes a user by ObjectId
    User.findByIdAndDelete(req.params.userId)
      .then((response) => {
        if (response.ok) {
          // deletes thoughts with the userId
          Thought.deleteMany({ _id: req.params.userId })
            .then((deletedCount) => {
              res.json(deletedCount);
            })
            .catch((err) => res.status(500).json(err));
        }
      })
      .catch((err) => res.status(500).json(err));
  },
  addFriend(req, res) {
    // finds a user by its ObjectId
    User.findOne({ _id: req.params.userId }).then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user with that ID' });
      }
      // spreads out the response object and friends array, adds a new friend to the friends array
      const newFriend = { _id: req.params.friendId };
      const updatedUser = {
        ...userData,
        friends: [...{}, newFriend],
      };
      // saves the new object with the same ObjectId
      updatedUser
        .save()
        .then((updatedUserData) => res.json(updatedUserData))
        .catch((err) => res.status(500).json(err));
    });
  },
  deleteFriend(req, res) {
    // finds a user by its ObjectId
    User.findOne({ _id: req.params.userId }).then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user with that ID' });
      }
      // removes userId object within friends array
      const updatedUser = userData.friends.pull(req.params.friendId);
      // saves the new object with the same ObjectId
      updatedUser
        .save()
        .then((updatedUserData) => res.json(updatedUserData))
        .catch((err) => res.status(500).json(err));
    });
  },
};
