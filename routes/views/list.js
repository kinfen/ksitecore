var keystone = require('keystone'),
	_ = require('underscore'),
	async = require('async'),
	ksitecore = require('../../');

exports = module.exports = function(req, res) {
	
	
	var category = null;
	var sublist = null;
	var sl = keystone.list(req.params.listtype);
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
		var itemQuery = null;
		itemQuery = req.params.id ? req.list.model.findById(req.params.id) : req.list.model.find();
		
		var itemQuery = req.list.model.findById(req.params.id);
		if (req.list.tracking && req.list.tracking.createdBy) {
			itemQuery.populate(req.list.tracking.createdBy);
		}
		
		if (req.list.tracking && req.list.tracking.updatedBy) {
			itemQuery.populate(req.list.tracking.updatedBy);
		}

		itemQuery.exec(function(err, item) {
			if (!item) {
				req.flash('error', 'Item could not be found.');
				return res.redirect('/ksitecore/err');
			}
			category = item;
			cb();
		});	
	}

	

	var loadList = function(cb)
	{
		if (category)
		{
			
			var listQuery = sl.paginate({page: req.params.page, perPage: pageSize }).where('parent', category._id).sort(sort.by);
			listQuery.exec(function (err, list){
				if (err) {
					req.flash('error', 'List ' + req.params.item + ' could not be found.');
					return res.redirect(req.path);
				}
				
				sublist = list;
				cb();
	
			});
		}
		else
		{
			cb();
		}
	}

	var renderView = function() {
				
		// async.parallel(function(err) {
			ksitecore.render(req, res, 'list', _.extend(viewLocals, {
				page: 'list',
				submitted: req.body || {},
				list: req.list,
				item: category,
				sublisttype:sl,
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
	
	var startRender = function()
	{
		async.waterfall([loadCa, loadList], function(err){
			renderView();
		});
	}
	
	var checkCSRF = function() {
		var pass = keystone.security.csrf.validate(req);
		if (!pass) {
			req.flash('error', 'There was a problem with your request, please try again.');
		}
		return pass;
	};
	
	var item;
	if ('update' in req.query) {
		
		if (!checkCSRF()) return startRender();
		
		(function() {
			var data = null;
			if (req.query.update) {
				try {
					data = JSON.parse(req.query.update);
				} catch(e) {
					req.flash('error', 'There was an error parsing the update data.');
					return startRender();
				}
			}
			sl.updateAll(data, function(err) {
				if (err) {
					console.log('Error updating all ' + sl.plural);
					console.log(err);
					req.flash('error', 'There was an error updating all ' + sl.plural + ' (logged to console)');
				} else {
					req.flash('success', 'All ' + slt.plural + ' updated successfully.');
				}
				res.redirect('/ksitecore/' + req.list.path + "/listtype/" + sl.path);
			});
		})();
		
	} else if (!sl.get('nodelete') && req.query['delete']) {
		
		if (!checkCSRF()) return startRender();
		
		if (req.query['delete'] === req.user.id) {
			req.flash('error', 'You can\'t delete your own ' + sl.singular + '.');
			return startRender();
		}
		
		sl.model.findById(req.query['delete']).exec(function (err, item) {
			if (err || !item) return res.redirect('/ksitecore/' + req.list.path + "/" + req.params.id + "/listtype/" + sl.path);
			
			item.remove(function (err) {
				if (err) {
					console.log('Error deleting ' + sl.singular);
					console.log(err);
					req.flash('error', 'Error deleting the ' + sl.singular + ': ' + err.message);
				} else {
					req.flash('success', sl.singular + ' deleted successfully.');
				}
				if (req.params.id && req.params.id != "undefined")
				{
					res.redirect('/ksitecore/' + req.list.path + "/" + req.params.id + "/listtype/" + sl.path);
				}
				else
				{
					res.redirect('/ksitecore/welcome');
				}
				
			});
		});
		
		return;
		
	} else if (!sl.get('nocreate') && sl.get('autocreate') && _.has(req.query, 'new')) {
		
		if (!checkCSRF()) return startRender();
		
		item = new sl.model();
		item.save(function(err) {
			
			if (err) {
				console.log('There was an error creating the new ' + sl.singular + ':');
				console.log(err);
				req.flash('error', 'There was an error creating the new ' + sl.singular + '.');
				startRender();
			} else {
				req.flash('success', 'New ' + sl.singular + ' ' + sl.getDocumentName(item) + ' created.');
				return res.redirect('/ksitecore/' + sl.path + '/edit/' + item.id);
			}
			
		});
		
	} else if (!sl.get('nocreate') && req.method === 'POST' && req.body.action === 'create') {
		
		if (!checkCSRF()) return startRender();
		
		item = new sl.model();
		if( req.body.parent)
		{
			item.parent = req.body.parent;
		}
		
		var updateHandler = item.getUpdateHandler(req);
		
		viewLocals.showCreateForm = true; // always show the create form after a create. success will redirect.
		
		if (sl.nameIsInitial) {
			if (!sl.nameField.validateInput(req.body, true, item)) {
				updateHandler.addValidationError(sl.nameField.path, sl.nameField.label + ' is required.');
			}
			sl.nameField.updateItem(item, req.body);
		}
		
		updateHandler.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: sl.initialFields
		}, function(err) {
			if (err) {
				return startRender();
			}
			req.flash('success', 'New ' + sl.singular + ' ' + sl.getDocumentName(item) + ' created.');
			return res.redirect('/ksitecore/' + sl.path + '/edit/' + item.id);
		});
		
	} else {
		
		startRender();
		
	}
	
};
