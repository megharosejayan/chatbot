const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT | 8000


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}));
app.use("/assets/css", express.static(__dirname + "/assets/css"));

app.get('/', function (req, res) {
	res.render('index')
})

app.get('/questions/add', function (req, res) {
	res.render('addQuestion')
})

app.post('/questions/add', function (req, res) {
	console.log(res.body);
	res.send(req.body);
})

app.listen(port, ()=> {console.log("Hey:as " + port)})
