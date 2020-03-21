const express = require('express')
const mongoose = require('mongoose')
const questionController = require("./controllers/question.controller");
const chatController = require("./controllers/chat.controller");

const app = express();
const port = process.env.PORT | 8000;
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost/chatbot");

app.set('view engine', 'ejs');
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/img", express.static(__dirname + "/assets/img"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));

chatController(app);
questionController(app);

app.listen(port, ()=> {console.log("Server started on port: " + port)});
