var express  = require('express');
var router   = express.Router();

var PagesController = require('../controllers/PagesController');


// ROUTE: /
// =========================================================

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/', PagesController.home);

module.exports = router;
