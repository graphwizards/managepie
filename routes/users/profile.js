var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
 
const user = require('./../../models/users');
const plan = require('./../../models/plan');
var urlencode = require('urlencode');
const layout = "layouts/user-dashboard";
// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (req, res) => {
  plan.findOne({"name" : req.user.plan}, (err, planData)=>{
    if(err) throw err;
    res.render('users/profile', { title : req.user.instName, layout : layout, user : req.user, plan : planData});

  })
});
 
 
 



module.exports = router;
