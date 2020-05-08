var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');

// End of routers
const {check, validationResult} = require('express-validator');
const user = require('./../../models/users');
const admin = require('./../../models/admin');
const plan = require('./../../models/plan');

// fetch admin
admin.find((err, data)=>{
    if(err) throw err;
    adminData = data;
});

// fetch users
user.find((err, data)=>{
    if(err) throw err;
    userData = data;
});

// fetch Plans 
plan.find((err, data)=>{
    if(err) throw err;
    planData = data;
});

// middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

const   admin_layout  = "layouts/admin-dashboard";

router.get('/', (req, res) => {
    res.render('admin/database/index', {title : "Database | Managepie.com" , layout : admin_layout, databasePath : true, admin : adminData, users : userData, plans : planData});

});

module.exports = router;