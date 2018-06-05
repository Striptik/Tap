const FBStrategy = require('passport-facebook').Strategy;

const User = require('../../user/model');

const authFB = (passport) => {
  passport.use(new FBStrategy({
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_CLIENTSECRET,
    callbackURL: `${process.env.API_URL}auth/facebook/redirect`,
  }, (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile);
    return (cb, profile);
  }));


  // More details : https://github.com/passport/express-4.x-facebook-example/blob/master/server.js

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Facebook profile is serialized
  // and deserialized.
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
  // TO CONTINUE !
};

module.exports = { authFB };
