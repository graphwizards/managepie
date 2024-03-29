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

router.use(flash());

// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (req, res) => {
    courses.find((err, courseData)=>{
        var error = req.flash('error');
        var success = req.flash('success');
        res.render('users/courses' , {title : "Courses | " + req.user.instName, layout : layout, courses : courseData, error : error, success : success});
    });
});
 
router.post('/', (req, res) => {
    var userController = new courses({
        userID : req.user.id,
        name : req.body.name,
        createDate : today,
        description : req.body.description,
    });
    userController.save((err, done)=>{
        if(err){
            console.log(err);
            req.flash('error', 'Something went wrong    !');
            res.redirect('/users/courses');
        }
        else{
            console.log("course created");
            req.flash('success', req.body.name + " Course created successfully ");
             res.redirect('/users/courses');
        }
    })

});

router.get('/delete/:id', (req, res) => {
    courses.findByIdAndRemove(req.params.id, (err, done)=>{
        if(err){
            console.log(err);
            req.flash('error', "Error Something went wrong try again");
            res.redirect('/users/courses');
        }
    
        else{
            console.log("course created");
            req.flash('success', done.name + " Course  deleted ");
             res.redirect('/users/courses');
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
