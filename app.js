var express = require('express');
var app = express();
var session = require('express-session');
var server = require('http').Server(app);
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var chat = require('./routes/chat');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser({secret: "shirley"}));

try {
    mongoose.connect('mongodb://localhost/users');  
    console.log('Mongoose conencted');
}
catch (err) {
    console.log(err);
}

var Schema = mongoose.Schema;

var userSchema = new Schema({
    nameF: {
        type: String,
        required: true
    },
    nameL: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        requried: true
    },
    birthday: {
        type: Number,
        required: true
    },
    language_main: {
        type: String,
    }
});

var user = mongoose.model('users', userSchema);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
    console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

});

// What's gonna be on the screen
app.get('/', function(req, res){
    // Checking if session nameF exists
    // If yes, profile; if not, login page
    if (req.cookies.nameF) {
        res.redirect('/profile');
    }
    else {
        res.render('index',
                   {title: "Al-Learn"});   
    }
    console.log(req.cookies.nameF);
});

app.get('/login', function(req, res){
    if (req.cookies.nameF){
        res.redirect('/profile');   
    }
    else {
        res.render('login');
    }
    console.log("/login " + req.cookies.nameF);
});

app.get('/signup', function(req, res){
    res.render('signup');
    console.log("/signup " + req.cookies.nameF);
});

app.get('/profile', function(req, res){
    if (req.cookies.nameF) {
        res.render('profile');    
    }
    else {
        res.redirect('/login');
    }
    console.log("/profile " + req.cookies.nameF);
});

app.get('/user', function(req, res){
    user.find({}, function(err, users){
        if (err) {
            console.err(err);   
        }
        res.send(users);
    });
});

app.post('/loginCheck', function(req, res){
    console.log(req.body);
    user.findOne({nameF: req.body.nameF, nameL: req.body.nameL}, function(err, search){
        if (err){
            console.error(err);
        }
        else {
            if (search == null){
                console.log("No Result Found"); 
                res.redirect('/login');  
            }
            else {
                console.log("Logged as " + search);  
                res.cookie('nameF', req.body.nameF, {path: '/'});
                console.log(req.cookies.nameF);
                res.redirect('/profile');
            }
        }
    });
});

app.get('/logoff', function(req, res){
    res.clearCookie('nameF', { path: '/' }); 
    console.log('/logoff ' + req.cookies.nameF);
    res.redirect('/');
})

app.post('/registration', function(req, res){
    console.log(req.body); 
    var register = new user({
        nameF: req.body.nameF, 
        nameL: req.body.nameL,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.pass,
        birthday: req.body.birthday 
    });
    try {
        register.save();
        res.redirect('/login');
    }
    catch (err) {
        console.error(err);   
    }
    
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(8080, function(){
   console.log("server running"); 
});

module.exports = app;
