
// Require keystone
var ksitecore = require('./admin');

module.exports = exports = new function()
{
	ksitecore.init();
	ksitecore.start();
};


