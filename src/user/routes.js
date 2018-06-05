
const { Router } = require('express');

const logger = require('../Services/logger');
const User = require('./model');
const { getUserBy, newUser, login, resetPassword } = require('./controller');
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
    /**
     * Reset Password route
     * body: email
     */
    userRouter.post('/forgot', (req, res) => {
      // #Is body empty ?
      if (typeof req.body === 'undefined' || req.body === null) {
        logger.error('No body provided or empty', {
          tags: ['user', 'resetPassword'],
          body: req.body,
        });
        return res.status(400).send({
          message: 'Body Empty',
          err: true,
          data: null,
        });
      }
      // #Is there the right fields provided ?
      const { miss, extra, ok } = checkFields(['email'], req.body);
      if (!ok) {
        logger.error('Bad fields provided', {
          tags: ['user', 'resetPassword', 'badFields'],
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
      resetPassword(req.body.email)
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


    /* AUTHENTICATED ROUTES (Backoffice) */

    /**
    * Is authenticated
    */
    userRouter.get('/authenticated', this.passport.authenticate(['jwt'], { session: false }), (req, res) => {
      res.status(200).send({
        message: 'User authenticated',
        err: null,
        data: req.user,
      });
    });

    /**
     * Get all users
     */
    userRouter.get('/all', this.passport.authenticate(['jwt'], { session: false }), (req, res) => {
      User.getUsers((err, users) => {
        if (err) {
          logger.error('Error when trying to get all users', {
            err,
            res,
            tags: ['user', 'getUsers', 'get/find', 'mongoose'],
          });
          return res.status(500).send({
            data: users,
            error: err,
            message: 'Error when trying to get all users',
          });
        }
        return res.status(200).send({
          data: users,
          error: null,
          message: 'get All users',
        });
      });
    });

    /**
     * Get Users By 'Key' route
     */
    userRouter.get('/:key/:value', this.passport.authenticate(['jwt'], { session: false }), (req, res) => {
      getUserBy(req.params.key, req.params.value)
        .then(data => res.status(200).send(data))
        .catch(({ err, data, message }) => {
          logger.error('Error route get /user/:key/:value ', {
            params: req.params,
            err,
            message,
            tags: ['user', 'getUserBy', 'get/find', 'mongoose'],
          });
          return res.status(400).send({
            err, data, message,
          });
        });
    });
  }

  getRouter() {
    this.routes();
    return userRouter;
  }
}

module.exports = UserRouter;
