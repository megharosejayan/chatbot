const User = require("../models/user.model");
      // School    = require("../models/school.model");

// all middleware goes here
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.redirectTo = req.headers.referer || req.originalUrl || req.url
  req.flash("error", "You need to be logged in first"); // add a one-time message before redirect
  res.redirect("/login");
};



middlewareObj.hasAdminPrivelages = function (req, res, next) {
  if (req.isAuthenticated()) {    
    if (req.user.isAdmin){
      return next()
    }
  }
  req.session.redirectTo = req.headers.referer || req.originalUrl || req.url
  req.flash("error", "You need admin privelages."); // add a one-time message before redirect
  res.redirect("/login");
};



middlewareObj.hasInstituteAdminPrivelages = function (req, res, next) {
  if (req.isAuthenticated()) {    
    if (req.user.isAdmin || req.user.isInstitutionAdmin){
      return next()
    }
  }
  req.session.redirectTo = req.headers.referer || req.originalUrl || req.url
  req.flash("error", "You need institute admin privelages."); // add a one-time message before redirect
  res.redirect("/login");
};


  
module.exports = middlewareObj;