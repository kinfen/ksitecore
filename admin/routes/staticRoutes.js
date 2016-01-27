/**
 * Created by kinfen on 16/1/27.
 * 处理所有静态路由
 */

var	express = require('express');
var path = require('path');

exports = module.exports = function() {
	var routes = express.Router();
	routes.use(express.static(path.resolve(__dirname, "../public")));
	return routes;
};
