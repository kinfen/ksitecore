/**
 * Created by kinfen on 16/1/26.
 */
var	express = require('express');
var ksiteadm = require('../index');
//console.log(ksiteadm);
//var dest = {
//	views: importRoutes('../routes/')
//};
// Setup Route Bindings
exports = module.exports = function(app) {
	var serverRoutes = require("./serverRoutes")();
	var jsRoutes = require("../prebuild/buildClientJs")();
	var staticRoutes = require("./staticRoutes")();
	if (ksiteadm.get("routes"))
	{
		ksiteadm.get("routes")(app);
	}

	var lessOptions = {
		render: {
			modifyVars: {
				elementalPath: 1
			}
		},
		debug:true
	};
	
	app.use ("/" + ksiteadm.get("kadmPath"), serverRoutes);
	app.use ("/" + ksiteadm.get("kadmPath"), jsRoutes);
	var str = ksiteadm.getAdminPlus().expandPath('public');
	var obj = require('less-middleware')(str, lessOptions)
	console.log('oh');
	console.log(obj);
	app.use(obj);
	app.use ("/" + ksiteadm.get("kadmPath"), staticRoutes);
}
