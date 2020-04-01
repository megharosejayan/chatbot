const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let InstitutionSchema = new Schema({
    name: String,
    category: String,
})

module.exports = mongoose.model("Institution", InstitutionSchema);