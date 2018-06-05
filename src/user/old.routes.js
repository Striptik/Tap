
const { Router } = require('express');

const logger = require('../Services/logger');
const User = require('./model');
const { getUserBy, newUser, login } = require('./controller');
const { checkFields } = require('../Services/requestHelper');

const { authJwt } = require('../Services/authentication/jwt');
const passport = require('passport');

authJwt(passport);


// Declare User Router
const userRouter = Router({ mergeParams: true });

/**
 * Get Users Route
 */
userRouter.get('/all', (req, res) => {
  User.getUsers((err, users) => {
    if (err) {
      logger.error('Error when trying to get all users', {
        err,
        res,
        tags: ['user', 'getUsers', 'get/find', 'mongoose'],
      });
      return res.status(500).json({
        data: users,
        error: err,
        message: 'Error when trying to get all users',
      });
    }
    return res.status(200).json({
      data: users,
      error: null,
      message: 'get All users',
    });
  });
});

/**
 * get Users By 'Key' route
 */
userRouter.get('/:key/:value', passport.authenticate(['jwt'], { session: false }),(req, res) => {
  getUserBy(req.params.key, req.params.value)
    .then(data => res.status(200).json(data))
    .catch(({ err, data, message }) => {
      logger.error('Error route get /user/:key/:value ', {
        params: req.params,
        err,
        message,
        tags: ['user', 'getUserBy', 'get/find', 'mongoose'],
      });
      return res.status(400).json({
        err, data, message,
      });
    });
});


/**
 * New User
 */
userRouter.post('/new', (req, res) => {
  // #Body exists? 
  if (typeof req.body === 'undefined' || req.body === null) {
    logger.error('No body provided or empty', {
      tags: ['user', 'newUser', 'create', 'mongoose'],
      body: req.body,
    });
    return res.status(400).json({
      message: 'Body Empty',
      err: true,
      data: null,
    });
  }
  // #Is there the right fields provided ?
  const { miss, extra, ok } = checkFields(['email', 'password', 'firstname', 'lastname'], req.body);
  if (!ok) {
    logger.error('Bad fields provided', {
      tags: ['user', 'newUser', 'create', 'badFields'],
      miss,
      extra,
      body: req.body,
    });
    return res.status(400).json({
      message: 'There\'s to much fields and/or not enough',
      err: { miss, extra },
      data: null,
    });
  }
  newUser(req.body)
    .then(user => res.json(user).status(200))
    .catch(({ err, message, data }) => {
      logger.error('Unable to save the user', {
        tags: ['user', 'newUser', 'create', 'mongoose'],
        err,
        message,
        data,
      });
      return res.status(500).json({ err, message, data });
    });
});


/**
 * User login
 */
userRouter.post('/login', (req, res) => {
  // #Body exists? 
  if (typeof req.body === 'undefined' || req.body === null) {
    logger.error('No body provided or empty', {
      tags: ['user', 'newUser', 'create', 'mongoose'],
      body: req.body,
    });
    return res.status(400).json({
      message: 'Body Empty',
      err: true,
      data: null,
    });
  }
  const { miss, extra, ok } = checkFields(['email', 'password'], req.body);
  if (!ok) {
    logger.error('Bad fields provided', {
      tags: ['user', 'loginUser', 'badFields'],
      miss,
      extra,
      body: req.body,
    });
    return res.status(400).json({
      message: 'There\'s to much fields and/or not enough',
      err: { miss, extra },
      data: null,
    });
  }
  login(req.body)
    .then(user => res.json(user).status(200))
    .catch(({ err, message, data }) => {
      logger.error('Error during login', {
        tags: ['user', 'loginUser'],
        err,
        message,
        data,
      });
      return res.status(500).json({ err, message, data });
    });
});

// module.exports = { userRouter };
module.exports = userRouter;
