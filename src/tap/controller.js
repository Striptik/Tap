const logger = require('../Services/logger');
const Tap = require('./model');
const SHA256 = require('crypto-js/sha256')

/**
 * Check if the secret is good
 */
const checkSecret = (secret, score, { firstname, lastname, _id }) => SHA256(`${score}:${firstname}:${lastname}:${_id}`) === secret;

/**
 * Save the tap on the user with good format and return the  
 */
const saveTapOnUser = user => data => {
  const tap = { score: data.score, tapId: data._id, created: data.createdAt };
  user.taps.unshift(tap);
  return user.save();
};

/**
 *  Create a tap 
 */
const newTap = ({ secret, score }, user) => {

  // Check Secret,
  if (!checkSecret(secret, score, user)) {
    logger.error('Bad Secret send to save the score!', {
      secret,
      score,
      user
    });
    return Promise.reject({ message: 'Cheater !', err: true, data: null })
  }

  // New Instance of Tap
  const tap = new Tap();  
  tap.score = score;
  tap.userId = user._id;

  // Save Tap
  return tap.save()
    // Insert new tap on user
    .then(saveTapOnUser(user))
    // Return User with updated taps array / Error
    .then((userUpdated) => Promise.resolve({ message: 'User Updated with New score', data: userUpdated, err: null }))
    .catch((error) => {
      logger.error('Error during saving Tap', {
        error,
        user,
        score,
        secret
      });
      return Promise.reject({ message: 'Error during saving Tap', err: error, data: null })
    })
};


const getTaps = () => {
  Tap.getTaosSirtDescending();
};

/**
 * Get all Taps
 */
module.exports = {
  newTap,
  getTaps,
};