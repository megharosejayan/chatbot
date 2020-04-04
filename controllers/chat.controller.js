const bodyParser = require('body-parser')
const Institution = require('../models/institution.model');
const Keyword = require('../models/keyword.model');
const Details = require('../models/details.model')
var urlencodedParser = bodyParser.urlencoded({ extended: false })




module.exports = function (app) {
	app.get('/chat', function (req, res) {
		var bot = 'Hi there, welcome to the Chatbot, how can I help you today';
		res.render('index', { welcome: bot });

	});


	app.get('/test', function (req, res) {
		Institution.find({}, 'id name', function (err, institutions) {
			res.render('testFrame', {institutions: institutions});
		})
	})


	app.get('/chat/:id', function (req, res) {
		let i_id = req.params.id;
		Institution.findById(i_id, (err, institution) => {
			if (err) {
				console.log('Error with institution chatbot.');
				console.log(err);
				return res.redirect('/chat');
			}
			var bot = 'Hi there, ask me anything about ' + institution.name;
			return res.render('index', { welcome: bot });
		})
	});

	// answer route begins
	app.post('/answer', urlencodedParser, function (req, res) {
		let question = req.body.query;
		var words = question.match(/(\w+)/g);       //created an array to store each word of the question
		let query = [];
		words.forEach(word => {
			query.push({ keyword: word.toLowerCase() })
		});

		saveChatHistory(req.ip, question);

		let results = {};

		Keyword.find({ $or: query })
			.where('institution').equals(req.body.institution)
			.populate('questions')
			.exec(function (err, keywords) {
				if (err) {
					console.log(err);
					res.send(err);
				}
				keywords.forEach(keyword => {
					keyword.questions.forEach(q => {
						if ((q.id + "") in results) {
							results[q.id].count++;
						} else {
							var x = {
								query: q.query,
								answer: q.answer,
								count: 1
							};
							results[q.id] = x;
						}
					});
				});
				var sortedQuestionsArray = sortByKey(getArrayFrom(results), 'count');
				res.json(sortedQuestionsArray);
			});
	});
	// answer route ends here


};


function sortByKey(array, key) {
	return array.sort(function (a, b) {
		var x = a[key]; var y = b[key];
		return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	});
}


function getArrayFrom(obj) {

	var result = [];

	Object.keys(obj).forEach(key => {
		result.push(obj[key]);
	});

	return result;
}

function saveChatHistory(ip, question) {
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date + ' ' + time;
	console.log(dateTime)
	const details = new Details({
		question: question,
		ip: ip,
		date: dateTime
	});
	details.save(function (err) {
		if (err) return console.log(err);
	})
}
