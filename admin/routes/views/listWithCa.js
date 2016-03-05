/**
 * Created by kinfen on 16/1/31.
 */

var ksiteadm = require('../../');

module.exports = function(req, res) {
	
	var navs = req.method == "POST" ? req.body.navs : req.query.navs;
	console.log(navs);
	ksiteadm.render(req, res, 'views/ajaxView/listWithCa', {
		submitted: req.body,
		navs:navs,
		from: req.query.from,
		logo: null
	});
};
