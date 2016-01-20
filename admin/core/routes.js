/**
 * Created by kinfen on 16/1/19.
 */


var keystone = require('../').getAdminClass(),
	importRoutes = keystone.importer(__dirname),
	express = require('express');

var dest = {
	views: importRoutes('../routes/')
};
// Setup Route Bindings
exports = module.exports = function(req, res) {

	// Views
	// Cache compiled view templates if we are in Production mode
	// Views
	var app = keystone.app;
	var routes = express.Router();
	routes.all('/signin', require('../routes/views/signin'));
	console.log('abc');
	app.use('/', routes);

};
