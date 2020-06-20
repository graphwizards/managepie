var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const urlencode = require('urlencode');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { check,  validationResult} = require('express-validator');


const moment = require('moment');
const today = moment().format("DD MMMM YYYY");
const todayFull = moment().format("DD MMMM YYYY, h:mm:ss a");


/* -------------------------------------------------------------------------- */
/*                               Get IP Address                               */
/* -------------------------------------------------------------------------- */

const requestIp = require('request-ip');
const geoip = require('geoip-lite');




router.use(cookieParser('secret'));

router.use(session({
  secret :'secret',
  maxAge  : new Date(Date.now() + 3600000), //1 Hour
  expires : new Date(Date.now() + 3600000),
  resave : true,
  saveUninitialized : true,
  cookie:{
    maxAge: 100000000000000
}
}));
router.use(passport.initialize());
router.use(passport.session());
const user = require('./../models/users');
var minifyHTML = require('express-minify-html');

router.use(cookieParser('secret'));
 
  
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
 
 // ///////////////////////////////////////////////////////////////////////////////////// Check Authentication
const checkUserAuthenticated = function(req, res, next){
  if (req.isAuthenticated()) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    return next();
} else {
    res.redirect('/users');
}
}
const checkUserAuthenticatedLogin = function(req, res, next){
  if (req.isAuthenticated()) {
    res.redirect('/users/dashboard');
  }
  return next();
}
 
// ///////////////////////////////////////////////////////////////////// Admin Authentication
 
var LocalStrategy  = require('passport-local').Strategy;
passport.use('users', new LocalStrategy({ usernameField : 'email' },(email, password, done)=>{
  user.findOne({ email : email}, (err, data)=>{
    if(err) throw err;
    if(!data){
      return done(null, false, {message : "user Dosen't Exists..."});
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
    });
  });
}));
 

// ////////////////////////////////////////////////////////////////////////// Routes
const profileRouts = require('./users/profile');
const courseRoutes = require('./users/course');
const packagesRouter = require('./users/packages');
const plan = require('../models/plan');

router.use('/profile',checkUserAuthenticated, profileRouts);
router.use('/courses', checkUserAuthenticated, courseRoutes);
router.use('/packages', checkUserAuthenticated, packagesRouter);


/* GET users listing. */
router.get('/',  function(req, res, next) {
  res.render('users/login', { title : 'Login | Managepie', });
});





router.post('/login', (req, res, next) => {
  passport.authenticate('users', {
    failureRedirect : '/users',
    successRedirect : '/users/saveLogin',
    failureFlash : true,
  })(req, res, next)
  
});

router.get('/saveLogin', (req, res) => {
  // const ip = req.clientIp;
  const ip = "192.206.151.131";
  const geo = geoip.lookup(ip);
  const city = geo.city;
  const timzone = geo.timzone;
  const userId = req.user.id; 
  user.findByIdAndUpdate(userId, { $push : {logs : {"lastLogin" : todayFull, "ip" : ip, "location" : city, "timezone" : timzone}}}, (err, done)=>{
    if(err) throw err;
    res.redirect('/users/dashboard');

  })

});


router.get('/dashboard',checkUserAuthenticated, (req, res) => {
  plan.findOne({"name" : req.user.plan}, (err, planData)=>{
    res.render('users/dashboard', {layout : dashboard_layout, title : req.user.instName + " | Managepie.com", user : req.user, plan : planData});
    console.log(req.user);
  })
  
});

router.get('/logout', (req, res) => {
 res.redirect('/users');
});

 
 router.get('/users/register',checkUserAuthenticated, (req, res) => {
   res.render('users/register', { title : 'Request Free Demo | Managepie'});
 });

module.exports = router;
