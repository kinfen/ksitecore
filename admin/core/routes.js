/**
 * Created by kinfen on 16/1/19.
 */

var ksiteadm = require('../'),
	keystone = ksiteadm.getAdminClass(),
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
	routes.all('/' + ksiteadm.adminPath + '/signin', require('../routes/views/signin'));
	app.use('/', routes);

};
