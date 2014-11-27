var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({
    point: Number,
    user: Schema.ObjectId
});

module.exports = mongoose.model('point', pointSchema);