var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
var urlencode = require('urlencode');
 
const { check,  validationResult} = require('express-validator');


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
const user = require('./../models/users');
const admin = require('./../models/admin');

const admin_layout = "layouts/admin-dashboard";
// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));


// routers 
const  userRouter = require('./admin/users');
const  plansRouter = require('./admin/plans');
const FetchDataBase = require('./admin/database')

// routers
router.use('/users', userRouter);
router.use('/plans', plansRouter);
router.use('/database', FetchDataBase);



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/login', {
    title: 'Admin Dashboard | ManagePie', layout : admin_layout
  });
});


router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard', {
    layout: admin_layout,
    title: "Dashboard | managepie.com"
  });

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