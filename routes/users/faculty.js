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
res.send("courses");
});
 
 
 



module.exports = router;
