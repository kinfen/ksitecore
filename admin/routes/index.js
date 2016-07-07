/**
 * Created by kinfen on 16/1/26.
 */
var	express = require('express');
var kadm = require('../index');
//console.log(ksiteadm);
//var dest = {
//	views: importRoutes('../routes/')
//};
// Setup Route Bindings
exports = module.exports = function(app) {
	var serverRoutes = require("./serverRoutes")();
	var jsRoutes = require("../prebuild/buildClientJs")();
	var staticRoutes = require("./staticRoutes")();
	if (kadm.get("routes"))
	{
		kadm.get("routes")(app);
	}
	app.use ("/" + kadm.get("kadmPath"), jsRoutes);
	app.use ("/" + kadm.get("kadmPath"), staticRoutes);
	app.use ("/" + kadm.get("kadmPath"), serverRoutes);
	app.use('/', require('../../routes')());
	
}
