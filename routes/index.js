var express = require('express');
var router = express.Router();
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const plan = require('./../models/plan');
 // Get Ip Address
const requestIp = require('request-ip');
var geoip = require('geoip-lite');

 
router.use(requestIp.mw());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

plan.find((err, result)=>{
  if(err) throw err;
  planDetail = result;
});


// get user ip address  and detail
function getIpAddress(req, title) {
  const ip = req.clientIp;
  var geo = geoip.lookup(ip);
  if (geo = "null") {
    console.log(ip, title);
  }
  else{
    console.log("IP is " + ip + "\n" + geo + "\n" + title);
  }
 
   
}
/* GET home page. */
router.get('/', function(req, res, next) {
  var title = 'ManagePie | Best Institute Management System';
  getIpAddress(req, title);
  res.render('index', { title: title, plans : planDetail, activeHomeBtn : "active"});
});

module.exports = router;
