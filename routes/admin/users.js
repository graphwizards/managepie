var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const moment = require('moment');
// password generator
var generatePassword = require('password-generator');
const {
  check,
  validationResult
} = require('express-validator');
const user = require('./../../models/users');
const plan = require('./../../models/plan');
var urlencode = require('urlencode');
const admin_layout = "layouts/admin-dashboard";
// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
// fetch plans
plan.find((err, result)=>{
  if(err) throw err;
  planDetail = result;
});
// fetch users
user.find((err, result)=>{
  if(err) throw err;
  userdata = result;
});
// user find by id
function userbyid(id) {
  user.findById(id,(err, result)=>{
    if(err) throw err;
   
  });
}
// plan findbyid
function planbyid(id) {
  plan.findById(id,(err, result)=>{
    if(err) throw err;
   
  });
}
// users views
router.get('/', (req, res) => {
      // premium users count
      user.count({ "premium": true }, (err, premiumdata) => {
        if (err) throw err;
        //  total users count
        user.count(decodeURI(), (err, totalUser) => {
          // isAscive users count
          user.count({ "isActive": true }, (err, activatedUser) => {
            if (err) throw err;
            var deactivatedUsers = totalUser - activatedUser;
            // fetch Plans
              res.render('admin/users/index', { layout: admin_layout, userPath : "userPath", title: "Users | managepie.com", users: userdata, premiumAccount: premiumdata, totalUser: totalUser, activatedUsers: activatedUser, deactivatedUsers: deactivatedUsers, plansData: planDetail });
          });
        })
      })
});
// Verify Payment
router.get('/paymentTrue/:id', (req, res) => {  
  var userId = req.params.id;  
  try {
    user.findByIdAndUpdate(userId, {"payment": true}, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
     res.json(error);
  }
});
// dissable user
router.get('/dissable/:id', (req, res) => {
  var userId = req.params.id;
  user.updateOne({_id:userId}, { "isActive": false }, function (err, result) {
    if (err) throw err;
    res.redirect('/admin/users');
  });
});
// verify user
router.get('/verify/:id', (req, res) => {
  user.updateOne({_id:req.params.id }, { "isActive": true }, function (err, result) {
    if (err) throw err;
    res.redirect('/admin/users');
  });
});
router.get('/activePlan/:userID/:planID', (req, res) => {
  const userID = req.params.userID;
  const planID = req.params.planID;
  user.findById(userID, (err, userdata) => {
    if (err) throw err;
    plan.findById(planID, (err, planData) => {
      if (err) throw err;
      var planName = planData.name;
      var planDuration = planData.duration;
      var planDurationPeriod = planData.durationPeriod;
      var startDate = moment().format("DD MMMM YYYY");
      // set expiry dates 
      if (planDurationPeriod == "Days") {
        var expiryDate = moment().add(planDuration, 'd').format("DD MMMM YYYY");
      }
      else if (planDurationPeriod == "Month") {
        var expiryDate = moment().add(planDuration, 'M').format("DD MMMM YYYY");
      }
      else {
        var expiryDate = moment().add(planDuration, 'y').format("DD MMMM YYYY");
      }
      // End of expiry date setup
      res.render('admin/users/upgradePlan', { layout: admin_layout, user: userdata, plan: planData, startDate: startDate, expiryDate: expiryDate, title: userdata.instName + " | Checkout" });
    });
  });
});
router.get('/confirmPayment/:userID/:planID', (req, res) => {
    const userID = req.params.userID;
    const planID = req.params.planID;
   plan.findById(planID, (err, data)=>{
    //  if error 
     if(err) throw err;
    //  if all are ok
    var planName = data.name;
    var planDuration = data.duration;
    var planDurationPeriod = data.durationPeriod;
    var planPremium = data.isPremium;
    var startDate = moment().format("DD MMMM YYYY");
    // set expiry dates 
    if (planDurationPeriod == "Days") {
      var expiryDate = moment().add(planDuration, 'd').format("DD MMMM YYYY");
    }
    else if (planDurationPeriod == "Month") {
      var expiryDate = moment().add(planDuration, 'M').format("DD MMMM YYYY");
    }
    else {
      var expiryDate = moment().add(planDuration, 'y').format("DD MMMM YYYY");
    }
    if (planName == "Demo" || planName == "demo"){
      user.findById(userID,(err, usersData)=>{
      var checkDemo  = usersData.demo;
      if (checkDemo == true){
             res.send("Your Demo Period was finish please try premium");
      }
      else{
        user.updateOne({_id:userID}, {"plan" : planName, "startDate" : startDate, "expiryDate" : expiryDate, "premium" : planPremium, "demo" : true,}, function(err, result){
          if(err){
            console.log(err);
          } 
          else{
            res.redirect('/admin/users');
         }
      });
      };
      });
    }
    else{
      user.updateOne({_id:userID}, {"plan" : planName, "startDate" : startDate, "expiryDate" : expiryDate, "premium" : planPremium}, function(err, result){
        if(err){
          console.log(err);
        } 
        else{
          res.redirect('/admin/users');
       }
    });
    };
   });
});
router.get('/register', (req, res) => {
  res.render('admin/users/registration', { layout: admin_layout, userPath : "userPath", title: "Users | managepie.com", plans : planDetail, user : userdata});
});


// create user
router.post('/createUser', [
  // check fields
  check('fullName').not().isEmpty().trim(),
  check('perMobile').not().isEmpty().trim(),
  check('email').isEmail().normalizeEmail(),
  check('instName').not().isEmpty(),
  check('mobile').not().isEmpty().trim(),
  check('street').not().isEmpty().trim(),
  check('city').not().isEmpty().trim(),
  check('state').not().isEmpty().trim(),
  check('pincode').not().isEmpty().trim(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(errors);
  }
  planValue = req.body.plan;
   plan.findById(planValue, (err, planresult)=>{
     if(err) throw err;
     var planName = planresult.name;
     var planDuration = planresult.duration;
     var planDurationPeriod = planresult.planDurationPeriod;
     var planPremium = planresult.isPremium;
     var startDate = moment().format("DD MMMM YYYY");
       // set expiry dates 
    if (planDurationPeriod == "Days") {
      var expiryDate = moment().add(planDuration, 'd').format("DD MMMM YYYY");
    }
    else if (planDurationPeriod == "Month") {
      var expiryDate = moment().add(planDuration, 'M').format("DD MMMM YYYY");
    }
    else {
      var expiryDate = moment().add(planDuration, 'y').format("DD MMMM YYYY");
    }
    if (planName == "Demo" || planName == "demo") {
      var demo_value = true;
    }
    else{
      var demo_value = false;
    }
    // generate password
    var newPassword = generatePassword(6, false);
    const hashPassword = bcrypt.hashSync(newPassword, 10);
    // create new user model 
    var temp = new user({
      fullName: req.body.fullName,
      perMobile : req.body.perMobile,
      email: req.body.email,
      instName: req.body.instName,
      startDate : startDate,
      expiryDate : expiryDate,
      demo : true,
      mobile: req.body.mobile,
      street : req.body.street,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      password: hashPassword,
      premium : planPremium,
      demo : demo_value,
      logs : [{
        lastLogin : "",
        ip : "",
        location : "",
        browser : "",
      }],
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
       res.redirect('/admin/users');
    });
     
   });

});
module.exports = router;
