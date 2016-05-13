/**
 * Created by kinfen on 16/1/21.
 */



var browserify = require('./middleware/browserify');
var express = require('express');
var less = require('less-middleware');
var path = require('path');
var kadm = require('../index');
var keystone = kadm.getAdminPlus();
module.exports = exports = function () {
	var router = express.Router();

	/* Prepare browserify bundles */
	var bundles = {
		//fields: browserify('fields.js', 'FieldTypes'),
		signin: browserify('signin.js'),
		MainSideBar: browserify('MainSideBar.js'),
		MainLoading: browserify('MainLoading.js'),
		CateContent: browserify('CateContent.js'),
		Category: browserify('Category.js'),
		Utils: browserify('utilsForReactDom.js'),
		Item: browserify('itemEx.js'),
		//home: browserify('views/home.js'),
		//item: browserify('views/item.js'),
		//list: browserify('views/list.js'),
	};

	// prebuild static resources on the next tick
	// improves first-request performance
	process.nextTick(function() {
		//bundles.fields.build();
		bundles.signin.build();
		bundles.MainSideBar.build();
		bundles.MainLoading.build();
		bundles.CateContent.build();
		bundles.Category.build();
		bundles.Utils.build();
		bundles.Item.build();
		//bundles.home.build();
		//bundles.item.build();
		//bundles.list.build();
	});

	/* Prepare LESS options */
	//var lessPaths = keystone.get('less');
	//var lessOptions = keystone.get('less options') || {};
	
	var path1 = kadm.getKeystonePath();
	var path2 = kadm.getKeystoneRelativePath(__dirname);
	
	var elementalPath = path.join(path.dirname(require.resolve('elemental')), '..');
	var reactSelectPath = path.join(path.dirname(require.resolve('react-select')), '..');
	var keystonePath = kadm.getKeystonePath();
	var lessOptions = {
		render: {
			modifyVars: {
				elementalPath: JSON.stringify(elementalPath),
				reactSelectPath: JSON.stringify(reactSelectPath),
				keystonePath: JSON.stringify(keystonePath)
			}
		},
		debug:true
	};
	
	//JSON.stringify(keystone.get('admin path'))
	console.log('hoho');
    //
	/* Configure router */
	router.use('/style', less(path.resolve(__dirname , '../public/style'), lessOptions));
	//router.use('/styles/fonts', express.static(path.resolve(__dirname , '../../../public/js/lib/tinymce/skins/keystone/fonts')));
	//router.get('/js/fields.js', bundles.fields.serve);
	router.get('/script/signin.js', bundles.signin.serve);
	router.get('/script/MainSideBar.js', bundles.MainSideBar.serve);
	router.get('/script/MainLoading.js', bundles.MainLoading.serve);
	router.get('/script/CateContent.js', bundles.CateContent.serve);
	router.get('/script/Category.js', bundles.Category.serve);
	router.get('/script/utilsForReactDom.js', bundles.Utils.serve);
	router.get('/script/itemEx.js', bundles.Item.serve);
	//router.get('/js/home.js', bundles.home.serve);
	//router.get('/js/item.js', bundles.item.serve);
	//router.get('/js/list.js', bundles.list.serve);
	//router.use(express.static(path.resolve(__dirname + '../../public')));
    
	return router;
};
