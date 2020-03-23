const bodyParser = require('body-parser')
const Question = require('../models/question.model');
const Details = require('../models/details.model')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

data = [{ item: 'hey' }];

var bot = [{ answer: 'Hi, welcome to SimpleChat! Go ahead and send me a message. 😄' }];


module.exports = function (app) {
	app.get('/', function (req, res) {
		res.render('index', { me: data, b: bot });

	});
	// answer route begins
	app.post('/answer', urlencodedParser, function (req, res) {
		let question = req.body;
		var quest = question.item.split(" ");        //created an array to store each word of the question

		saveChatHistory(req.ip, question);

		//  mongo db query function begins
		Question.find({}, function (err, questions) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			console.log("status 200");
			let index = Math.floor(Math.random() * questions.length);

			var Data = { answer: questions[index]['answer'] };       //the queried answer should be stored in Data
			console.log(Data.answer)


			data.push(question);                         //no changes needed
			if (question.item == 'hi') {  // var p={item:"hey how can i help you"}
				bot.push(Data);
			}                                                   //the other temporary data can be removed at last
			else {
				var p = { answer: "sorry i did not get you" }
				bot.push(p);

			}


		})
		//  mongo db query function ends
		// sending ip and date

		res.json(data);


	})
	// answer route ends here

	function saveChatHistory(ip, question) {
		var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime = date+' '+time;
		console.log(dateTime)
		const details = new Details({
			question: question,
			ip: ip,
			date: dateTime
		});

		details.save(function (err) {
			if (err) return handleError(err);
		})
	}


};