var keystone = require('keystone'),
	Category = keystone.list('SysCategory');



exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
    view.render('welcome');

	
};
