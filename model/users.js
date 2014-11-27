var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
    age: {
        type: Number,
        required: true
    },
    language_main: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user', userSchema);