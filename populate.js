const mongoose = require('mongoose')
const Question = require('./models/question.model');

mongoose.connect("mongodb://localhost/chatbot");

let questions = [{
	query: "What common ports should every competent IT worker know?",
	answer: `USB. You see the naming scheme of usb’s suck, so go google them because they seriously have a crappy naming system.
Ethernet. Wired internet.
USB a,b,c.
USB mini.
Micro usb.
HDMI (a,b,c,d,e).
Kensington Security Slot (not a port but still usefull for computers running security cams, etc).`,
	labels: ['USB', 'ports', 'computers'],
	dateCreated: Date.now()
},
{
	query: "How was your experience while working in Bangalore in an IT company?",
	answer: `For some it is Silicon valley of India, and for some it is Las Vegas of India

For me its been 2.5 years i have been in Bangalore, working for TCS.

While answering this question I will try to cover the maximum spectrum possible.

Learning Opportunity:

Companies here work on leading technologies with reputed clients. You can always expect to land a challenging assignment that will enhance your learning curve. Also, you will always be updated on leading and upcoming technology boom beforehand.`,
	labels: ['Banglore', 'life', 'work'],
	dateCreated: Date.now()
},
{
	query: "What do IT professionals do after retirement?",
	answer: `I was asked to resign under two conditions —
Continue with same salary for one year.
Or resign immediately from company and we will give you experience letter but in this case you don't need to give`,
	labels: ['IT', 'life', 'retirement'],
	dateCreated: Date.now()
},
{
	query: "What are the advantages of using a database over a file system?",
	answer: `A database usually contains considerably more relational and metadata on its content.A database generally subscribes to common data types such as integers, strings etc. A database engine is able `,
	labels: ['database', 'files', 'advantages'],
	dateCreated: Date.now()
},
]

console.log(questions);


Question.insertMany(questions, function (err, question) {
	if (err) {
		console.log(err);
	}
	console.log(question);
})

console.log('Hey')