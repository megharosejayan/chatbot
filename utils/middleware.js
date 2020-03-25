const User = require("../models/user.model");
      // School    = require("../models/school.model");

// all middleware goes here
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.redirectTo = req.originalUrl;
  req.flash("error", "You need to be logged in first"); // add a one-time message before redirect
  res.redirect("/login");
};

// middlewareObj.checkUserFromSchool = function(req, res, next) {
//   if (req.isAuthenticated()) {
//       User.findById(req.user._id, function(err, foundUser){
//         if (err || !foundUser) {
//           req.flash("error", "User not found");
//           res.redirect("back");
//         } else {
//           // does the user belong to the School
//           if (foundUser.sid.equals(req.params.id) || req.user.isAdmin) { next(); }
//           else {
//             req.flash("error", "You don't have permission to do that");
//             res.redirect("back");
//           }
//         }
//       })
//     School.findById(req.params.id, (err, foundSchool) => {
//       if (err || !foundSchool) {
//         req.flash("error", "School not found");
//         res.redirect("back");
//       } else {
//         // does the user own the School
//         if (foundSchool.author.id.equals(req.user._id) || req.user.isAdmin) { next(); }
//         else {
//           req.flash("error", "You don't have permission to do that");
//           res.redirect("back");
//         }
//       }
//     });
//   }
//   else {
//     req.flash("error", "You need to be logged in to do that");
//     res.redirect("/login");
//   }
// };
  
module.exports = middlewareObj;