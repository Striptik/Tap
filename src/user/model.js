
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
  auth: {
    hash: {
      type: String,
    },
    reset: {
      type: String,
    },
    resetExp: {
      type: Date,
    },
  },
  firstname: {
    type: String,
    default: null,
  },
  lastname: {
    type: String,
    default: null,
  },
}, {
  collection: 'users', // #Define the name of the collection
  strict: true,
  timestamps: true,
});


// #Define Methods (not with big Arrow =>)
UserSchema.methods.sayHello = function sayHello() {
  console.log(`Hello, my name is ${this.firstname}!\n`);
};

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
    bcrypt.compare(password, this.auth.hash, (err, data) => {
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
  expiry.setDate(expiry.getDate() + 1);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    firstname: this.firstname,
    lastname: this.lastname,
    expiresIn: '10s', // FOR JWT
    exp: parseInt(expiry.getTime() / 1000, 10),
  }, process.env.JWT_SECRET);
};

UserSchema.methods.hashResetToken = function hashRT(token) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(RESET_SALT_FACTOR, (err, salt) => {
      if (err) {
        logger.error('Error in generating hash for token reset, when generating salt', {
          token,
          err,
          salt,
          tags: ['hashResetToken', 'bcryptError', 'genSalt'],
        });
        return reject({ err, data: null });
      }
      bcrypt.hash(token, salt, (err, hash) => {
        if (err) {
          logger.error('Error in generating hash for token reset, when hashing password', {
            token,
            err,
            hash,
            tags: ['hashResetToken', 'bcryptError', 'hashPassword'],
          });
          return reject({ err, data: null });
        }
        return resolve({ err: null, data: hash });
      });
    });
  });
};

UserSchema.methods.checkResetToken = function checkRT(token) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(token, this.auth.reset, (err, data) => {
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

// #Define Statics Methods (not with big Arrow =>)
UserSchema.statics.getUserWithEmail = function getUserWithEmail(email, cb) {
  return this.findOne({ email }, cb);
};

UserSchema.statics.getUsersWithFirstname = function getUsersWithFirstname(firstname, cb) {
  return this.find({ firstname: new RegExp(firstname, 'i') }, cb);
};

UserSchema.statics.getUsers = function getUsers(cb) {
  return this.find({}, cb);
};


// #Virtuals (no persisting in the schema)
UserSchema.virtual('fullname')
  .get(function getFullName() { return `${this.firstname}  ${this.lastname}`; })
  .set(function setFullName(fullName) {
    this.firstname = fullName.substr(0, fullName.indexOf(' '));
    this.lastname = fullName.substr(fullName.indexOf(' ') + 1);
  });

const User = mongoose.model('User', UserSchema);
module.exports = User;
