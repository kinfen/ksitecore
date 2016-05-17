/**
 * Created by kinfen on 16/1/31.
 */

var kadm = require('../../index');

module.exports = function(req, res) {
	
	var navs = req.method == "POST" ? req.body.navs : req.query.navs;
	var cat = req.method == "POST" ? req.body.cat : req.query.cat;
	var page = req.query.p;
	var pageSize = req.query.pageSize;
	kadm.render(req, res, 'views/ajaxView/listWithCa', {
		submitted: req.body,
		navs:navs,
		category:cat,
		page:{
			page:page,
			pageSize:pageSize
		}
		from: req.query.from,
		logo: null
	});
};
