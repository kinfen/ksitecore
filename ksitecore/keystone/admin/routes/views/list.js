var keystone = require('../../../'),
	_ = require('underscore'),
	async = require('async')

Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
};

exports = module.exports = function(req, res) {
	
	
	var category = null;
	var sublist = null;
	var sl = keystone.list(req.query.type) || req.list;
	var pageSize = req.query.pagesize || 10;
	var sort = { by: req.query.sort || req.list.defaultSort };
	var viewLocals = {
				validationErrors: {},
				showCreateForm: _.has(req.query, 'new')
			};
	var filters = req.list.processFilters(req.query.q),
		cleanFilters = {},
		queryFilters = req.list.getSearchFilters(req.query.search, filters),
		columns = (req.query.cols) ? sl.expandColumns(req.query.cols) : sl.defaultColumns,
		populates = [],
		fields = null;
		
	_.each(filters, function(filter, path) {
		cleanFilters[path] = _.omit(filter, 'field');
	});
	var getFields = function ()
	{
		var fieldsList = [];
		for (var i = 0 ; i < columns.length; i++)
		{
			var obj = columns[i];
			var item = {field:obj.path, title:obj.label};
			if (obj.width){
				item.width = obj.width;
			}
			if (obj.populate){
				var str = obj.populate.path;
				populates.push(str);
			}
			fieldsList.push(item);
		}
		return fieldsList;
	}
	fields = getFields();
	var loadCa = function(cb)
	{
		var itemQuery = null;
		if (!req.params.id)
		{
			//find root category when no id was translate to list
			itemQuery = req.list.model.findOne({parent:undefined});
		}
		else
		{
			itemQuery = req.list.model.findById(req.params.id);
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
			var listQuery = sl.paginate({page: req.page, perPage:req.pageSize }).where('parent', category._id).sort(sort.by);
			for (var i = 0; i < populates.length; i++){
				listQuery.populate(populates[i], "name");
			}
			listQuery.exec(function (err, list){
				if (err) {
					req.flash('error', 'List ' + req.params.item + ' could not be found.');
					return res.redirect(req.path);
				}
				
				var results = [];
				
				
				for (var i = 0; i < list.results.length; i++){
					var item = list.results[i];
					var obj = {}
					for (var key in item){
						if (typeof(item[key]) == "object"){
							obj[key] = item[key].name;
						}
						else{
							obj[key] = item[key];
						}
					}
					results.push(item)
				}
				list.results = results;
				console.log(list);
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
			keystone.render(req, res, 'list', _.extend(viewLocals, {
				page: 'list',
				submitted: req.body || {},
				list: req.list,
				req: req,
				item: category,
				sublisttype:sl,
				sublist:sublist,
				callfrom:res.path,
				Date2:Date,
				// section: keystone.nav.by.list[req.list.key] || {},
				// title: 'Keystone: ' + req.list.plural,
				// page: 'list',
				// link_to: link_to,
				// download_link: download_link,
				// list: req.list,
				sort: sort,
				filters: cleanFilters,
				// search: req.query.search,
				columns: fields,
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
			console.error('CSRF failure');
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
					req.flash('success', 'All ' + sl.plural + ' updated successfully.');
				}
				res.redirect('/ksitecore/' + req.list.path + "/list/?type=" + sl.path);
			});
		})();
		
	} else if (!sl.get('nodelete') && req.query['delete']) {
		
		if (!checkCSRF()) return startRender();
		
		if (req.query['delete'] === req.user.id) {
			req.flash('error', 'You can\'t delete your own ' + sl.singular + '.');
			return startRender();
		}
		
		sl.model.findById(req.query['delete']).exec(function (err, item) {
			if (err || !item) return res.redirect('/ksitecore/' + req.list.path + "/list/" + req.params.id + "?type=" + sl.path);
			
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
					res.redirect('/ksitecore/' + req.list.path + "/list/" + req.params.id + "?type=" + sl.path);
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
				return res.redirect('/keystone/' + sl.path + '/' + item.id);
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
			logErrors: true,
			fields: sl.initialFields
		}, function(err) {
			if (err) {
				viewLocals.createErrors = err;
				return startRender();
			}
			req.flash('success', 'New ' + sl.singular + ' ' + sl.getDocumentName(item) + ' created.');
			return res.redirect('/keystone/' + sl.path + '/' + item.id);
		});
		
	} else {
		
		startRender();
		
	}
	
};
