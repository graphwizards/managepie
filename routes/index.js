var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const plan = require('./../models/plan');
 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

plan.find((err, result)=>{
  if(err) throw err;
  planDetail = result;
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ManagePie | Best Institute Management System', plans : planDetail, activeHomeBtn : "active"});
});

module.exports = router;
