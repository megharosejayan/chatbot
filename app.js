const express = require('express')
const app = express()
var chatcontroller=require('./controller/chatcontroller.js')
var questioncontroller=require('./controller/questionscontroller.js')
const port = process.env.PORT | 8000
app.set('view engine', 'ejs')

app.use("/assets/css", express.static(__dirname + "/assets/css"));
chatcontroller(app);
questioncontroller(app);
app.listen(port, ()=> {console.log("Hey:as " + port)})
