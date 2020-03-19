const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let QuestionSchema = new Schema({
	query: {type: String, required: true, max: 200},
	answer: String,
	labels: [
		{
			type: String
		}
	],
	dateCreated: Date,
})

module.exports = mongoose.model("Question", QuestionSchema);