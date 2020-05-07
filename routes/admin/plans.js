var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {
    check,
    validationResult
  } = require('express-validator');
  const plan = require('./../../models/plan');
  
  var urlencode = require('urlencode');
  const admin_layout = "layouts/admin-dashboard";
   

  // middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));


/* GET home page. */
router.get('/', function(req, res, next) {
    plan.find((err, planData)=>{
        res.render('admin/plans/index', { packagePath : "packagePath", title: 'Plans | managepie.com', layout : admin_layout, planData : planData });
    }).sort({ "cost": 1 });
  
});

router.post('/createPlan',[
    // check fields
    check('name').not().isEmpty().trim().escape(),
 
    check('cost').not().isEmpty().escape(),
    check('duration').not().isEmpty().trim().escape(),
 
  ], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        messaeg: 'Form velidation error',
        errors: errors.array(),
      });
    }

    var planAdd = new plan({
        name : req.body.name,
        cost : req.body.cost,
        duration : req.body.duration,
        durationPeriod : req.body.durationPeriod,
        isPremium : req.body.premium,
    });

    planAdd.save(function (err, result){
        if(err) throw err;
         res.redirect('/admin/plans');
    });
});

module.exports = router;
