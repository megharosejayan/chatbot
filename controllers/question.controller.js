const Question = require('../models/question.model');
const Keyword = require('../models/keyword.model');
const Middleware = require('../utils/middleware');
const data = require('../utils/categories');
const bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function (app) {


	app.get('/questions', Middleware.isLoggedIn, function (req, res) {
		let currCategory = req.query.category;
		if (!data.categories.includes(currCategory))
			currCategory = false;

		let query = {};

		if (currCategory)
			query.category = currCategory;

		let currType = req.query.institutionType;
		if (!data.institutionTypes.includes(currType))
			currType = false;

		if (currType)
			query.institutionType = currType;

		Question.find(query, function (err, result) {
			if (err) {
				console.log("GET  /questions");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/"); //TODO
			}
			res.render("viewQuestions", { 'questions': result, categories: data.categories, currCategory: currCategory, institutionTypes: data.institutionTypes, currType: currType });
		})
	})

	app.get('/questions/new', Middleware.isLoggedIn, function (req, res) {
		res.render('editQuestion', {
			title: 'Create a new Question.,',
			question: false,
			action: "/questions/",
			categories: data.categories,
		});
	})

	app.get('/questions/:id/edit', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Question.findById(id, function (err, question) {
			if (err) {
				console.log("GET  /questions/:id/edit");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/questions"); 
			}
			question['labels'] = question['labels'].join(',');
			res.render('editQuestion', {
				title: 'Edit Question',
				question: question,
				action: "/questions/" + id,
				categories: data.categories,
			});
		})
	})

	app.post('/questions/:id', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Question.findByIdAndUpdate(id, req.body, function (err, question) {
			if (err) {
				console.log("POST  /questions/:id");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/questions"); 
			}
			console.log(question.id + ' updated.');
			req.flash("success", "Question updated successfully.");
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
				console.log("POST  /questions");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/questions"); 
			}
			console.log("Model Question " + result.id + " added to db");
			req.flash("success", "New model question added.");
			res.redirect('/questions');
		});
	})


	app.get('/questions/:id/delete', Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Question.findByIdAndRemove(id, function (err, question) {
			if (err) {
				console.log("GET  /questions/:id/delete");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/questions"); //TODO
			}
			console.log(question.id + ' deleted.');
			req.flash("success", "Question deleted.");
			return res.redirect('/questions');
		});
	})
};
