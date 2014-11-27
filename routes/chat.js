var mongoose = require('mongoose');

exports.chat = function(req, res){
    res.render('chatSample',
               {title: 'Socket.io sample'});
    mongoose.model('user').find(function(err, user){
        res.send(user); 
    });
}