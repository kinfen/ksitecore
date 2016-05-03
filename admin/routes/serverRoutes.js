/**
 * Created by kinfen on 16/1/19.
 * 处理所有后台路由
 */
var	express = require('express');
var kadm = require('../');
var keystone = kadm.getAdminPlus();
var initList = require("./middleWare/initList")(keystone);
exports = module.exports = function() {
	var router = express.Router();
	if (!keystone.nativeApp || !keystone.get('session')) {
		router.all('*', keystone.session.persist);
	}
	router.all('/', require('./views/main'));
	router.all('/signin', require('./views/signin'));
	router.all('/signout', require('./views/signout'));
	router.all('/category/:model', require('./views/listWithCa'));
	router.all('/item/:model/:id', initList(), require('./views/item'));
	router.all('/api/:model/tree', initList(), require('../api/tree'));
	router.all('/api/:model/list', initList(), require('../api/list'));
	router.all('/api/:model/:id', initList(), require('../api/item'));

	// lists
	//router.all('/api/counts', require('../api/counts'));
	router.get('/api/:list', initList(), require('../keystone/admin/server/api/list/get'));
	//router.get('/api/:list/:format(export.csv|export.json)', initList(), require('../api/list/download'));
	//router.post('/api/:list/create', initList(), require('../api/list/create'));
	//router.post('/api/:list/delete', initList(), require('../api/list/delete'));
	// items
	//router.get('/api/:list/:id', initList(), require('../api/item/get'));
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
