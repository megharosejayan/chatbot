const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let InstitutionSchema = new Schema({
    name: String,
    institutionType: String,
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserQuestion" }],
})

module.exports = mongoose.model("Institution", InstitutionSchema);