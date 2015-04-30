var express  = require('express');
var router   = express.Router();

var PagesController = require('../controllers/PagesController');
var UsersController = require('../controllers/UsersController');


// ROUTE: /
// =========================================================

router.get('/', PagesController.home);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/login', UsersController.login);

module.exports = router;
