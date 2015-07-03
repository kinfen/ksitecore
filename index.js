
// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

var KSiteCore = function()
{

}

KSiteCore.prototype.render = require('./lib/core/render');
KSiteCore.prototype.init = function()
{
	keystone.init({

		'name': 'KeystoneJS',
		'brand': 'KeystoneJS',

		'less': 'public',
		'env' : "development",
		'static': 'public',
		'favicon': 'favicon.ico',
		'views': '/templates/views',
		'view engine': 'jade',
		'emails': 'templates/emails',
		
		'auto update': true,
		'session': true,
		'session store': 'mongo',
		'auth': true,
		'user model': 'User',
		'signin logo': '/images/logo.png'
		
	});

	keystone.set('locals', {
		_: require('underscore'),
		env: keystone.get('env'),
		utils: keystone.utils,
		editable: keystone.content.editable
	});
	keystone.set('signout url', '/ksitecore/signout');
	keystone.set('signin url', '/ksitecore/signin');
		
	// Load your project's Models

	keystone.import('models');

	// Your cookie secret is used to secure session cookies. This environment
	// variable was added to your Heroku config for you if you used the "Deploy to
	// Heroku" button. The secret below will be used for development.
	// You may want to set it to something private and secure.

	if (!keystone.get('cookie secret')) {
		keystone.set('cookie secret', '----change-me-to-something-secret----');
	}

	// Setup common locals for your templates. The following are required for the
	// bundled templates and layouts. Any runtime locals (that should be set uniquely
	// for each request) should be added to ./routes/middleware.js

	keystone.set('locals', {
		_: require('underscore'),
		env: keystone.get('env'),
		utils: keystone.utils,
		editable: keystone.content.editable
	});
	// Load your project's Routes
	keystone.set('routes', require('./routes'));


	var email_hostname = process.env.EMAIL_HOSTNAME || 'localhost:3000';


	// Load your project's email test routes

	// Configure the navigation bar in Keystone's Admin UI

	keystone.set('nav', {
		'posts': ['posts', 'post-categories'],
		'galleries': 'galleries',
		'enquiries': 'enquiries',
		'users': 'users'
		// 'categorys': 'categorys'
	});
}
KSiteCore.prototype.start = function()
{
	keystone.start();
}
var ksitecore = new KSiteCore();
module.exports = exports = ksitecore;
ksitecore.init();
KSiteCore.prototype.templateList = require('./lib/core/templatelist');
ksitecore.start();

