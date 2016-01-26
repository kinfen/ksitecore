/**
 * Created by kinfen on 16/1/19.
 */
var	express = require('express');

exports = module.exports = function() {
	
	var routes = express.Router();
	routes.all('/signin', require('./views/signin'));
	routes.all('/test', function(req, res, next){
		console.log("test");
		next();
	})
	return routes;
};
