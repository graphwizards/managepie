var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
var urlencode = require('urlencode');
const layout = "layouts/user-dashboard";
const moment = require('moment');
const today = moment().format("DD MMMM YYYY");
const flash  = require('req-flash');
const courses = require('./../../models/course');
const packages = require('./../../models/packages');

router.use(flash());

// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (req, res) => {
    packages.find((err, packagesData)=>{
        var error = req.flash('error');
        var success = req.flash('success');
        courses.find({"isActive" : true}, (error, courseData)=>{
            res.render('users/packages' , {title : "Courses | " + req.user.instName, layout : layout, packages : packagesData, error : error, success : success, courses : courseData});
        })
       
    });
});
 
router.post('/', (req, res) => {
  var setDuration = req.body.setDuration;
  if (!setDuration) {
      var durationActive = false;
      var duration = "";
      var durationPeriod  = "";
  } 
  else{
       var durationActive = true;
      var duration = req.body.duration;
      var durationPeriod = req.body.durationPeriod;
  }
  var packageControler = new packages ({
      userID : req.user.id,
      name : req.body.name,
      setDuration : durationActive,
      duration : duration,
      durationPeriod : durationPeriod,
      createDate : today,
      cost : req.body.cost,
      description : req.body.description,
  });
  packageControler.save((err, done)=>{
      if (err) {
          console.log(err);
          req.flash('error', 'Opps something went wrong try again');
           res.redirect('/users/packages');
          
      }
      else{
        req.flash('success', 'Package Created Success');
        res.redirect('/users/packages');
      }
  })

});

router.get('/delete/:id', (req, res) => {
    packages.findByIdAndRemove(req.params.id, (err, done)=>{
        if(err){
            console.log(err);
            req.flash('error', "Error Something went wrong try again");
            res.redirect('/users/packages');
        }
    
        else{
            console.log("course created");
            req.flash('success', done.name + " Package  deleted ");
             res.redirect('/users/packages');
        }
    })
});


router.post('/createSubject', (req, res) => {
    var courseID = req.body.course;
    courses.findByIdAndUpdate(courseID, {$push : {subjects : {"name" : req.body.name,  "createDate" : today, "description" : req.body.description, "isActive" : true}}}, (err, done)=>{
        if (err) {
            req.flash('error',  "  Something went wrong please try again ");
            res.redirect('/users/courses');
        }
        else{
            console.log("course created");
            req.flash('success', done.name + " Subject Created  deleted ");
             res.redirect('/users/courses');
        }
    })
});
 



module.exports = router;
