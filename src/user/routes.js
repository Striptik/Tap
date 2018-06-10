
const { Router } = require('express');

const logger = require('../Services/logger');
const User = require('./model');
const { newUser, login, getMyScore } = require('./controller');
const { checkFields } = require('../Services/requestHelper');

const userRouter = Router({ mergeParams: true });

class UserRouter {
  constructor({ passport }) {
    this.passport = passport;
  }

  routes() {
    /**
    * New User
    * body: fields to register when signup
    */
    userRouter.post('/new', (req, res) => {
      // #Body exists? 
      if (typeof req.body === 'undefined' || req.body === null) {
        logger.error('No body provided or empty', {
          tags: ['user', 'newUser', 'create', 'mongoose'],
          body: req.body,
        });
        return res.status(400).send({
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
        return res.status(400).send({
          message: 'There\'s to much fields and/or not enough',
          err: { miss, extra },
          data: null,
        });
      }
      newUser(req.body)
        .then(user => res.status(200).send(user))
        .catch(({ err, message, data }) => {
          logger.error('Unable to save the user', {
            tags: ['user', 'newUser', 'create', 'mongoose'],
            err,
            message,
            data,
          });
          return res.status(500).send({ err, message, data });
        });
    });
    /**
     * User login
     * body: email, password
     */
    userRouter.post('/login', (req, res) => {
      // #Body exists? 
      if (typeof req.body === 'undefined' || req.body === null) {
        logger.error('No body provided or empty', {
          tags: ['user', 'newUser', 'create', 'mongoose'],
          body: req.body,
        });
        return res.status(400).send({
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
        return res.status(400).send({
          message: 'There\'s to much fields and/or not enough',
          err: { miss, extra },
          data: null,
        });
      }
      login(req.body)
        // TODO: Not send all the datas
        .then(user => res.status(200).send(user))
        .catch(({ err, message, data }) => {
          logger.error('Error during login', {
            tags: ['user', 'loginUser'],
            err,
            message,
            data,
          });
          return res.status(500).send({ err, message, data });
        });
    });
    
    userRouter.get('/myScore', this.passport.authenticate(['jwt'], { session: false }), (req, res) => {
      getMyScore(req.user)
        .then(taps => res.status(200).send({ data: taps, message: 'My Scores', err: null }))
        .catch((error) => {
          logger.error('Error when trying to retrieve scores', {
            tags: ['user', 'scoreUser'],
            error,
            message,
            user: req.user,
          });
          return res.status(500).send({ err: error, message: 'Unable to retrieve user score', data: null });
        });
    });
  }

  getRouter() {
    this.routes();
    return userRouter;
  }
}

module.exports = UserRouter;
