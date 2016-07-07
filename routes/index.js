/**
 * Created by kinfen on 16/5/22.
 */
var	express = require('express');
var kadm = require('../admin');
//console.log(ksiteadm);
//var dest = {
//	views: importRoutes('../routes/')
//};
// Setup Route Bindings
exports = module.exports = function() {

	var router = express.Router();
	var staticRoutes = require("./staticRoutes")();
	var serverRoutes = require("./serverRoutes")();
	router.use ("/", staticRoutes);
	router.use ("/", serverRoutes);
	return router;


}
