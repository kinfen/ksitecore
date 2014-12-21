var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var SysCategory = new keystone.List('SysCategory');

SysCategory.add({
	name: { type: String, required: true },
	parent: { type: Types.Relationship, ref: 'SysCategory' },
	publishedDate: { type: Date, default: Date.now },
});

SysCategory.register();