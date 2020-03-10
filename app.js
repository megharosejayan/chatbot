const express = require('express')
const bodyParser = require('body-parser')
var data =[{item:'hi'}];

const app = express()
const port = process.env.PORT | 8000


app.set('view engine', 'ejs')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use("/assets/css", express.static(__dirname + "/assets/css"));

app.get('/', function (req, res) {
	res.render('index',{todos:data});

})

app.get('/questions', function (req, res) {
	res.render('addQuestion')
})

app.post('/questions/add', function (req, res) {
	console.log(req.body);
	var body =req.body;
	 res.send(req.body);
})

app.post('/e',urlencodedParser, function (req, res) {
	
	data.push(req.body);
	
	res.json(data);
});
app.post('/',urlencodedParser,function(req,res){
	console.log("test");

	   
});

app.listen(port, ()=> {console.log("Hey:as " + port)})
