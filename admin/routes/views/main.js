/**
 * Created by kinfen on 16/1/28.
 */
var ksiteadm = require('../../');

module.exports = function(req, res) {
	ksiteadm.render(req, res, 'views/main', {
		submitted: req.body,
		from: req.query.from,
		logo: null
	});
};
