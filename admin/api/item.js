
/**
 * Created by kinfen on 16/3/5.
 */

var Base = require('./global/Base');
var kadm = require('../');
var _ = require('underscore');
var async = require('async');
var keystone = kadm.getAdminPlus();

module.exports = function(req, res) {

	var data = (req.method === 'POST') ? req.body : req.query;
	if (!keystone.security.csrf.validate(req)) {
		return Base.error(res, "Error", new Error('csrf检验错误'), 'csrf检验错误');
	}
	var action = data.action;
	console.log(data);
	switch(action)
	{
		case "create":
		{
			
			var item = new req.list.model();
			var updateHandler = item.getUpdateHandler(req);
			var data = (req.method === 'POST') ? req.body : req.query;
			if (req.list.nameIsInitial) {
				if (req.list.nameField.inputIsValid(data)) {
					req.list.nameField.updateItem(item, data);
				} else {
					updateHandler.addValidationError(req.list.nameField.path, 'Name is required.');
				}
			}
			updateHandler.process(data, {
				flashErrors: true,
				logErrors: true,
				fields:req.list.initialFields
			}, function(err) {
				if (err) {
					Base.error(res, "Error", err, err.message);
				} else {
					Base.json(res, {
						status:1,
						info:"Success Create Item"
					});
				}
			});
		}
			break;
		case "delete":
		{
			if (req.list.get('nodelete')) {
				console.log(`Refusing to delete ${req.list.key} items; List.nodelete is true`);
				return Base.error(res, "Error", new Error('指定的类型不能删除'), '指定的类型不能删除');
			}
			var ids = req.body.ids || req.body.id || req.params.id;
			if (typeof ids === 'string') {
				ids = ids.split(',');
			}
			if (!Array.isArray(ids)) {
				ids = [ids];
			}
			if (req.user) {
				var userId = String(req.user.id);
				if (ids.some(function(id) {
						return id === userId;
					})) {
					console.log(`Refusing to delete ${req.list.key} items; ids contains current User`);
					return Base.error(res, "Error", new Error('不能删除自身用户'), '不能删除自身用户');
				}
			}
			var deletedCount = 0;
			var deletedIds = [];
			req.list.model.find().where('_id').in(ids).exec(function (err, results) {
				if (err) {
					console.log(`Error deleting ${req.list.key} items:`, err);
					return Base.error(res, "Error", err, err.message);
				}
				async.forEachLimit(results, 10, function(item, next) {
					item.remove(function (err) {
						if (err) return next(err);
						deletedCount++;
						deletedIds.push(item.id);
						next();
					});
				}, function() {
					return Base.json(res, {
						status:1,
						delete_ids: deletedIds,
						count: deletedCount
					});
				});
			});
		}
		case "get":
		{
			var itemQuery = req.list.model.findById(req.params.id).select();
			
			itemQuery.exec(function(err, item) {
			
				if (err) {
					return Base.error(res, "Error", err, err.message);
				}
			
				if (!item) {
					var msg = 'Item ' + req.params.item + ' could not be found.';
					return Base.error(res, "Error", new Error(msg), msg);
				}
			
				var renderView = function() {
			
					var relationships = _.values(_.compact(_.map(req.list.relationships, function(i) {
						if (i.isValid) {
							return _.clone(i);
						} else {
							keystone.console.err('Relationship Configuration Error', 'Relationship: ' + i.path + ' on list: ' + req.list.key + ' links to an invalid list: ' + i.ref);
							return null;
						}
					})));
			
					async.each(relationships, function(rel, done) {
			
						// TODO: Handle invalid relationship config
						rel.list = keystone.list(rel.ref);
						rel.sortable = (rel.list.get('sortable') && rel.list.get('sortContext') === req.list.key + ':' + rel.path);
			
						// TODO: Handle relationships with more than 1 page of results
						var q = rel.list.paginate({ page: 1, perPage: 100 })
							.where(rel.refPath).equals(item.id)
							.sort(rel.list.defaultSort);
			
						// rel.columns = _.reject(rel.list.defaultColumns, function(col) { return (col.type == 'relationship' && col.refList == req.list) });
						rel.columns = rel.list.defaultColumns;
						rel.list.selectColumns(q, rel.columns);
			
						q.exec(function(err, results) {
							rel.items = results;
							done(err);
						});
			
					}, function(err) { //eslint-disable-line no-unused-vars, handle-callback-err
			
						// TODO: Handle err
			
						var showRelationships = _.some(relationships, function(rel) {
							return rel.items.results.length;
						});
			
						var appName = keystone.get('name') || 'Keystone';
			
						keystone.render(req, res, 'item', {
							section: keystone.nav.by.list[req.list.key] || {},
							title: appName + ': ' + req.list.singular + ': ' + req.list.getDocumentName(item),
							page: 'item',
							list: req.list,
							item: item,
							relationships: relationships,
							showRelationships: showRelationships
						});
			
					});
			
				};
			
				if (req.method === 'POST' && req.body.action === 'updateItem' && !req.list.get('noedit')) {
			
					if (!keystone.security.csrf.validate(req)) {
						console.error('CSRF failure', req.method, req.body);
						req.flash('error', 'There was a problem with your request, please try again.');
						return renderView();
					}
			
					item.getUpdateHandler(req).process(req.body, { flashErrors: true, logErrors: true }, function(err) {
						if (err) {
							return renderView();
						}
						req.flash('success', 'Your changes have been saved.');
						return res.redirect('/' + keystone.get('admin path') + '/' + req.list.path + '/' + item.id);
					});
			
			
				} else {
					renderView();
				}
			
			});
		}
		
	}
	

};




