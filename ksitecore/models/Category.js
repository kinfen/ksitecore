var keystone = require('../keystone'),
	Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var Category = new keystone.List('Category');

Category.add({
	name: { type: String, required: true },
	parent: { type: Types.Relationship, ref: 'Category', initial:true },
	template:{ type: Types.Relationship, ref: 'CaTemplate', initial:true},
	publishedDate: { type: Date, default: Date.now },
});

Category.register();