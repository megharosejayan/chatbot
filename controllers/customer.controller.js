const Question = require('../models/question.model');
const UserQuestion = require('../models/userQuestion.model');
const Keyword = require('../models/keyword.model');
const Middleware = require('../utils/middleware');
const data = require('../utils/categories');
const bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function (app) {

	
	app.get('/institution/questions', Middleware.isLoggedIn, function (req, res) {
		let instId = req.params.id;
		let currCategory = req.query.category;
		if(!data.categories.includes(currCategory)) 
			currCategory = false;
		console.log(currCategory);

		let query = {};
		
		if(currCategory) 
			query = {category: currCategory};
		UserQuestion.find(query, function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			res.render("viewUserQuestions", { 'questions': result , categories: data.categories, currCategory: currCategory});
		})
	})

	
	app.get('/institution/questions/select/', Middleware.isLoggedIn, function (req, res) {
		let institutionType = req.user.institutionType;
		
		if(!institutionType){
			return res.send("Error. User does not have associated Institution Type.")
		}

		let currCategory = req.query.category;
		if(!data.categories.includes(currCategory)) 
			currCategory = false;
		console.log(currCategory);

		let query = {institutionType: institutionType};
		
		if(currCategory) 
			query = {category: currCategory};
		Question.find(query, function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			res.render("selectQuestions", { 'questions': result , categories: data.categories, currCategory: currCategory});
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
				action: "/institution/questions/select/",
				categories: data.categories,
			});
		})
	})

	
	app.post('/institution/questions/select', Middleware.isLoggedIn, urlencodedParser, function (req, res) {
		let question = req.body;
		let labels = question['labels'].match(/(\w+)/g);
		question['labelString'] = labels;
		question['institutionType'] = req.user.institutionType;
		question['institution'] = req.user.institution;

		newQuestion = new UserQuestion(question);
		newQuestion.save(function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			let q_id = result.id;
			saveKeywords(labels, q_id, req.user.institution);
			res.redirect('/institution/questions');

		});
	})

	// app.get('/questions/new', Middleware.isLoggedIn, function (req, res) {
	// 	res.render('editQuestion', {
	// 		title: 'Create a new Question.,',
	// 		question: false,
	// 	});
	// })


	// app.post('/questions/:id', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
	// 	let id = req.params.id;
	// 	Question.findByIdAndUpdate(id, req.body, function (err, question) {
	// 		if (err) {
	// 			console.log(err);
	// 			res.send(err);
	// 		}
	// 		console.log(question.id + ' updated.');
	// 		res.redirect('/questions');
	// 	});
	// })

	// app.post('/questions', Middleware.isLoggedIn, urlencodedParser, function (req, res) {
	// 	let question = req.body;

	// 	let labels = question['labels'].match(/(\w+)/g);
	// 	question['labelString'] = labels;

	// 	newQuestion = new Question(question);
	// 	newQuestion.save(function (err, result) {
	// 		if (err) {
	// 			console.log(err);
	// 			res.send(err);
	// 		}
	// 		let q_id = result.id;
	// 		saveKeywords(labels, q_id);
	// 		res.redirect('/questions');

	// 	});
	// })

	
	// app.get('/questions/:id/delete', Middleware.isLoggedIn, function (req, res) {
	// 	let id = req.params.id;
	// 	Question.findByIdAndRemove(id, function (err, question) {
	// 		if (err) {
	// 			console.log(err);
	// 			res.send(err);
	// 		}
	// 		console.log(question.id + ' deleted.');
	// 		return res.redirect('/questions');
	// 	});
	// })
};

function saveKeywords(keywords, q_id, i_id) {

	options = { upsert: true, new: true, setDefaultsOnInsert: true };

	keywords.forEach(keyword => {
		keyword = keyword.toLowerCase();
		Keyword.updateOne(
			{ keyword: keyword , institution: i_id},
			{ $push: { questions: q_id } },
			options,
			function (err, result) {
				if (err) { console.log(err); }
				console.log(result);
			}
		)
	});


}