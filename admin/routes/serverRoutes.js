/**
 * Created by kinfen on 16/1/19.
 * 处理所有后台路由
 */
var	express = require('express');
var kadm = require('../index');
var keystone = kadm.getAdminPlus();
var initList = require("./middleWare/initList")(keystone);
var path = require('path');
exports = module.exports = function() {
	var router = express.Router();
	if (!keystone.nativeApp || !keystone.get('session')) {
		router.all('*', keystone.session.persist);
	}


	//auth
	if (keystone.get('auth') === true) {
		// TODO: poor separation of concerns; settings should be defaulted elsewhere
		console.log(kadm.get('signout url'));
		if (!kadm.get('signout url')) {
			kadm.set('signout url', '/' + kadm.get('kadmPath') + '/signout');
		}
		if (!kadm.get('signin url')) {
			kadm.set('signin url', '/' + kadm.get('kadmPath') + '/signin');
		}
		if (!keystone.nativeApp || !keystone.get('session')) {
			router.all('*', keystone.session.persist);
		}
	} else if ('function' === typeof keystone.get('auth')) {
		router.use(keystone.get('auth'));
	}

	var kadmAuth = function(req, res, next) {
		if (!req.user || !req.user.canAccessKeystone) {
			var regex = new RegExp('^\/' + kadm.get('kadmPath') + '\/?$', 'i');
			var from = '';// regex.test(req.url) ? '' : '?from=' + req.url;
			return res.redirect(kadm.get('signin url') + from);
		}
		next();
	};
	router.all('/signin', require('./views/signin'));
	router.all('/signout', require('./views/signout'));
	router.use(kadmAuth);
	router.all('/', require('./views/main'));
	router.all('/category/:model', initList(), require('./views/listWithCa'));
	router.all('/item/:model/:id', initList(), require('./views/item'));
	router.all('/api2/:model/tree', initList(), require('../api/tree'));
	router.all('/api2/:model/list', initList(), require('../api/list'));
	router.all('/api2/:model/:id?', initList(), require('../api/item'));

	// lists
	//router.all('/api/counts', require('../api/counts'));
	var keystonePath = kadm.getKeystoneRelativePath(__dirname);
	router.get('/api/:model', initList(), require(path.join(keystonePath, 'keystone/admin/server/api/list/get')));
	//router.get('/api/:list/:format(export.csv|export.json)', initList(), require('../api/list/download'));
	//router.post('/api/:list/create', initList(), require('../api/list/create'));
	//router.post('/api/:list/delete', initList(), require('../api/list/delete'));
	// items
	router.get('/api/:model/:id', initList(), require(path.join(keystonePath, 'keystone/admin/server/api/item/get')));
	//router.post('/api/:list/:id', initList(), require('../api/item/update'));
	//router.post('/api/:list/:id/delete', initList(), require('../api/list/delete'));
	//router.post('/api/:list/:id/sortOrder/:sortOrder/:newOrder', initList(), require('../api/item/sortOrder'));
	// #6: List Routes
	//router.all('/:list/:page([0-9]{1,5})?', initList(true), require('../routes/list'));
	//router.all('/:list/:item', initList(true), require('../routes/item'));


	
	
	
	
	router.all('/test', function(req, res, next){
		console.log("test");
		next();
	});
	return router;
};
