const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserQuestionSchema = new Schema({
	query: {type: String, required: true, max: 200},
	answer: String,
	category: String,
	institutionType: String,
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
    model: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
	labels: [
		{
			type: String
		}
	],
	dateCreated: Date,
})

module.exports = mongoose.model("UserQuestion", UserQuestionSchema);