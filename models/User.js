const { Schema, model } = require('mongoose');
// require mongoose model() and Schema()
const mongoose = require('../config/connection');
// Schema() for User model

const userSchema = new Schema(
  {
    // username attribute
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    // email attribute uses match with a regex
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        'Please use a valid email address',
      ],
    },
    // reference attaches thoughts _id to thoughts model
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
    // friends is a self-reference to user model that attaches user's _id's to user model
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  // options to enable the res.json for express
  { toJSON: { virtuals: true }, id: false }
);

// virtual that returns the number of friends
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// compile the User schema into the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
