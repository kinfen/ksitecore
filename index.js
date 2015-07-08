
// Require keystone
var ksitecore = require('./ksitecore');

module.exports = exports = new function()
{
	ksitecore.init();
	ksitecore.start();
};


