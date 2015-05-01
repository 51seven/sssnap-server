var express  = require('express');
var router   = express.Router();
var passport = require('passport');

var PassportController = require('../controllers/PassportController');


// ROUTE: /auth/
// =========================================================

router.get('/google',
  // Send the user to Google using the defined passport-google-oauth strategy
  passport.authenticate('google',
    { scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email' }
  )
);

router.get('/google/callback',
  // Hande the response from google
  passport.authenticate('google',
    { failureRedirect: '/login' }
  ),
  // Redirect to users dashboard, if login was successful
  function (req, res) {
    res.redirect('/');
  }
);

module.exports = router;
