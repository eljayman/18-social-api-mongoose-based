const { User, Thought } = require('../models');

module.exports = {
  // functions that handle users api routes
  getAllUsers(req, res) {
    // gets all users and returns the objects
    User.find()
      .select('-__v')
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
    const filter = { _id: req.params.userId };
    User.findOne(filter)
      .select('-__v')
      .populate('thoughts', 'friends')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  updateUser(req, res) {
    const filter = { _id: req.params.userId };
    const update = { username: req.body.username, email: req.body.email };
    // finds a user by its ObjectId
    User.findOneAndUpdate(filter, update, { new: true }, (err, results) => {
      err ? res.status(500).end() : res.json(results);
    });
  },
  deleteUser(req, res) {
    const filter = { _id: req.params.userId };
    // deletes a user by ObjectId
    User.findOneAndDelete(filter)
      .then((deletedUser) => {
        !deletedUser
          ? res.status(500).json({ message: 'No user with this ID' })
          : res.json(deletedUser);
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
