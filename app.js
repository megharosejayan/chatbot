const flash = require("connect-flash");
const express = require('express');
const session = require("express-session");
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require("./models/user.model")
const chatController = require("./controllers/chat.controller");
const userController = require("./controllers/user.controller");
const questionController = require("./controllers/question.controller");

const app = express();
const port = process.env.PORT | 8000;

mongoose.connect("mongodb://localhost/chatbot")
	.then(() => console.log("Connected to MongoDB."))
	.catch(err => console.error("Could not connect to MongoDB."));

app.set('view engine', 'ejs');
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/img", express.static(__dirname + "/assets/img"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));

//passport configuration
app.use(session({
	secret: process.env.SESSIONSECRET || "node_app_chatbot_secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass currentUser to all routes
app.use((req, res, next) => {
	res.locals.currentUser = req.user; // req.user is an authenticated user
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

userController(app);
chatController(app);
questionController(app);

app.get('/test', function(req, res) {
	res.render('testFrame');
})

app.listen(port, () => { console.log("Server started on port: " + port) });
