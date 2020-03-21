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

exports.newQuestion = function(req, res){
	res.render('editQuestion', {
		title: 'Create a new Question.,',
		question: false,
	});
}

exports.editQuestion = function(req, res){
	let id = req.params.id;
	Question.findById(id, function(err, question) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		question['labels'] = question['labels'].join(',');
		res.render('editQuestion', {
			title: 'Edit Question', 
			question: question,
		});	
	})
}

exports.updateQuestion = function(req, res){
	let id = req.params.id;
	Question.findByIdAndUpdate(id, function(err, question) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		console.log(question.id + ' updated.');
		res.redirect('/questions');	
	});
}

exports.saveQuestion = function(req, res) {
	let question = req.body;
	question['labelString'] = question['labels'].split(',');

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

exports.getAnswer = function(req,res) {
	let questions = req.body;
	
	Question.find({}, function(err, questions) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		console.log("status 200");
		let index = Math.floor(Math.random() * questions.length);

		let data = {answer: questions[index]['answer']};

		res.json(data);
	})

}