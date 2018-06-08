const logger = require('../Services/logger');
const hash = require('../Services/hash');
const User = require('./model');
const { sendResetMail } = require('../Services/mailer');

const rs = require('randomstring');


/**
 * Create New Entity User in the database
 * @param {*} email 
 * @param {*} password 
 * @param {*} firstname 
 * @param {*} lastname 
 * @return Promise ({err, message, data})
 */
const newUser = (({ email, password, firstname, lastname }) =>
  new Promise(async (resolve, reject) => {

    // #Check definition of every variables
    if (typeof email !== 'string' || typeof password !== 'string' ||
      typeof firstname !== 'string' || typeof lastname !== 'string') {
      logger.error('Some informations are missings to create new user.', {
        email,
        firstname,
        lastname,
        password,
        tags: ['user', 'createUser', 'create', 'validation'],
      });
      return reject({
        message: 'Some data to create user are missing',
        err: true,
        data: null,
      });
    }

    // Complex email regexp 
    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
      logger.error('Email provided is not a valid email', {
        email,
        tags: ['user', 'createUser', 'create', 'validation', 'email'],
      });
      return reject({
        message: 'Email provided is not a valid email',
        err: true,
        data: null,
      });
    }

    // Only alpha (not accent) and space/dash characters are allowed
    if (!(/^[A-Za-z \-]+$/.test(firstname))) {
      logger.error('Firstname needs to contain only alphabetic numbers', {
        firstname,
        tags: ['user', 'createUser', 'create', 'validation', 'firstname'],
      });
      return reject({
        message: 'Firstname needs to contain only characters, space and - (numbers, special chars and accents letter are not allowed, Sorry)',
        err: true,
        data: null,
      });
    }

    // Only alpha (not accent) and space/dash characters are allowed
    if (!(/^[A-Za-z \-]+$/.test(lastname))) {
      logger.error('Lastname needs to contain only alphabetic numbers', {
        lastname,
        tags: ['user', 'createUser', 'create', 'validation', 'lastname'],
      });
      return reject({
        message: 'Lastname needs to contain only characters, space and - (numbers, special chars and accents letter are not allowed, Sorry)',
        err: true,
        data: null,
      });
    }

    // At least one digit
    if (password.length < 8 || !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/).test(password)) {
      logger.error('Password does not contain at least one lower/upper/special/digit character.', {
        password,
        tags: ['user', 'createUser', 'create', 'validation', 'password'],
      });
      return reject({
        message: 'Password needs to contain at least one lower, upper, numeric and special character',
        err: true,
        data: null,
      });
    }

    // Use static assignation to control all the properties added
    const newUser = new User();

    newUser.email = email;
    newUser.firstname = firstname;
    newUser.lastname = lastname;

    const ret = await newUser.setPassword(password);
    if (ret.err !== null || ret.data === null) {
      logger.error('Unable to create a hash for the new user', {
        ret,
      });
      return reject({
        message: 'Error when trying to create a password',
        err: ret.err,
      });
    }
    // #Add
    newUser.hash = ret.data;

    // #Saving data
    newUser.save((err, user) => {
      if (err) {
        logger.error('Error during saving the new User', {
          newUser,
          err,
          user,
          tags: ['user', 'createUser', 'create', 'mongo'],
        });
        return reject({
          message: 'Error during mongoose save',
          err,
          data: null,
        });
      }

      logger.info('User created', {
        user,
      });
      return resolve({
        error: null,
        data: user,
        message: 'User created',
      });
    });
  })
);

/**
 * User Login
 * @param {*} email 
 * @param {*} password 
 */
const login = (({ email, password }) =>
  new Promise((resolve, reject) => {
    User.getUserWithEmail(email, (err, user) => {
      // #Error
      if (err) {
        logger.error('Error when trying to find the user for login', {
          email,
          err,
          user,
          tags: ['user', 'loginError', 'login'],
        });
        return reject({
          err: new Error(err),
          data: user,
          message: `Error when trying to find the user: ${email}`,
        });
      }
      user.checkPassword(password)
        .then(({ data, err }) => {
          logger.info('Login with success !', {
            data,
            err,
            email,
            tags: ['login', 'loginSuccess', 'user'],
          });
          const token = user.generateJwt();
          return resolve({
            data: { user, token },
            message: 'User Login',
            err: null,
          });
        })
        .catch(({ err, data }) => {
          // #Bad Password
          if (err === false) {
            logger.error(`Unable to login the user ${user} with this password`, {
              data,
              err,
              email,
              tags: ['login', 'badPassword', 'user'],
            });
            return reject({
              err,
              message: 'Wrong password.',
              data,
            });
          }
          // #Bcrypt error
          logger.error(`Error with Bcrypt checkPassword process ${user}`, {
            data,
            err,
            email,
            tags: ['login', 'bcryptError', 'user'],
          });
          return reject({
            err,
            message: 'User cannot login !',
            data,
          });
        });
    });
  })
);

/**
 *  get User by 'key' field
 * @param {*} key 
 * @param {*} value 
 * @return Promise ({err, message, data})
 */
const getUserBy = ((key, value) =>
  new Promise((resolve, reject) => {
    // #Use static methods in model
    if (key === 'email') {
      User.getUserWithEmail(value, (err, user) => {
        // #Error
        if (err) {
          logger.error('Error during finding a user by mail', {
            err,
            user,
            value,
            tags: ['user', 'getUserByMail', 'get/find', 'mongo'],
          });
          return reject({
            err: new Error(err),
            data: user,
            message: 'Error  when trying to find a user by mail',
          });
        }
        // #User
        return resolve({
          data: user,
          message: 'User get by mail',
          error: null,
        });
      });
    }
    // #Other keys than email
    // #Create qwery to find
    const findObject = {};
    findObject[key] = value;
    User.find(findObject, (err, user) => {
      // #Error
      if (err) {
        logger.error(`Erro when tryong to findUser by '${key}'`, {
          err,
          user,
          key,
          value,
          tags: ['user', 'getUserBy', 'get/find', 'mongoose'],
        });
        return reject({
          err,
          data: user,
          message: `Error when try to retrieve user by ${key}`,
        });
      }
      return resolve({
        data: user,
        message: `User get by ${key}`,
        error: null,
      });
    });
  })
);


const resetPassword = (email =>
  new Promise((resolve, reject) => {
    // #Create token
    const reset = rs.generate({
      length: 12,
      charset: 'alphabetic',
    });
    // #Getting the user with the email
    User.getUserWithEmail(email, async (err, user) => {
      if (err || !user) {
        logger.error(`No user find with the email ${email}, or error during find`, {
          err,
          user,
          email,
          tags: ['user', 'getUserWithEmail', 'resetPassword', 'mongoose'],
        });
        return reject({
          err,
          data: user,
          message: `No User find with this email ${email}`,
        });
      }

      // #Encrypt reset token
      const ret = await user.hashResetToken(reset);
      if (ret.err !== null || ret.data === null) {
        logger.error('Unable to create a reset token reset password ', {
          ret,
          user,
        });
        return reject({
          message: 'Error when trying to create a reset token',
          err: ret.err,
          data: ret.data,
        });
      }

      // #Store token and expiration in the user 
      user.auth.reset = ret.data;
      user.auth.resetExp = Date.now() + 1200000; // 10 minutes
      user.save((err) => {
        if (err) {
          logger.error('Error during saving the resetPassword', {
            err,
            user,
            tags: ['user', 'resetPassword', 'reset', 'mongoose'],
          });
          return reject({
            message: 'Error during saving the reset token',
            err,
            data: null,
          });
        }
        // #Create the url to reset password
        const url = `${process.env.FRONT_DOMAIN}resetPassword?code=${reset}`;
        // #Send it via mail
        sendResetMail(email, url)
          .then((message) => {
            logger.info(`Reset Token for user ${email}`, {
              user,
              url,
            });
            return resolve(message);
          })
          .catch((err) => {
            logger.error(`Reset Token for user ${email} Failed`, {
              err,
              url,
            });
            return reject(err);
          });
      });
    });
  })
);

module.exports = {
  newUser,
  getUserBy,
  login,
  resetPassword,
};
