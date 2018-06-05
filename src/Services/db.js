// #Intern tools
const logger = require('./logger');

// #Db Initialisation 
const mongoose = require('mongoose');

mongoose.Promise = global.Promise; 

const options = {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
};

const initMongooseClient = () => {
  mongoose.connect(process.env.MONGO_URL, options).then(
    () => {
      logger.info('Connection to mongoose alive !', { tags: ['init', 'mongoose'] });
    },
    (err) => {
      logger.error('Unable to connect to mongoose', { err, tags: ['init', 'mongoose'] });
    },
  );
};

const closeMongooseClient = (cb) => {
  mongoose.connection.close(cb);
};

module.exports = {
  initMongooseClient,
  closeMongooseClient,
}
