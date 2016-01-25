/**
 * Created by kinfen on 16/1/19.
 */

var ksiteadm = require('../'),
	express = require('express');

//var dest = {
//	views: importRoutes('../routes/')
//};
// Setup Route Bindings
exports = module.exports = function(req, res) {

	// Views
	// Cache compiled view templates if we are in Production mode
	// Views
	var keystone = this.getAdminClass();
	var app = keystone.app;
	var routes = express.Router();
	routes.all('/signin', require('../routes/views/signin'));
	app.use('/' + this.get("siteAdmPath"), routes);
	console.log(app.path());

};
