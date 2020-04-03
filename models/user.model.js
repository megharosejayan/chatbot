var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    email: String,
    username: String,
    password: String,
    isAdmin: Boolean,
    institutionType: String,
    institution: { type: mongoose.Schema.Types.ObjectId, ref: "Institution" },
});

userSchema.plugin(passportLocalMongoose);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);