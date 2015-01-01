var keystone = require('keystone'),
	_ = require('underscore'),
	async = require('async'),
	Template = keystone.list('CaTemplate');

var TemplateList = function ()
{
	var template = {};
	this.loadList = function(cb)
	{
		
		var listQuery = Template.model.find();
		listQuery.exec(function (err, list){
			if (list)
			{
				for (var i = 0; i < list.length; i++)
				{
					var obj = list[i];
					template[obj._id] = obj.name;	
				}
			}
		});
		
	}
	this.template = template;
	this.loadList();
}

exports = module.exports = new TemplateList;
