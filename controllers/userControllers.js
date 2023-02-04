const { User } = require('../models');

module.exports = {
  // functions that handle users api routes
  getAllUsers(req, res) {
    // gets all users and returns the objects
    User.find()
      .select('-__v')
      .populate('thoughts', 'friends')
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
    // gets a user and all associated thought _id's and friend _id's
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
    // finds a user by its ObjectId and updates the username and email
    User.findOneAndUpdate(filter, update, { new: true }, (err, results) => {
      err ? res.status(500).end() : res.json(results);
    });
  },
  deleteUser(req, res) {
    const filter = { _id: req.params.userId };
    // deletes a user by ObjectId uses post middleware to remove all associated thoughts
    User.findOneAndDelete(filter)
      .then(({ _id, username }) => {
        if (!_id) {
          res.status(500).json({ message: 'No user with this ID' });
        }
        const update = { $pull: { friends: _id } };
        User.updateMany({ friends: [_id] }, update, function (err, res) {
          if (err) {
            res.status(500).json({ message: 'Something went wrong' });
          }
          return;
        });
        res.json({ message: `Deleted ${username}.` });
      })
      .catch(() => res.status(500).json({ message: 'No user with this ID' }));
  },
  addFriend(req, res) {
    const filter = { _id: req.params.userId };
    const newFriend = { _id: req.params.friendId };
    const update = { $addToSet: { friends: newFriend } };
    // adds a user's _id to the friends array if it isn't already there
    User.findOneAndUpdate(filter, update, { new: true }, (err, results) => {
      err ? res.status(500).end() : res.json(results);
    });
  },
  deleteFriend(req, res) {
    const filter = { _id: req.params.userId };
    const formerFriend = req.params.friendId;
    const update = { $pull: { friends: formerFriend } };
    // removes a user's _id from the friends array
    User.findOneAndUpdate(filter, update, { new: true }, (err, results) => {
      err ? res.status(500).end() : res.json(results);
    });
  },
};
