var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const user = require('./../models/users');

const admin_layout = "layouts/admin-dashboard";
// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/login', {title : 'Admin Dashboard | ManagePie'});
});


router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard', { layout : admin_layout, title : "Administrator | managepie.com"});

});


// create user
router.post('/createUser',[
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
     status : false,
     messaeg : 'Form velidation error',
     errors : errors.array(),
   });
 }
 


 const hashPassword = bcrypt.hashSync(req.body.password, 10);
 
// create new user model 
var temp = new  user({
  fullName : req.body.fullName,
  email : req.body.email,
  instName : req.body.instName,
  mobile : req.body.mobile,
  address : [{
    city : req.body.city,
    state : req.body.state,
    pincode : req.body.pincode,
  }],
  password : hashPassword,
});

// insert data into database
temp.save(function(err, result){
  if (err) {
    return  res.json({
      status : false,
      message : "DB Insert failed..",
      error : err
    });
  }
  // everthing is ok
  return  res.json({
    status : true,
    message : "data inserted",
    data : result
  });
});
});


router.post('/sendsms', (req, res) => {
 
 
    var validOptions = { apikey: 'eQd2legWgy8-rGnxk289ozJm0FIgTY1onkYsiWmMd2' };
    var tl = require('TextLocal')(validOptions);
    tl.sendSMS('8059112897', 'this is a test message', 'GRAPHW', function (err, data) {
      if (err) {
         res.send(err);
      }
      else{
         res.send(data);
      }
    });   

});
module.exports = router;
