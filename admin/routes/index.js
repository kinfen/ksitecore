/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require("../").getAdminClass(),
	importRoutes = keystone.importer(__dirname);

var routes = {
	views: importRoutes('./views')
};
// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	// Cache compiled view templates if we are in Production mode
	// Views
	console.log("here");
	app.get('/sigina', routes.views.index);

};
