const { Schema, model } = require('mongoose');
// require mongoose model() and Schema()
const mongoose = require('../config/connection');
// require formatDate helper function
const { formatDate } = require('../utils/helpers');

// Schema() for Reaction model
const reactionSchema = new Schema(
  {
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
    // timestamp has getter function to format date
    createdAt: {
      type: Date,
      default: Date.now(),
      get: formatDate,
    },
  },
  // allows JSON response for date format helper and excludes redundant field
  { toJSON: { getters: true }, id: false }
);

const thoughtSchema = new Schema(
  {
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
  },
  // options to allow date formatter in JSON and exclude redundant field
  { toJSON: { getters: true }, id: false }
);

// virtual that returns the number of reactions
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// compile the Thought schema into the Thought model
const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
