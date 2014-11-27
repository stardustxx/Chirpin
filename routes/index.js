var express = require('express');
var app = express();

exports.login = function(req, res){
    res.render('login');
}

exports.signup = function(req, res){
    res.render('signup');   
}





//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
//});
//
//module.exports = router;
