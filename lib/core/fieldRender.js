/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	fspath = require('path'),
	jade = require('jade'),
	fs = require('fs'),
	keystone = require('keystone');
	compiledTemplates = {};



function FieldRender() {

}

exports = module.exports = FieldRender


FieldRender.prototype.render = function(type, fieldType, item, locals, field) {

	// Set up templates
	this.templateDir = fspath.normalize(__dirname + '../../../templates/fields/' + fieldType);

	var templates = {
		form: this.templateDir + '/' + 'form.jade',
		initial: this.templateDir + '/' + 'initial.jade'
	};
	var templatePath = templates[type];
	// Compile the template synchronously if it hasn't already been compiled
	if (!compiledTemplates[templatePath]) {

		var file = fs.readFileSync(templatePath, 'utf8');

		compiledTemplates[templatePath] = jade.compile(file, {
			filename: templatePath,
			pretty: keystone.get('env') !== 'production'
		});

	}

	return compiledTemplates[templatePath](_.extend(locals || {}, {
		field: field,
		item: item
	}));

};
