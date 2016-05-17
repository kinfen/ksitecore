/**
 * Created by kinfen on 16/1/31.
 */

var ksiteadm = require('../../');

module.exports = function(req, res) {
	
	var itemId = req.params.id;
	var backUrl = req.query.backUrl || req.body.backUrl;
	ksiteadm.render(req, res, 'views/ajaxView/item', {
		itemId:itemId,
		list:req.list,
		backUrl:backUrl || ""
	});
};
