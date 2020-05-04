var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const user = require('./../models/users');

// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/login', {title : 'Admin Dashboard | ManagePie'});
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

module.exports = router;