const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const ejsLint = require('ejs-lint')
const questionController = require("./controllers/question.controller");

const app = express()
var chatcontroller=require('./controller/chatcontroller.js')
// var questioncontroller=require('./controller/questionscontroller.js')
const port = process.env.PORT | 8000
app.set('view engine', 'ejs')

chatcontroller(app);
// questioncontroller(app);

mongoose.connect("mongodb://localhost/chatbot");

app.set('view engine', 'ejs')
// app.use(bodyParser.urlencoded({extended: false}));
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/img", express.static(__dirname + "/assets/img"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));

app.get('/', function (req, res) {
	res.render('index')
})

app.post('/answer',urlencodedParser, questionController.getAnswer)

app.get('/questions', questionController.viewAll)

app.get('/questions/new', questionController.newQuestion)

app.get('/questions/:id/edit', questionController.editQuestion)

app.post('/questions/:id', questionController.updateQuestion)

app.post('/questions', questionController.saveQuestion)

app.post('/questions/add', function (req, res) {
	console.log(res.body);
	res.send(req.body);
})

app.listen(port, ()=> {console.log("Hey:as " + port)})
