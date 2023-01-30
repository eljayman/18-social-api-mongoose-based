const { Schema, model } = require('mongoose');
// require mongoose model() and Schema()
const mongoose = require('../config/connection');
// Schema() for Reaction model
const formatDate = require('../utils/helpers');
// require formatDate helper function
const { User, Reaction } = require('./index');
// require other models for reference

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
    get: formatDate,
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

// compile the Thought schema into the User model
const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
