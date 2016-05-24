/**
 * Created by kinfen on 16/1/19.
 * 处理所有后台路由
 */
var	express = require('express');

exports = module.exports = function() {
	var router = express.Router();
	router.all('/test', function(req, res, next){
		console.log("test");
		next();
	});
	return router;
};
