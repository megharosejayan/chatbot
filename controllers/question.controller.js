const Question = require('../models/question.model');
const bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports=function(app){

	app.get('/questions', function(req, res) {
		Question.find({}, function(err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			res.render("viewQuestions", {'questions': result});
		})
	})

	app.get('/questions/new', function(req, res){
		res.render('editQuestion', {
			title: 'Create a new Question.,',
			question: false,
		});
	})

	app.get('/questions/:id/edit', urlencodedParser, function(req, res){
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
	})

	app.post('/questions/:id', function(req, res){
		let id = req.params.id;
		Question.findByIdAndUpdate(id, function(err, question) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			console.log(question.id + ' updated.');
			res.redirect('/questions');	
		});
	})

	app.post('/questions', urlencodedParser, function(req, res) {
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
	})

};