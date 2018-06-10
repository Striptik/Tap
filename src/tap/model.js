
// #User Schema
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const logger = require('../Services/logger');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

// #Define fields
const TapSchema = new Schema({
  score: {
    type: Number,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    ref: 'user'
  },
}, {
  timestamps: true,
});

TapSchema.statics.getTapsSortDescending = function () {
  return this.find({}).populate('userId').sort({ score: -1}).exec();
};


const Tap = mongoose.model('tap', TapSchema);
module.exports = Tap;
