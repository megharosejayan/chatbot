var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailsSchema = new Schema({
  ip:  String, // String is shorthand for {type: String}
  date: { type: String }
});
module.exports = mongoose.model("details", DetailsSchema);