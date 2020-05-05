var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {
  check,
  validationResult
} = require('express-validator');
const user = require('./../models/users');
const admin = require('./../models/admin');
var urlencode = require('urlencode');

const admin_layout = "layouts/admin-dashboard";
// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/login', {
    title: 'Admin Dashboard | ManagePie'
  });
});


router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard', {
    layout: admin_layout,
    title: "Dashboard | managepie.com"
  });

});

// users views
router.get('/dashboard/users', (req, res) => {
  userData = user.find(function(err, rows){
    if(err){
      console.log(err);
    }
    else{
     user.count({"payment" : true}, (err, premiumdata)=>{
       if(err) throw err;
       user.count((err, totalUser)=>{
        res.render('admin/users/index', {layout: admin_layout, title: "Users | managepie.com" , users : rows, premiumAccount : premiumdata, totalUser : totalUser});
       })
     })
    }
  });
 
});

router.get('/dashboard/users/paymentTrue/:id', (req, res) => {
  user.updateOne({_id:req.params.id},{"payment" : true}, function (err, result) {
    if(err) throw err;
     res.redirect('/admin/dashboard/users');
  });
});

// dissable user
router.get('/dashboard/users/dissable/:id', (req, res) => {
  user.updateOne({_id:req.params.id},{"isActive" : false}, function (err, result) {
    if(err) throw err;
     res.redirect('/admin/dashboard/users');
  });
});

// verify user
router.get('/dashboard/users/verify/:id', (req, res) => {
  user.updateOne({_id:req.params.id},{"isActive" : true}, function (err, result) {
    if(err) throw err;
     res.redirect('/admin/dashboard/users');
  });
});


// create user
router.post('/dashboard/users/createUser', [
  // check fields
  check('fullName').not().isEmpty().trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('instName').not().isEmpty().escape(),
  check('mobile').not().isEmpty().trim().escape(),
  check('city').not().isEmpty().trim().escape(),
  check('state').not().isEmpty().trim().escape(),
  check('pincode').not().isEmpty().trim().escape(),
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
  var temp = new user({
    fullName: req.body.fullName,
    email: req.body.email,
    instName: req.body.instName,
    mobile: req.body.mobile,
    address: [{
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
    }],
    password: hashPassword,
  });

  // insert data into database
  temp.save(function (err, result) {
    if (err) {
      return res.json({
        status: false,
        message: "DB Insert failed..",
        error: err
      });
    }
    // everthing is ok
    return res.json({
      status: true,
      message: "data inserted",
      data: result
    });
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

  var sender = 'MNGPIE';
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