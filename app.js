const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT | 8000


app.set('view engine', 'ejs')
app.use("/assets/css", express.static(__dirname + "/assets/css"));

app.get('/', function (req, res) {
	res.render('index')
})

app.get('/questions/add', function (req, res) {
	res.render('addQuestion')
})

app.listen(port, ()=> {console.log("Hey: " + port)})
