/**
 * Created by kinfen on 16/1/19.
 * 处理所有后台路由
 */
var	express = require('express');
var ksiteadm = require('../');
var keystone = ksiteadm.getAdminClass();
var initList = require("./middleWare/initList")(keystone);
exports = module.exports = function() {
	
	var routes = express.Router();
	routes.all('/', require('./views/main'));
	routes.all('/signin', require('./views/signin'));
	routes.all('/signout', require('./views/signout'));
	routes.get('/api/:model/tree', initList(), require('../api/tree'));
	routes.all('/test', function(req, res, next){
		console.log("test");
		next();
	})
	return routes;
};
