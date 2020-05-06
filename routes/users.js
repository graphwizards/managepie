var express = require('express');
var router = express.Router();

// models
const user = require('./../models/users');
var minifyHTML = require('express-minify-html');


  
router.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes:     true,
      removeEmptyAttributes:     true,
      minifyJS:                  true
  }
}));

var dashboard_layout = "layouts/user-dashboard";
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/login', { title : 'Login | Managepie'});
});

router.get('/dashboard', (req, res) => {
  res.render('users/dashboard', {layout : dashboard_layout, title : "Masterclasses | Managepie.com"});
});

router.get('/logout', (req, res) => {
 res.redirect('/users');
});

router.get('/students', (req, res) => {
  res.render('users/students', {layout : dashboard_layout});
 });

 router.get('/users/register', (req, res) => {
   res.render('users/register', { title : 'Request Free Demo | Managepie'});
 
 });

module.exports = router;
