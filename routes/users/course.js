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

// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (req, res) => {
    courses.find((err, courseData)=>{
        req.flash('error', 'Something went wrong    !');
        req.flash('success', req.user.name + " Course created successfully ");
        res.render('users/courses' , {title : "Courses | " + req.user.instName, layout : layout, courses : courseData});
    });
});
 
router.post('/', (req, res) => {
    var userController = new courses({
        userID : req.user.id,
        name : req.body.name,
        cerateDate : today,
        description : req.user.description,

    });
    userController.save((err, done)=>{
        if(err){
            console.log(err);
            req.flash('error', 'Something went wrong    !');
        }
        else{
            console.log("course created");
            req.flash('success', req.user.name + " Course created successfully ");
             res.redirect('/users/courses');
        }
    })

});
 



module.exports = router;
