//bootstrap table column options

var list_table_columns = [{
		field: "selected",
		checkbox: true
	},{
	    field: '_id',
	    title: 'Item ID',
	    visible: false
	}, {
	    field: 'name',
	    title: 'Item Name',
	},{
		field: 'operate',
		title: 'Item Operate',
		formatter : "operateFormatter",
		clickToSelect : false,
		events : "operateEvents"
	}
];
