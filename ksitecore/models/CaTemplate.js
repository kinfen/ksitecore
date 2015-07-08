var keystone = require('../keystone'),
	Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var CaTemplate = new keystone.List('CaTemplate');

CaTemplate.add({
	name: { type: String, required: true },
	path: { type: String, default:''},
	publishedDate: { type: Date, default: Date.now },
});
CaTemplate.register();