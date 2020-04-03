var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailsSchema = new Schema({
  ip:  String, // String is shorthand for {type: String}
  question: String,
  date: { type: String }
});
module.exports = mongoose.model("details", DetailsSchema);
// I don't really know why this is here.
