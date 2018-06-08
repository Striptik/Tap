const { authJwt } = require('./jwt');

// #Add another passport authentication

module.exports = {
  setAuthentication: (passport) => {
    authJwt(passport);
  },
};
