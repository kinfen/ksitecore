/**
 * Created by kinfen on 16/1/31.
 */

var ksiteadm = require('../../');

module.exports = function(req, res) {
	ksiteadm.render(req, res, 'views/ajaxView/listWithCa', {
		submitted: req.body,
		from: req.query.from,
		logo: null
	});
};
