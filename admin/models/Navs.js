/**
 * Created by kinfen on 16/1/28.
 */
var keystone = require('../keystone'),
	Types = keystone.Field.Types;
var config = require('../config/config');
/**
 * Gallery Model
 * =============
 */
var Navs = new keystone.List('Navs');

Navs.add({
	name: { label:"名称", type: String, required: true },
	icon: { label:"图标", type: String},
	parent: {label:"父级", type: Types.Relationship, ref: 'Navs', treeMode:true },
	link:{ label:"链接", type: Types.Url},
	author: {label:"作者", type: Types.Relationship, ref: 'User', index: true},
	state:{label:"状态", type: Types.Select, options: config.nav_states, default:config.NAVS_STATE_NORMAL },
	publishedDate: {label:"发布日期", type: Types.Datetime, default: Date.now }
});

Navs.defaultColumns = 'name, state|20%,  publishedDate|15%';
Navs.register();
