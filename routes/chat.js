var mongoose = require('mongoose');

exports.chat = function(req, res){
    res.render('chat',
               {title: 'Chat'});
    mongoose.model('user').find(function(err, user){
        res.send(user); 
    });
}