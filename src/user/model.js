// #User Schema
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const logger = require('../Services/logger');
const jwt = require('jsonwebtoken');

const SALT_FACTOR = 10;
const RESET_SALT_FACTOR = 6;
const { Schema } = mongoose;

// #Define fields
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    unique: true,
  },
  hash: {
    type: String,
  },
  firstname: {
    type: String,
    default: null,
  },
  lastname: {
    type: String,
    default: null,
  },
  taps: [{
    score: Number,
    tapId: String,
    created: Date,
  }],
}, {
    timestamps: true,
  });

UserSchema.methods.setPassword = function setPass(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
      if (err) {
        logger.error('Error in setting password, when generating salt', {
          password,
          err,
          salt,
          tags: ['setPassword', 'bcryptError', 'genSalt'],
        });
        return reject({ err, data: null });
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          logger.error('Error in setting password, when  hashing password', {
            password,
            err,
            hash,
            tags: ['setPassword', 'bcryptError', 'hashPassword'],
          });
          return reject({ err, data: null });
        }
        return resolve({ err: null, data: hash });
      });
    });
  });
};

UserSchema.methods.checkPassword = function checkPass(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.hash, (err, data) => {
      if (err) {
        return reject({ data: null, err });
      }
      if (data === false) {
        return reject({ data: null, err: false });
      }
      return resolve({ data, err: null });
    });
  });
};

UserSchema.methods.generateJwt = function generateJwt() {
  const expiry = new Date();
  // #21 days to expiration date for jwt
  expiry.setDate(expiry.getDate() + 2);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    firstname: this.firstname,
    lastname: this.lastname,
    taps: this.taps,
    // expiresIn: '10s', // FOR JWT
    exp: parseInt(expiry.getTime() / 1000, 10),
  }, process.env.JWT_SECRET);
};

// Get My Scores
UserSchema.methods.getMyScoreOrderedScore = function getScores() {
  return this.taps.sort((a, b) => b.score - a.score)
}

// #Define Statics Methods (not with big Arrow =>)
UserSchema.statics.getUserWithEmail = function getUserWithEmail(email, cb) {
  return this.findOne({ email }, cb);
};

// #Virtuals (no persisting in the schema)
UserSchema.virtual('fullname')
  .get(function getFullName() { return `${this.firstname}  ${this.lastname}`; })
  .set(function setFullName(fullName) {
    this.firstname = fullName.substr(0, fullName.indexOf(' '));
    this.lastname = fullName.substr(fullName.indexOf(' ') + 1);
  });

const User = mongoose.model('user', UserSchema);
module.exports = User;
