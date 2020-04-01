const Question = require('../models/question.model');
const Keyword = require('../models/keyword.model');
const Middleware = require('../utils/middleware');
const bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function (app) {

	
	app.get('/questions', Middleware.isLoggedIn, function (req, res) {
		Question.find({}, function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			res.render("viewQuestions", { 'questions': result });
		})
	})

	app.get('/questions/new', Middleware.isLoggedIn, function (req, res) {
		res.render('editQuestion', {
			title: 'Create a new Question.,',
			question: false,
		});
	})

	app.get('/questions/:id/edit', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Question.findById(id, function (err, question) {
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

	app.post('/questions/:id', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Question.findByIdAndUpdate(id, req.body, function (err, question) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			console.log(question.id + ' updated.');
			res.redirect('/questions');
		});
	})

	app.post('/questions', Middleware.isLoggedIn, urlencodedParser, function (req, res) {
		let question = req.body;

		let labels = question['labels'].match(/(\w+)/g);
		question['labelString'] = labels;

		newQuestion = new Question(question);
		newQuestion.save(function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			let q_id = result.id;
			saveKeywords(labels, q_id);
			res.redirect('/questions');

		});
	})

	
	app.get('/questions/:id/delete', Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Question.findByIdAndRemove(id, function (err, question) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			console.log(question.id + ' deleted.');
			return res.redirect('/questions');
		});
	})
};

function saveKeywords(keywords, q_id) {

	options = { upsert: true, new: true, setDefaultsOnInsert: true };

	keywords.forEach(keyword => {
		keyword = keyword.toLowerCase();
		Keyword.updateOne(
			{ keyword: keyword },
			{ $push: { questions: q_id } },
			options,
			function (err, result) {
				if (err) { console.log(err); }
				console.log(result);
			}
		)
	});


}