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

var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

var initList = function(protect) {
		return function(req, res, next) {
			req.list = keystone.list(req.params.list);
			if (!req.list || (protect && req.list.get('hidden'))) {
				req.flash('error', 'List ' + req.params.list + ' could not be found.');
				return res.redirect('/ksitecore');
			}
			req.page = req.query.page ? req.query.page : 1;
			req.pageSize = req.query.perPage ? req.query.perPage : 10;
			next();
		};
	};

var setAuth = function (app)
{
	keystone.set('view cache', keystone.get('env') === 'production');
	
	if (keystone.get('auth') === true) {
		
		if (!keystone.get('signout url')) {
			keystone.set('signout url', '/ksitecore/signout');
		}
		if (!keystone.get('signin url')) {
			keystone.set('signin url', '/ksitecore/signin');
		}
		
		if (!keystone.nativeApp || !keystone.get('session')) {
			app.all('/keystone*', keystone.session.persist);
		}
		
		app.all('/ksitecore/signin', require('../routes/views/signin'));
		app.all('/ksitecore/signout', require('../routes/views/signout'));
		app.all('/ksitecore*', keystone.session.keystoneAuth);
		
	} else if ('function' === typeof keystone.get('auth')) {
		app.all('/ksitecore*', keystone.get('auth'));
	}
}

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	// Cache compiled view templates if we are in Production mode
	
	setAuth(app);

	app.get('/ksitecore', routes.views.contentManager);
	app.all('/ksitecore/templates', routes.views.templates);
	app.get('/ksitecore/err', routes.views.err);
	app.get('/ksitecore/welcome', routes.views.welcome);
	app.all('/ksitecore/:list/list', initList(true), routes.views.list);
	app.all('/ksitecore/:list/list/:id', initList(true), routes.views.list);
	app.all('/ksitecore/:list/item/:id', initList(true), routes.views.item);

};
