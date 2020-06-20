var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const flash  = require('req-flash');
const user = require('./../../models/users');
const plan = require('./../../models/plan');
var urlencode = require('urlencode');
const layout = "layouts/user-dashboard";
// middleware

router.use(flash());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (req, res) => {
  plan.findOne({"name" : req.user.plan}, (err, planData)=>{
    if(err) throw err;
    var error = req.flash('err');
    var success = req.flash('success');
    res.render('users/profile', { title : req.user.instName, layout : layout, user : req.user, plan : planData, error : error, success : success});

  })
});


router.get('/clearLogs', (req, res) => {
  user.findByIdAndUpdate(req.user.id, {$pull : {logs : {}}}, (err, done)=>{
    if(err){
      console.log(err);
      req.flash('error', "Opps something went wrong try again");
    }
    else{
      req.flash('success', "Logs deleted successfully");
       res.redirect('/users/profile');
    }
  })
});

router.get('/edit', (req, res) => {
  es.render('users/editProfile', { title : req.user.instName, layout : layout, user : req.user });
});
 
 



module.exports = router;
