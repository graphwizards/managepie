var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const urlencode = require('urlencode');
const passport = require('passport');
const session = require('express-session');
// models
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const user = require('./../models/users');
var minifyHTML = require('express-minify-html');

router.use(cookieParser('secret'));
router.use(session({
  secret :'secret',
  maxAge  : new Date(Date.now() + 3600000), //1 Hour
  expires : new Date(Date.now() + 3600000),
  resave : true,
  saveUninitialized : true,

}))
  
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
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(passport.initialize());
router.use(passport.session());

router.use(flash());


// global variable
router.use(function(req, res, next){
  res.locals.susess_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  res.locals.error = req.flash('error');
  next();
});

 


// check authentication

const checkAuthenticated = function(req, res, next){
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    return next();
} else {
    res.redirect('/admin');
}
}


const checkAuthenticatedLogin = function(req, res, next){
  if (req.isAuthenticated()) {
    res.redirect('/admin/dashboard');
    
  }
  return next();
}

  
 // Authentication strategy
 var localStrategy  = require('passport-local').Strategy;
 passport.use(new localStrategy({ usernameField : 'email' },(email, password, done)=>{
   user.findOne({ email : email}, (err, data)=>{
     if(err) throw err;
     if(!data){
       return done(null, false, {message : "User Dosen't Exists..."});
     }
     bcrypt.compare(password, data.password, (err, match)=>{
       if(err){
         return done(null, false);
       }
       if(!match){
         return done(null, false, {message : "Password Dosen't Match..."});
       }
       if(match){
         return done(null, data);
       }
     })
   })
 }))
 // End of authntication
 
 passport.serializeUser(function(user, cb){
   cb(null, user.id);
 });
 passport.deserializeUser(function(id, cb){
   user.findById(id, function(err, user){
     cb(err, user);
   })
 })  


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/login', { title : 'Login | Managepie', });
});

 // Login Passport authentication
router.post('/login', (req, res, next) => {

passport.authenticate('local', {
  failureRedirect : '/users',
  successRedirect : '/users/dashboard',
  failureFlash : true,
})(req, res, next)


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
