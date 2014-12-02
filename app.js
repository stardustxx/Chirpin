var express = require('express');
var app = express();
var session = require('express-session');
var server = require('http').Server(app);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')(server); // Let socket.io to listen on express port
var mongoose = require('mongoose');

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

var cookieEmail;
var cookieInfo = new Object();

var passingData = function(obj){
    cookieInfo.nameF = obj.nameF;
    cookieInfo.nameL = obj.nameL;
    cookieInfo.nickname = obj.nickname;
    cookieInfo.email = obj.email;
    cookieInfo.password = obj.password;
}

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
        type: String
    },
    point: {
        type: Number   
    },
    online: {
        type: Boolean   
    }
});

var user = mongoose.model('users', userSchema);

io.on('connection', function(socket){
    var time = new Date();
    
    var obj = new Object();
    obj['type'] = '';
    obj['username'] = '';
    obj['msg'] = '';
    
    if (cookieEmail != null){
        user.findOne({email: cookieEmail}, function(err, result){
            if (err){
                conosle.err(err);   
            }
            else if(result != null){
                user.update({email: cookieEmail}, {online: true}).exec();
                console.log(result.nameF + " " + result.nameL + " has connected");
                obj['type'] = 'login';
                obj['username'] = result.nameF;
                obj['msg'] = "";
                socket.emit('who', obj);
                socket.broadcast.emit('login', obj);
                console.log(obj);
            }   
        });
    }
    socket.on('disconnect', function(){
        user.findOne({email: cookieEmail}, function(err, result){
            if (err){
                conosle.err(err);   
            }
            else if(result != null){
                console.log(result.nameF + " " + result.nameL + " has disconnected");
                user.update({email: cookieEmail}, {online: false}).exec();
            }   
        });
    });

    socket.on('chat message', function(msg){
        console.log(msg.name + ': ' + msg.msg);
        obj['type'] = 'msg';
        obj['username'] = msg.name;
        obj['msg'] = msg.msg;
        io.emit('chat message', obj);
    });
});

// What's gonna be on the screen
app.get('/', function(req, res){
    // Checking if session nameF exists
    // If yes, profile; if not, login page
    if (req.cookies.email) {
        res.redirect('/profile');
    }
    else {
        res.render('index',
                   {title: "Al-Learn"});   
    }
    console.log(req.cookies.email);
});

app.get('/login', function(req, res){
    if (req.cookies.email){
        res.redirect('/profile');   
    }
    else {
        res.render('login');
    }
    console.log("/login " + req.cookies.email);
});

app.get('/signup', function(req, res){
    if (req.cookies.email){
        res.redirect('profile');   
    }
    else {
        console.log("/signup " + req.cookies.email);
        res.render('signup');   
    }
});

app.get('/profile', function(req, res){
    if (req.cookies.email) {
        cookieEmail = req.cookies.email;
        user.findOne({email: req.cookies.email}, function(err, search){
            if (err){
                console.err(err);   
            }
            else {
                if (search) {
                    var year = new Date();
                    age = year.getFullYear() - search.birthday;
                    res.render('profile', {name: search.nameF,
                                           email: search.email});    
                }
                else {
                    res.redirect('/');   
                }
                
            }
        }); 
    }
    else {
        res.redirect('/login');
    }
    console.log("/profile " + req.cookies.email);
});

app.get('/chat', function(req, res){
    if (req.cookies.email){
        cookieEmail = req.cookies.email;
        res.render('chat');
    }
    else {
        res.redirect('/profile');   
    }
});

app.get('/online', function(req, res){
    if (req.cookies.email){
        user.find({}, function(err, result){
            res.render('online', {name: result});
        });
    }
});

app.post('/loginCheck', function(req, res){
    console.log(req.body);
    user.findOne({email: req.body.email, password: req.body.pass}, function(err, search){
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
                res.cookie('email', req.body.email, {path: '/'});
                passingData(search);
                console.log("/logincheck " + req.cookies.email);
                res.redirect('/profile');
            }
        }
    });
});

app.get('/logoff', function(req, res){
    res.clearCookie('email', { path: '/' }); 
    console.log('/logoff ' + req.cookies.email);
    cookieEmail = "";
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
        birthday: req.body.birthday,
        language_main: "English",
        point: 0,
        online: false
    });
    try {
        register.save();
        res.redirect('/login');
    }
    catch (err) {
        console.error(err);   
    }
    
});


app.get('/user', function(req, res){
    user.find({}, function(err, users){
        if (err) {
            console.err(err);   
        }
        res.send(users);
    });
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
