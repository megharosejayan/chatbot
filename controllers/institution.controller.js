const Institution = require('../models/institution.model');
const User = require('../models/user.model');
const Middleware = require('../utils/middleware');
const data = require('../utils/categories');
const bodyParser = require('body-parser');
const async = require('async');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function (app) {


	app.get('/institutions', Middleware.hasAdminPrivelages, function (req, res) {

		let currType = req.query.institutionType;
		if (!data.institutionTypes.includes(currType))
			currType = false;
		let query = currType ? { institutionType: currType } : {};

		Institution.find(query, function (err, result) {
			if (err) {
				console.log("GET  /institutions");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/"); //TODO
			}
			res.render("viewInstitutions", { 'institutions': result, institutionTypes: data.institutionTypes, currType: currType });
		})
	})

	app.get('/institutions/new', Middleware.hasAdminPrivelages, function (req, res) {
		res.render('editInstitution', {
			title: 'Create a new Institution.',
			institution: false,
			institutionTypes: data.institutionTypes,
		});
	})

	app.get('/institutions/:id/users', Middleware.isLoggedIn, function (req, res) {
		let i_id = req.params.id;

		Institution.findById(i_id)
			.populate({
				path: 'users'
			})
			.exec((err, result) => {
				if (err) {
					console.log("GET  /institutions/:id/users");
					console.log(err);
					req.flash("error", "Something went wrong.");
					req.redirect("/institutions");
				}
				res.render("institution", { id: i_id, users: result.users });
			});

	})

	app.post('/institutions/:id/users', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
		let i_id = req.params.id;

		if (req.body.password !== req.body['c-password']) {
			console.log("Passwords didn't match");
			req.flash("error", "Passwords didn't match.");
			return res.redirect("/institutions/:id/users/new");
		}


		async.waterfall([
			function (callback) {
				Institution.findById(i_id, "institutionType", (err, res) => {
					if (err) {
						return callback(err)
					}
					return callback(null, res.institutionType);
				})
			},
			function (type, callback) {

				let newUser = new User({
					username: req.body.username,
					email: req.body.email,
					institution: i_id,
					isInstitutionAdmin: req.user.isAdmin,
					institutionType: type,
				});

				User.register(newUser, req.body.password, (err, user) => {
					if (err) {
						return callback(err)
					}
					return callback(null, user.id);
				});

			},
			function (id, callback) {
				Institution.findByIdAndUpdate(
					i_id,
					{ $push: { users: id } },
					function (err, result) {
						if (err) { return callback(err) }
						return callback(null, id);
					}
				)
			}
		], (err, id) => {
			if (err) {
				console.log("POST  /institutions/:id/users");
				console.log(err);
				req.flash("error", "Something went wrong.");
				res.redirect('/institutions/:id/users/new');
			}
			console.log('New User created: ' + id);
			req.flash("success", "New user created.");
			res.redirect("/institutions/" + i_id + "/users");
		});

	})

	app.get('/institutions/:id/users/new', Middleware.isLoggedIn, function (req, res) {
		let i_id = req.params.id;

		res.render('register')
	})

	app.get('/institutions/:id/edit', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Institution.findById(id, function (err, institution) {
			if (err) {
				console.log("GET  /institutions/:id/edit");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/institutions");
			}
			req.flash('success', 'Edit successfull')
			res.render('editInstitution', {
				title: 'Edit Institution',
				institution: institution,
				institutionTypes: data.institutionTypes,
			});
		})
	})

	app.post('/institutions/:id', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Institution.findByIdAndUpdate(id, req.body, { new: true }, function (err, institution) {
			if (err) {
				console.log("POST /institutions/:id");
				console.log(err);
				req.flash('error', "Something went wrong.");
				return res.redirect('/institutions');
			}
			console.log(institution.id + ' updated.');
			req.flash("success", "Update successfull.");
			return res.redirect('/institutions');
		});
	})


	app.get('/institutions/:id/delete', Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Institution.findByIdAndRemove(id, function (err, institution) {
			if (err) {
				console.log("GET  /institutions/:id/delete");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/institutions");
			}
			console.log(institution.id + ' deleted.');
			req.flash("success", "Institution deleted.");
			return res.redirect('/institutions');
		});
	})

	app.post('/institutions', Middleware.isLoggedIn, urlencodedParser, function (req, res) {
		let institution = req.body;

		newInstitution = new Institution(institution);
		newInstitution.save(function (err, result) {
			if (err) {
				console.log("POST  /institutions");
				console.log(err);
				req.flash("error", "Something went wrong.");
				req.redirect("/institutions");
			}
			req.flash("success", "Institution added.");
			return res.redirect('/institutions');
		});
	})

};
