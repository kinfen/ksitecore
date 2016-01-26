/**
 * Created by kinfen on 16/1/26.
 */
var	express = require('express');
var ksiteadm = require('../index');
//var dest = {
//	views: importRoutes('../routes/')
//};
// Setup Route Bindings
exports = module.exports = function(app) {
	var serverRoutes = require("./serverRoutes")();
	var staticRoutes = require("../prebuild/buildClientJs")();
	if (ksiteadm.get("routes"))
	{
		ksiteadm.get("routes")(app);
	}
	app.use ("/" + ksiteadm.get("siteAdmPath"), serverRoutes);
	app.use ("/" + ksiteadm.get("siteAdmPath"), staticRoutes);
}
