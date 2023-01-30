const { Schema, model } = require('mongoose');
// require mongoose model() and Schema()
const mongoose = require('../config/connection');
// Schema() for Reaction model
const formatDate = require('../utils/helpers');
// formatDate helper function
const { User, Thought } = require('./index');
// require other models for reference

const reactionSchema = new Schema({
  // use Mongoose objectId for default
  reactionId: {
    type: mongoose.ObjectId,
    default: mongoose.ObjectId,
  },
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
    get: formatDate,
  },
});

// compile the Reaction schema into the Reaction model
const Reaction = mongoose.model('reaction', reactionSchema);

module.exports = Reaction;
