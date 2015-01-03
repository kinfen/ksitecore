var keystone = require('keystone'),
	_ = require('underscore'),
	async = require('async'),
	ksitecore = require('../../'),
	Template = keystone.list('CaTemplate');

exports = module.exports = function(req, res) {
	
	
	var category = null;
	var sublist = null;
	var pageSize = req.query.pagesize || 10;
	var sort = { by: req.query.sort || Template.defaultSort };
	var viewLocals = {
				validationErrors: {}
			};
	var filters = Template.processFilters(req.query.q),
		cleanFilters = {},
		queryFilters = Template.getSearchFilters(req.query.search, filters);
	
	_.each(filters, function(filter, path) {
		cleanFilters[path] = _.omit(filter, 'field');
	});
	
	var columns = (req.query.cols) ? Template.expandColumns(req.query.cols) : Template.defaultColumns;
	var loadCa = function(cb)
	{
		var itemQuery = Template.model.find();
		if (Template.tracking && Template.tracking.createdBy) {
			itemQuery.populate(Template.tracking.createdBy);
		}
		
		if (Template.tracking && Template.tracking.updatedBy) {
			itemQuery.populate(Template.tracking.updatedBy);
		}

		itemQuery.exec(function(err, item) {
			if (!item) {
				req.flash('error', 'Item ' + req.params.id + ' could not be found.');
				return res.redirect('/ksitecore/err');
			}
			category = item;
			cb();
		});	
	}

	

	var loadList = function(cb)
	{
		var listQuery = Template.paginate({page: req.params.page, perPage: pageSize }).where('parent', category._id).sort(sort.by);
		listQuery.exec(function (err, list){
			if (err) {
				req.flash('error', 'List ' + req.params.item + ' could not be found.');
				return res.redirect(req.path);
			}
	
			sublist = list;
			cb();

		});
	}

	var renderView = function() {
				
		// async.parallel(function(err) {
			ksitecore.render(req, res, 'templates', _.extend(viewLocals, {
				page: 'list',
				submitted: req.body || {},
				list: Template,
				item: category,
				sublisttype:req.query.type,
				sublist:sublist,

				// section: keystone.nav.by.list[Template.key] || {},
				// title: 'Keystone: ' + Template.plural,
				// page: 'list',
				// link_to: link_to,
				// download_link: download_link,
				// list: Template,
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
			ksitecore.templateList.loadList();
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
			Template.updateAll(data, function(err) {
				if (err) {
					console.log('Error updating all ' + Template.plural);
					console.log(err);
					req.flash('error', 'There was an error updating all ' + Template.plural + ' (logged to console)');
				} else {
					req.flash('success', 'All ' + Template.plural + ' updated successfully.');
				}
				ksitecore.templateList.loadList();
				res.redirect('/ksitecore/' + Template.path + "/list/?type=" + req.query.type);
			});
		})();
		
	} else if (!Template.get('nodelete') && req.query['delete']) {
		
		if (!checkCSRF()) return startRender();
		
		if (req.query['delete'] === req.user.id) {
			req.flash('error', 'You can\'t delete your own ' + Template.singular + '.');
			return startRender();
		}
		
		Template.model.findById(req.query['delete']).exec(function (err, item) {
			if (err || !item) return res.redirect('/ksitecore/' + Template.path + "/list/" + req.params.id + "?type=" + req.query.type);
			
			item.remove(function (err) {
				if (err) {
					console.log('Error deleting ' + Template.singular);
					console.log(err);
					req.flash('error', 'Error deleting the ' + Template.singular + ': ' + err.message);
				} else {
					req.flash('success', Template.singular + ' deleted successfully.');
				}
				res.redirect('/ksitecore/' + Template.path + "/list/" + req.params.id + "?type=" + req.query.type);
			});
		});
		
		return;
		
	} else if (!Template.get('nocreate') && Template.get('autocreate') && _.has(req.query, 'new')) {
		
		if (!checkCSRF()) return startRender();
		
		item = new Template.model();
		item.save(function(err) {
			
			if (err) {
				console.log('There was an error creating the new ' + Template.singular + ':');
				console.log(err);
				req.flash('error', 'There was an error creating the new ' + Template.singular + '.');
				startRender();
			} else {
				req.flash('success', 'New ' + Template.singular + ' ' + Template.getDocumentName(item) + ' created.');
				return res.redirect('/ksitecore/' + Template.path + '/item/' + item.id);
			}
			
		});
		
	} else if (!Template.get('nocreate') && req.method === 'POST' && req.body.action === 'create') {
		
		if (!checkCSRF()) return startRender();
		
		item = new Template.model();
		if( req.body.parent)
		{
			item.parent = req.body.parent;
		}
		
		var updateHandler = item.getUpdateHandler(req);
		
		viewLocals.showCreateForm = true; // always show the create form after a create. success will redirect.
		
		if (Template.nameIsInitial) {
			if (!Template.nameField.validateInput(req.body, true, item)) {
				updateHandler.addValidationError(Template.nameField.path, Template.nameField.label + ' is required.');
			}
			Template.nameField.updateItem(item, req.body);
		}
		
		updateHandler.process(req.body, {
			flashErrors: true,
			logErrors: true,
			fields: Template.initialFields
		}, function(err) {
			if (err) {
				return startRender();
			}
			req.flash('success', 'New ' + Template.singular + ' ' + Template.getDocumentName(item) + ' created.');
			ksitecore.templateList.loadList();
			return res.redirect('/ksitecore/' + Template.path + '/item/' + item.id);
		});
		
	} else {
		
		startRender();
		
	}
	
};
