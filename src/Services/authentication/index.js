const { authJwt } = require('./jwt');
const { authFB } = require('./fb');

// #Add another passport authentication

module.exports = {
  setAuthentication: (passport) => {
    authJwt(passport);
    authFB(passport);
  },
};
