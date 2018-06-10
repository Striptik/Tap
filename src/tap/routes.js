const { Router } = require('express');

const logger = require('../Services/logger');
const { getTaps, newTap } = require('./controller');
const { checkFields } = require('../Services/requestHelper');

const tapRouter = Router({ mergeParams: true });

class TapRouter {
  constructor({ passport }) {
    this.passport = passport;
  }

  routes() {
    /**
     * Save new score in Database
     */
    
    tapRouter.post('/new', this.passport.authenticate(['jwt'], { session: false }), (req, res) => {
      // #Body exists ?
      if (typeof req.body === 'undefined' || req.body === null) {
        logger.error('No body provided or empty', {
          tags: ['tap', 'newTap', 'create', 'mongoose'],
          body: req.body,
        });
        return res.status(400).send({
          message: 'Body Empty',
          err: true,
          data: null,
        });
      }

      const { miss, extra, ok } = checkFields(['score', 'secret'], req.body);
      if (!ok) {
        logger.error('Bad fields provided', {
          tags: ['tap', 'newTap', 'create', 'badFields'],
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

      // Controller Job
      newTap(req.body, req.user)
        .then(tap => res.status(200).send(tap))
        .catch(({ err, message, data }) => {
          logger.error('Unable to save the new tap', {
            tags: ['tap', 'newTap', 'create', 'mongoose'],
            err,
            message,
            data,
          });
          return res.status(500).send({ err, message, data });
        });
    });

    /**
     * Save new score in Database
     */
    tapRouter.get('/scores', this.passport.authenticate(['jwt'], { session: false }), (req, res) => {
      // #Body exists ?
      if (typeof req.body === 'undefined' || req.body === null) {
        logger.error('No body provided or empty', {
          tags: ['tap', 'newTap', 'create', 'mongoose'],
          body: req.body,
        });
        return res.status(400).send({
          message: 'Body Empty',
          err: true,
          data: null,
        });
      }

      // Controller Job
      getTaps()
        .then(taps => res.status(200).send({ data: taps, message: 'All the scores', err: null}))
        .catch(({ err, message, data }) => {
          logger.error('Unable to save the new tap', {
            tags: ['tap', 'newTap', 'create', 'mongoose'],
            err,
            message,
            data,
          });
          return res.status(500).send({ err, message, data });
        });
    });
  }

  getRouter() {
    this.routes();
    return tapRouter;
  }
};

module.exports = TapRouter;
