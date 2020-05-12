var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
var urlencode = require('urlencode');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
 
const { check,  validationResult} = require('express-validator');

router.use(cookieParser('secret'));
router.use(session({
  secret :'secret',
  maxAge  : new Date(Date.now() + 3600000), //1 Hour
  expires : new Date(Date.now() + 3600000),
  resave : true,
  saveUninitialized : true,

}));


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

// modles
 
const admin = require('./../models/admin');

const admin_layout = "layouts/admin-dashboard";
// middleware
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

// routers 
const  userRouter = require('./admin/users');
const  plansRouter = require('./admin/plans');
const FetchDataBase = require('./admin/database')





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


// routers
router.use('/users',checkAuthenticated, userRouter);
router.use('/plans',checkAuthenticated, plansRouter);
router.use('/database',checkAuthenticated, FetchDataBase);


/* GET users listing. */
router.get('/',checkAuthenticatedLogin, function (req, res, next) {
  res.render('admin/login', {
    title: 'Admin Login | ManagePie' 
  });
});


 



// Login Passport authentication
router.post('/login', (req, res, next) => {
  // Authentication strategy
var localStrategy  = require('passport-local').Strategy;
passport.use(new localStrategy({ usernameField : 'email' },(email, password, done)=>{
  admin.findOne({ email : email}, (err, data)=>{
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

passport.serializeUser(function(user, cb){
  cb(null, user.id);
});
passport.deserializeUser(function(id, cb){
  admin.findById(id, function(err, user){
    cb(err, user);
  })
})  
  passport.authenticate('local', {
    failureRedirect : '/admin',
    successRedirect : '/admin/dashboard',
    failureFlash : true,
  })(req, res, next)
 
 
});

router.get('/dashboard',checkAuthenticated, (req, res) => {
  res.render('admin/dashboard', {
    layout: admin_layout,
    title: "Dashboard | managepie.com",
    admin : req.user,
  });
  console.log(req.user);  
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
   res.redirect('/');

});
 



// create admin
router.post('/createadmin', [
  // check fields
  check('fullName').not().isEmpty().trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('username').not().isEmpty().escape(),
  check('mobile').not().isEmpty().trim().escape(),
  check('password').not().isEmpty().trim().escape(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      messaeg: 'Form velidation error',
      errors: errors.array(),
    });
  }



  const hashPassword = bcrypt.hashSync(req.body.password, 10);

  // create new user model 
  var adminControler = new admin({
    fullName: req.body.fullName,
    email: req.body.email,
    username: req.body.username,
    mobile: req.body.mobile,
    password: hashPassword,
  });

  // insert data into database
  adminControler.save(function (err, result) {
    if (err) {
      return res.json({
        status: false,
        message: "DB Insert failed..",
        error: err
      });
    }
    // everthing is ok
    var msg = urlencode('Hey! ' + req.body.fullName + ' you are register as a administrator in managepie');
    var number = req.body.mobile;
    var apikey = 'eQd2legWgy8-rGnxk289ozJm0FIgTY1onkYsiWmMd2';

    var sender = 'TXTLCL';
    var data = 'apikey=' + apikey + '&sender=' + sender + '&numbers=' + number + '&message=' + msg
    var options = {
      host: 'api.textlocal.in',
      path: '/send?' + data
    };

    callback = function (response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });
      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        return res.json({
          status: true,
          message: "data inserted",
          data: result
        });
      });
    }

    //console.log('hello js'))
    http.request(options, callback).end();

  });
});




// send SMS
router.post('/sendsms', [
  // check fields
  check('mobile').not().isEmpty().trim().escape(),
  check('message').not().isEmpty().trim(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      messaeg: 'Form velidation error',
      errors: errors.array(),
    });
  }

  var msg = urlencode(req.body.message);
  var number = req.body.mobile;
  var apikey = 'eQd2legWgy8-rGnxk289ozJm0FIgTY1onkYsiWmMd2';

  var sender = 'TCTLCL';
  var data = 'apikey=' + apikey + '&sender=' + sender + '&numbers=' + number + '&message=' + msg
  var options = {
    host: 'api.textlocal.in',
    path: '/send?' + data
  };

  callback = function (response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      res.send(str);
    });
  }

  //console.log('hello js'))
  http.request(options, callback).end();
});


module.exports = router;