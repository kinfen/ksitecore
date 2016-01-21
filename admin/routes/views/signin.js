var ksitecore = require('../../');

module.exports = function(req, res) {
	ksitecore.render(req, res, 'views/signin', {
		submitted: req.body,
		from: req.query.from,
		logo: null
	});
};
