/**
 * Created by kinfen on 16/1/29.
 */


var _ = require('underscore');
var async = require('async');
var _ = require('underscore');
var Base = require('./global/Base'); 
var keystone = require('../').getAdminPlus();

module.exports = function(req, res) {
	
	var parent = req.query.parent;
	
	var fields = req.query.fields ? req.query.fields.split(',') : null;
	var searchTag  = {state:"normal"};
	if (parent)
		_.extend(searchTag, {parent:parent});
	//console.log(req.list.getOptions());
	if (!fields)
	{
		fields = _.map(req.list.getOptions().uiElements, function(value, index){
			return value.field;fields.push("name");
		});
		fields.push("_id");
		fields.push("name");
	}
	else
	{
		if (fields.indexOf("parent") == -1) {
			fields.push("parent");
		}
		if (fields.indexOf("_id") == -1) {
			fields.push("_id");
		}
	}
	
	var db = req.list.model.find(searchTag);
	db.exec(function(err, items) {
		if (err) return Base.error(res, 'database error', err);

		var hashData = {};
		_.each(items, function(element, index){
			
			node = _.pick(element, fields);
			var tag = node.parent || "root";

			if (hashData[tag] == null)
			{
				hashData[tag] = [];
			}
			hashData[tag].push(node);
			// console.log('create array ' + hashData[tag].length);
		});
		//console.log(hashData);
		function childList(tag, res)
		{
			var list = null;
			if (res[tag])
			{
				list = res[tag];
			}
			if (!list) return null;

			for (var i = 0; i < list.length; i++)
			{
				var obj = list[i];
				
				obj.childs = childList(obj._id, res);
				obj.haha="abc";

			}
			return list;
		}
		var root = parent ? parent : 'root';
		var treeData = childList(root, hashData);
		Base.json(res, treeData);
	});
};
