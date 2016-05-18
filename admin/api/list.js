/**
 * Created by kinfen on 16/2/2.
 */
	
var Base = require('./global/Base');
var kadm = require('../');
var _ = require('underscore');
var keystone = kadm.getAdminPlus();

module.exports = function(req, res) {
	
	var category = req.query.cat;
	var fields = req.query.fields ? req.query.fields.split(',') : null;
	var page = req.query.p || 1;
	var sortTag = req.query.sort || req.list.defaultSort;
	var pageSize = req.query.ps || 10;
	var searchTag  = {state:"normal"};
	if (category)
		_.extend(searchTag, {category:category});
	//console.log(req.list.getOptions());
	if (!fields)
	{
		fields = _.map(req.list.getOptions().uiElements, function(value, index){
			return value.field;fields.push("name");
		});
		fields.push("_id");
		fields.push("navs");
	}
	var db = req.list.paginate({
		page: page,
		perPage: pageSize,
		filters:searchTag
	}).where(searchTag);
	if (sortTag)
	{
		db.sort(sortTag);
	}
	db.exec(function(err, items) {
		if (err) return Base.error(res, 'database error', err);
		Base.json(res, {
			status:1,
			info:items
		});
	});
};
