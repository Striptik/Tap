// #Add the .env variable to the environnement variables
require('dotenv').config();

// #Extern dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./src/Services/logger/logger');
const cookieParser = require('cookie-parser');

// #Intern Tools
const db = require('./src/Services/db/db');

// #Routes
const { router } = require('./src');

// #Express 
const port = process.env.PORT || 3000;
const app = express();


// #App initialisation
// Add Middlewares, Routing, Authentification, Logger, DB
const init = () => {
  // #Mongoose
  db.initMongooseClient();

  // #CORS
  app.use(cors());

  // #Body Parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // #Helmet
  app.use(helmet());
  // others middleware : https://github.com/helmetjs/helmet

  // #Logger // morgan -> winston 
  app.use(morgan('dev', { stream: logger.stream }));

  // #Cookie parser
  app.use(cookieParser());

  // Passport

  // API routes

  app.use('/', router);

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