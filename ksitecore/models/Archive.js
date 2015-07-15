var keystone = require('../keystone'),
	Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var Archive = new keystone.List('Archive');

Archive.add({
	name: { type: String, required: true },
	subName : { type: String, default:''},
	parent: { type: Types.Relationship, ref: 'Category',default:'', treeMode:true },
	author: { type: String, default:''},
	content : {type: Types.Textarea},
	state : { type: Types.Select, numeric: true, options: [{ value: 1, label: 'availble' }, { value: 0, label: 'disable' }], default:1},
	publishedDate: { type: Date, default: Date.now },
});
Archive.defaultColumns = 'name, publishedDate|15%';
Archive.register();