const User = require('./models/user.model');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const username = "admin";
const password = "genericPassword";


mongoose.connect("mongodb://localhost/chatbot")
    .then(() => console.log("Connected to MongoDB."))
    .catch(err => console.error("Could not connect to MongoDB."));

passport.initialize();
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let newUser = new User({
    username: username,
    email: "admin@chatbot.in",
    isAdmin: true,
});

console.log("Creating user");
console.log(newUser);



User.register(newUser, password, (err, user) => {
    console.log(user)
    if (err) {
        console.log(err)
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate email
            console.log("error: That email has already been registered.");
            return;
        }
        // Some other error
        console.log("error", "Something went wrong...");
        return;
    }
    console.log("New user created: " + username);
    console.log("Password: " + password);
});
