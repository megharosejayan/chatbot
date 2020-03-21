const bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
data =[{item:'hey'}];

var bot=[{item:'Hi, welcome to SimpleChat! Go ahead and send me a message. 😄'}];


module.exports= function(app){

app.get('/', function (req, res) {
	res.render('index',{me:data,b:bot});

});

app.post('/e',urlencodedParser, function (req, res) {

	data.push(req.body);
	
	res.json(data);
});

app.post('/',urlencodedParser,function(req,res){
	var body=req.body;
	
	if(body.item=='hi')
	{   var p={item:"hey how can i help you"}
		bot.push(p);
	}
	else
	{
		var p={item:"sorry i did not get you"}
		bot.push(p);

	}
    res.json(bot);
	   
});
};