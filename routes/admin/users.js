var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const moment = require('moment');
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


// users views
router.get('/', (req, res) => {
  userData = user.find(function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      // premium users count
      user.count({"premium" : true}, (err, premiumdata)=>{
       if(err) throw err;
      //  total users count
       user.count( decodeURI(),(err, totalUser)=>{
       
        // isAscive users count
        user.count({"isActive" : true}, (err, activatedUser)=>{
          if(err) throw err;
          var deactivatedUsers = totalUser - activatedUser;
          // fetch Plans
          plan.find((err, plansData)=>{
            res.render('admin/users/index', {layout: admin_layout, title: "Users | managepie.com" , users : rows, premiumAccount : premiumdata, totalUser : totalUser, activatedUsers : activatedUser, deactivatedUsers : deactivatedUsers, plansData : plansData});
          
          });
          
        })
       })
     })
    }
  });
  
});

// Verify Payment
router.get('/paymentTrue/:id', (req, res) => {
    user.updateOne({_id:req.params.id},{"payment" : true, "premium" : true}, function (err, result) {
      if(err) throw err;
       res.redirect('/admin/users');
    });
});




// dissable user
router.get('/dissable/:id', (req, res) => {
    user.updateOne({_id:req.params.id},{"isActive" : false}, function (err, result) {
      if(err) throw err;
       res.redirect('/admin/users');
    });
});


// verify user
router.get('/verify/:id', (req, res) => {
    user.updateOne({_id:req.params.id},{"isActive" : true}, function (err, result) {
      if(err) throw err;
       res.redirect('/admin/users');
    });
});


 
router.get('/activePlan/:userID/:planID', (req, res) => {
  const userID = req.params.userID;
  const planID = req.params.planID;
 plan.findById(planID, (err, data)=>{
   if(err) throw err;
   var planName = data.name;
   var planCost = data.cost;
   var planDuration = data.duration;
   var startDate = moment().format("DD MMMM YYYY");
   if (planName == 'Demo') {
    var expiryDate = moment().add(7, 'd').format("DD MMMM YYYY");  
    var prime = false; 
  }
  else{
    var expiryDate = moment().add(planDuration, 'y').format("DD MMMM YYYY");   
    var prime = true; 
    }
    user.updateOne({_id:userID}, {"plan" : planName, "startDate" : startDate, "expiryDate" : expiryDate, "premium" : prime}, function(err, result){
      if(err){
        console.log(err);
      } 
      else{
        user.findById(userID,(err, userdata)=>{
          if(err) throw err;
          plan.findById(planID, (err, planData)=>{
            if(err) throw err;
            res.render('admin/users/upgradePlan',{layout : admin_layout, user : userdata, plan : planData, startDate : startDate, expiryDate : expiryDate, title : userdata.instName+"Checkout"});
          })
       
        });

      }
    });
 });
});
  
  // create user
  router.post('/createUser', [
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
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,      
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
  


module.exports = router;
