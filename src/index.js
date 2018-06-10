const { Router } = require('express');
const passport = require('passport');

// #Add passport strategie
const { setAuthentication } = require('./Services/authentication');

setAuthentication(passport);


// #Merge params to give access to them
const router = Router({ mergeParams: true });


/** API  */

// #1 - Routes
const User = require('./user/routes');
const Tap = require('./tap/routes');
// #2 - Instanciate Routes
const userRouter = new User({ passport });
const tapRouter = new Tap({ passport });
// #3 - Add Routes
router.use('/user/', userRouter.getRouter());
router.use('/tap/', tapRouter.getRouter());

module.exports = { router };
