const Question = require('../models/question.model');

exports.viewAll = function(req, res) {
	Question.find({}, function(err, result) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		res.render("viewQuestions", {'questions': result});
	})
}

exports.saveQuestion = function(req, res) {
	let question = req.body;
	question['labels'] = question['labels'].split(',');

	// TODO: trim

	newQuestion = new Question(question);
	newQuestion.save(function(err, result) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		res.redirect('/questions');
	});
}