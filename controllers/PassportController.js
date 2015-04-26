var passport        = require('passport');
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;

var User    = require('sssnap-models').Users;
var config  = require('../config/values');


// SUPPORT FOR SESSIONS
// See "Sessions" on http://passportjs.org/guide/configure/
// =========================================================

// Servialize User = what will be written into the session cookie.
// The user._id should be enough.
passport.serializeUser(function (user, next) {
  next(null, user._id);
});

// Deserialize User = get the user based on the session cookies value.
passport.deserializeUser(function (user_id, next) {
  User.read(user_id).then(function (user) {
    next(null, user);
  }).catch(function (err) {
    next(err);
  });
});


// GOOGLE STRATEGY
// =========================================================

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: config.baseUrl + 'auth/google/callback',
    passReqToCallback: true     // required to access req in the callback
  },
  function (req, accessToken, refreshToken, profile, next) {

    // Check if the user is logged in and wants to link a different
    // Provider to his account.
    if (req.user) {
      User.findOne({ 'oauth.google': profile.id }, function (err, existingUser) {

        // If the user is logged in and has already connected google to
        // his account, reject it!
        if (existingUser) {
          req.flash('warn', 'You already connected a Google Account to your account.');
          return next(null, existingUser);
        }
        else {

          // It's legitimate to add this provider to the users account,
          // so add the users ID from Google to his account.
          User.read(req.user.id, function (err, user) {
            user.oauth.google = profile.id;
            user.save(function (err, savedUser) {
              req.flash('info', 'Successfully linked your Account with Google.');
              return next(err, savedUser);
            });
          });
        }
      });
    }

    // If the user is not logged in, he want's either to
    // login or to register.
    else {
      User.findOne({ 'oauth.google': profile.id }, function (err, existingUser) {
        // If the user is found in the database, he will be logged in!
        if (existingUser) {
          return next(null, existingUser);
        }

        // If he wants to register, we first need to check if he
        // already has an account with that email address.
        User.findOne({ email: profile.emails[0].value }, function (err, existingEmailUser) {

          if (existingEmailUser) {
            existingEmailUser.oauth.google = profile.id;
            existingEmailUser.save(function (err, savedUser) {
              req.flash('info', 'Successfully linked your Account with Google.');
              return next(err, savedUser);
            });
          }

          // At this point we can register a new user with the by Google authorized
          // profile.
          else {
            var newUser = new User();
            newUser.name.first   = profile.name.givenName;
            newUser.name.last    = profile.name.familyName;
            newUser.email        = profile.emails[0].value;
            newUser.oauth.google = profile.id;

            User.create(newUser).then(function (registeredUser) {
              req.flash('success', 'Registered, yay!');
              return next(null, registeredUser);
            }).catch(function (err) {
              req.flash('error', 'Error while registering.');
              return next(err);
            });
          }
        });
      });
    } // endif (req.user)

  }
));

module.exports = passport;
