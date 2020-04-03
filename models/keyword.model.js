const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let KeywordSchema = new Schema({
    keyword: { type: String, required: true, max: 20 },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    institution: { type: Schema.Types.ObjectId, ref: "Institution" },
})

module.exports = mongoose.model("Keyword", KeywordSchema);