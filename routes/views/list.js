var keystone = require('keystone'),
	_ = require('underscore'),
	async = require('async'),
	ksitecore = require('../../');

exports = module.exports = function(req, res) {
	
	
	var category = null;
	var sublist = null;
	var pageSize = req.query.pagesize || 10;
	var sort = { by: req.query.sort || req.list.defaultSort };
	var viewLocals = {
				validationErrors: {}
			};
	var filters = req.list.processFilters(req.query.q),
		cleanFilters = {},
		queryFilters = req.list.getSearchFilters(req.query.search, filters);
	
	_.each(filters, function(filter, path) {
		cleanFilters[path] = _.omit(filter, 'field');
	});
	
	var columns = (req.query.cols) ? req.list.expandColumns(req.query.cols) : req.list.defaultColumns;
	var loadCa = function(cb)
	{
		var itemQuery = req.list.model.findById(req.params.id);
		
		


		if (req.list.tracking && req.list.tracking.createdBy) {
			itemQuery.populate(req.list.tracking.createdBy);
		}
		
		if (req.list.tracking && req.list.tracking.updatedBy) {
			itemQuery.populate(req.list.tracking.updatedBy);
		}

		itemQuery.exec(function(err, item) {
			if (!item) {
				req.flash('error', 'Item ' + req.params.item + ' could not be found.');
				return res.redirect('/keystone/' + req.list.path);
			}
			category = item;
			cb();
		});	
	}

	

	var loadList = function(cb)
	{
		var listQuery = req.list.paginate({page: req.params.page, perPage: pageSize }).where('parent', category._id).sort(sort.by);
		listQuery.exec(function (err, list){
			if (err) {
				req.flash('error', 'List ' + req.params.item + ' could not be found.');
				return res.redirect(req.path);
			}
			console.log(list)
			sublist = list;
			cb();

		});
	}

	var renderView = function() {
				
		// async.parallel(function(err) {
			ksitecore.render(req, res, 'list', _.extend(viewLocals, {
				page: 'list',
				submitted: req.body || {},
				list: req.list,
				item: category,
				sublisttype:req.params.listtype,
				sublist:sublist,

				// section: keystone.nav.by.list[req.list.key] || {},
				// title: 'Keystone: ' + req.list.plural,
				// page: 'list',
				// link_to: link_to,
				// download_link: download_link,
				// list: req.list,
				sort: sort,
				filters: cleanFilters,
				// search: req.query.search,
				// columns: columns,
				colPaths: _.pluck(columns, 'path'),
				submitted: req.body || {},
				query: req.query
			}));
			
		// });
		
	};

	async.waterfall([loadCa, loadList], function(err){
		renderView();
	});
	
};
