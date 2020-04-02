const User = require('./models/user.model');
const passport = require("passport");
const Roles = require("./utils/roles");

const username = "admin";
const password = "genericPassword"

let newUser = new User({
    username: username,
    email: "admin@chatbot.in",
    role: Roles.Admin,
    institutionType: "School",
    institution: "5e85973bc057493af83f5209"
});

console.log("Creating user");
console.log(newUser);



User.register(newUser, password, (err, user) => {
    console.log(info)
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
