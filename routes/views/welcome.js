var keystone = require('keystone'),
	_ = require('underscore'),
	ksitecore = require('../../'),
	async = require('async'),
	Category = keystone.list('Category');

exports = module.exports = function(req, res) {
	
	
	var categorys = null;
	var viewLocals = {
				validationErrors: {}
			};
	var loadList = function(cb)
	{
		var listQuery = Category.paginate({page: 1, perPage: 1 });
		listQuery.exec(function (err, list){
			if (err || list.length == 0) {
				req.flash('error', 'has not a Category could not be found.');
			}
			categorys = list;
			cb();

		});
	}

	var renderView = function() {
				
			ksitecore.render(req, res, 'welcome', _.extend(viewLocals, {
				list:keystone.list("Category"),
				submitted: req.body || {},
				item: categorys
			}));
			
		// });
		
	};
	
	var startRender = function()
	{
		async.waterfall([loadList], function(err){
			renderView();
		});
	}
	
	startRender();
	
};
