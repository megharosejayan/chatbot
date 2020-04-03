const Question = require('../models/question.model');
const Institution = require('../models/institution.model');
const UserQuestion = require('../models/userQuestion.model');
const Keyword = require('../models/keyword.model');
const Middleware = require('../utils/middleware');
const data = require('../utils/categories');
const bodyParser = require('body-parser');
const async = require('async');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function (app) {


	app.get('/institution/questions', Middleware.isLoggedIn, function (req, res) {
		let currCategory = req.query.category;
		if (!data.categories.includes(currCategory))
			currCategory = false;

		let query = {};
		if (currCategory)
			query = { category: currCategory };
		Institution.findById(req.user.institution)
			.populate({
				path: 'questions',
				match: query,
			})
			.exec((err, result) => {
				if (err) {
					console.log(err);
					res.send(err);
				}
				res.render("viewUserQuestions", { 'questions': result.questions, categories: data.categories, currCategory: currCategory });
			});
	})


	app.get('/institution/questions/select', Middleware.isLoggedIn, function (req, res) {
		let institutionType = req.user.institutionType;

		if (!institutionType) {
			return res.send("Error. User does not have associated Institution Type.")
		}

		let currCategory = req.query.category;
		if (!data.categories.includes(currCategory))
			currCategory = false;

		let query = { institutionType: institutionType };

		if (currCategory)
			query = { category: currCategory };
		Question.find(query, function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			res.render("selectQuestions", { 'questions': result, categories: data.categories, currCategory: currCategory });
		})
	})

	app.get('/institution/questions/new', Middleware.isLoggedIn, function (req, res) {
		res.render('editQuestion', {
			title: 'Create a new Question,',
			question: false,
			action: "/institution/questions",
			categories: data.categories,
		});
	})

	
	app.post('/institution/questions', Middleware.isLoggedIn, urlencodedParser, function (req, res) {
		let question = req.body;
		let labels = question['labels'].match(/(\w+)/g);
		let i_id = req.user.institution
		question['labels'] = labels;
		question['institutionType'] = req.user.institutionType;
		question['institution'] = req.user.institution;

		async.waterfall([
			async.constant(question, i_id),
			addModelQuestion,
			addQuestionToInstitution
		], (err, q_id) => {
			if (err) {
				console.log(err);
				res.send("Something went wrong.");
			}
			console.log("New question added to db with id: " + q_id + " and associated with institution.");
			res.redirect("/institution/questions")
		})

	})
	app.post('/institution/questions', Middleware.isLoggedIn, urlencodedParser, function (req, res) {
		let question = req.body;
		let labels = question['labels'].match(/(\w+)/g);
		let i_id = req.user.institution
		question['labels'] = labels;
		question['institutionType'] = req.user.institutionType;
		question['institution'] = req.user.institution;

		async.waterfall([
			async.constant(question, i_id),
			addModelQuestion,
			addQuestionToInstitution
		], (err, q_id) => {
			if (err) {
				console.log(err);
				res.send("Something went wrong.");
			}
			console.log("New question added to db with id: " + q_id + " and associated with institution.");
			res.redirect("/institution/questions")
		})

	})

	app.get('/institution/questions/select/:id', Middleware.isLoggedIn, function (req, res) {
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
				action: "/institution/questions/select",
				categories: data.categories,
			});
		})
	})




	app.post('/institution/questions/select', Middleware.isLoggedIn, urlencodedParser, function (req, res) {
		let question = req.body;
		let labels = question['labels'].match(/(\w+)/g);
		let i_id = req.user.institution
		question['labels'] = labels;
		question['institutionType'] = req.user.institutionType;
		question['institution'] = req.user.institution;


		async.waterfall([
			async.constant(question, i_id),
			saveQuestion,
			addQuestionToInstitution
		], (err, q_id) => {
			if (err) {
				console.log(err);
				res.send("Something went wrong.");
			}
			console.log("New question added to db with id: " + q_id + " and associated with institution.");
			res.redirect("/institution/questions")
		})

	})

};

function saveKeywords(keywords, q_id, i_id) {

	options = { upsert: true, new: true, setDefaultsOnInsert: true };

	keywords.forEach(keyword => {
		keyword = keyword.toLowerCase();
		Keyword.updateOne(
			{ keyword: keyword, institution: i_id },
			{ $push: { questions: q_id } },
			options,
			function (err, result) {
				if (err) { console.log(err); }
				let k_id = result.id;
				addKeywordToInstitution(k_id, i_id)
			}
		)
	});
}

function addKeywordToInstitution(k_id, i_id) {
	options = { upsert: true, new: true, setDefaultsOnInsert: true };
	Institution.findByIdAndUpdate(
		i_id,
		{ $push: { keywords: k_id } },
		options,
		function (err, result) {
			if (err) { console.log(err); }
		}
	)
}

function addQuestionToInstitution(q_id, i_id, callback) {
	Institution.findByIdAndUpdate(
		i_id,
		{ $push: { questions: q_id } },
		function (err, result) {
			if (err) { return callback(err) }
			return callback(null, q_id);
		}
	)
}

function saveQuestion(question, i_id, callback) {
	newQuestion = new UserQuestion(question);
	newQuestion.save(function (err, result) {
		if (err) {
			return callback(err)
		}
		let q_id = result.id;
		saveKeywords(newQuestion.labels, q_id, i_id);
		return callback(null, q_id, i_id);
	})
}

function addModelQuestion(question, i_id, callback) {
	newQuestion = new Question(question);
	newQuestion.save(function (err, result) {
		if (err) {
			console.log("Error writing model question to db.")
			console.log(err);
		}
	})
	return saveQuestion(question, i_id, callback);
}


