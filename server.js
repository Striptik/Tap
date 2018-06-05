// #Add the .env variable to the environnement variables
require('dotenv').config();

// #Extern dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const forest = require('forest-express-mongoose');
const mongoose = require('mongoose');
const client = require('redis').createClient();
const path = require('path');

// #Intern Tools
const logger = require('./src/Services/logger');
const db = require('./src/Services/db');

// #Routes
const { router } = require('./src');

// #Express 
const port = process.env.PORT || 3000;
const app = express();

// #Add limite rate
const limiter = require('express-limiter')(app, client);

limiter({
  path: '*',
  method: 'all',
  lookup: ['connection.remoteAddress'], // controll, add req.user.id
  total: 20, // 150 request per 
  expire: 1000 * 60, // 1 minute
  onRateLimited: (req, res, next) => {
    logger.info('Rate limited', {
      tags: ['limiteRate', 'limiter', 'DDOS'],
    });
    next({ message: 'Rate limit exceeded', status: 429 });
  },
});


// #App initialisation
const init = () => {
  // #Mongoose
  db.initMongooseClient();

  // #ForestAdmin
  app.use(forest.init({
    modelsDir: './src',
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    mongoose, // The mongoose database connection.
  }));

  // #Use path to add views
  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, 'views'));
  
  // #CORS
  app.use(cors());

  // #Body Parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // #Helmet
  app.use(helmet());
  // others middleware : https://github.com/helmetjs/helmet

  // #Logger morgan -> winston 
  app.use(morgan('dev', { stream: logger.stream }));

  // #Cookie parser
  app.use(cookieParser());

  // API routes
  app.use('/', router);

  // #Ready to listen
  app.listen(port, () => {
    // Replace by logger
    logger.info(`App is running on port ${port}`, { tags: ['startup', 'init'] });
  });
};

init();

// #Handle Uncaught Exception
process.on('uncaughtException', (err) => {
  // handle the error safely
  logger.error(err, { tags: ['uncaughtException', 'fatal-error'] });
});
