const Institution = require('../models/institution.model');
const Middleware = require('../utils/middleware');
const data = require('../utils/categories');
const bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function (app) {


	app.get('/institutions', Middleware.isLoggedIn, function (req, res) {
		let currType = req.query.institutionType;
		if (!data.institutionTypes.includes(currType))
			currType = false;
		console.log(currType);

		let query = {};

		if (currType)
			query = { institutionType: currType };

		Institution.find(query, function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			res.render("viewInstitutions", { 'institutions': result, institutionTypes: data.institutionTypes, currType: currType });
		})
	})

	app.get('/institutions/new', Middleware.isLoggedIn, function (req, res) {
		res.render('editInstitution', {
			title: 'Create a new Institution.',
			institution: false,
			institutionTypes: data.institutionTypes,
		});
	})

	app.get('/institutions/:id/edit', urlencodedParser, Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		console.log(id);

		Institution.findById(id, function (err, institution) {
			if (err) {
				console.log(err);
				res.send(err);
			}
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
				console.log(err);
				res.send(err);
			}
			console.log(institution.id + ' updated.');
			return res.redirect('/institutions');
		});
	})


	app.get('/institutions/:id/delete', Middleware.isLoggedIn, function (req, res) {
		let id = req.params.id;
		Institution.findByIdAndRemove(id, function (err, institution) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			console.log(institution.id + ' deleted.');
			return res.redirect('/institutions');
		});
	})

	app.post('/institutions', Middleware.isLoggedIn, urlencodedParser, function (req, res) {
		let institution = req.body;

		newInstitution = new Institution(institution);
		newInstitution.save(function (err, result) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			return res.redirect('/institutions');
		});
	})

};
