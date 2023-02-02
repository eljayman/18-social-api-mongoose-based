const { Schema, model } = require('mongoose');
// require mongoose model() and Schema()
const mongoose = require('../config/connection');
// Schema() for Reaction model
// const { formatDate } = require('../utils/helpers');
// require formatDate helper function

const reactionSchema = new Schema({
  // use Mongoose objectId for default
  // reactionId: mongoose.ObjectId,
  // body of the response is a string with 280 character maximum
  reactionBody: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  // username is a required field
  username: {
    type: String,
    required: true,
  },
  // timestamp has get function to format date
  createdAt: {
    type: Date,
    default: Date.now(),
    // get: formatDate(),
  },
});

const thoughtSchema = new Schema({
  // toughtText is a string from 1 - 280 chars
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  // createdAt uses the native Date object and the formatDate helper
  createdAt: {
    type: Date,
    default: Date.now(),
    // get: formatDate(),
  },
  // username references the User that made the Thought
  username: {
    type: String,
    required: true,
    ref: 'User',
  },
  // an array of nested reactions to thoughts
  reactions: [reactionSchema],
});

// virtual that returns the number of reactions
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// compile the Thought schema into the Thought model
const Thought = mongoose.model('Thought', thoughtSchema);
const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = { Thought, Reaction };
