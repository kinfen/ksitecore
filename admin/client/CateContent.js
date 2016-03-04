/**
 * Created by kinfen on 16/2/1.
 */
'use strict';


import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import _ from 'underscore';

var CateContent = React.createClass({

	sector:"#table",
	tableList:function(data) {
		data = _.map(data, function (obj) {
			return _.mapObject(obj, function (value, key) {
				if (typeof(value) == "object" && value.name) {
					return value.name;
				}
				else if (key == "publishedDate") {
					return "yyyy-mm-dd";
					//return moment(value).format('YYYY-MM-DD');
				}
				return value;
			})

		});
		return data;
	},
	fields:function(fields, fieldsStr){

		//set table columns prototype,such as label, align, width
		var d = fieldsStr.split(",");

		var fieldsList = [{field:"selected", title:"selected", checkbox:true, width:"28px"}];
		_.each(d, function(obj, index){
			var tmpList = obj.split('|');
			var width;
			if (tmpList.length > 1)
				width = tmpList[1].trim();

			obj = fields[tmpList[0].trim()];
			if (width)
				obj.width = width;
			var item = {field:obj.path, title:obj.label, align:"center"};
			if (obj.path == "name")
			{
				item.align = "left";
			}
			if (obj.width){
				item.width = obj.width;
			}
			if (obj.populate){
				var str = obj.populate.path;
				populates.push(str);
			}
			fieldsList.push(item);
		});
		return fieldsList;

	},
	refresh:function(data) {
		if (!this.sector)
		{
			console.log('table view need a sector');
			return;
		}
		var columns = this.fields(KAdm.model.fields, KAdm.model.defaultColumns);
		//destory the old table;
		$(this.sector).bootstrapTable('destroy');
		$(this.sector).bootstrapTable({
			columns:columns,
			classes : "table table-hover table-no-bordered",
			striped : false,
			clickToSelect : true,
			minimumCountColumns: 1,
			showColumns: true,
			toolbar : "#table-toolbar",
			data: this.tableList(data)
		}).on('click-row.bs.table', function (e, row, $element) {
			//- console.log(this);
			//- console.log($(this).bootstrapTable("getSelections"));
			//- console.log(e);
			//- console.log(row);
			//- console.log($element);
		});
		$(this.sector).on("pre-body.bs.table check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table", function(row){
			var selections = $(this.sector).bootstrapTable("getSelections");
			if (selections.length == 1){
				$('.list-tool-bar li.edit').removeClass("disabled");
				$('.list-tool-bar li.edit a').css("pointer-events", "");

			}
			else{
				$('.list-tool-bar li.edit').addClass("disabled");
				$('.list-tool-bar li.edit a').css("pointer-events", "none");

			}
		});

		$('.list-tool-bar li.edit').on("click", this.editItemHandler);
		$('.list-tool-bar li.delete').on("click", this.removeItemHandler);
	},
	createItemHandler:function(e)
	{
		console.log('test');
		var node = (
			<div className="input-group create-input-group">
				<input type="text" className="form-control" placeholder="名称"/>
				<div className="input-group-btn">
					<button type="button" className="btn btn-primary ladda-button" data-style="expand-left">
						<span className="ladda-labble">查询</span>
					</button>
				</div>
			</div>
		);
		$('.fixed-table-header').after(ReactDOMServer.renderToString(node));
		var searchBar = $('.fixed-table-container .create-input-group');
		console.log(searchBar);
		//searchBar.hide();
		searchBar.slideDown(300);
		
	},
	editItemHandler:function(e)
	{
		var selections = $(this.sector).bootstrapTable("getSelections");
		if (selections.length == 1){
			//- $('.action-sheet').dropdown('toggle');
			var obj = selections[0];
			parent.viewItem(Keystone.template.path, obj._id);
		}
	},
	removeItemHandler:function (e)
	{
		var selections = $(this.sector).bootstrapTable("getSelections");
		var ids = _.pluck(selections, "_id");
		var csrfObj = {};
		csrfObj[Keystone.csrf.key] = Keystone.csrf.value;

		//parent.deleteItem(null, Keystone.template.path, ids, csrfObj, function(result){
		//	if (result)
		//	{
		//		if (Keystone.template.path === "categories")
		//		{
		//			parent.window.location.reload();
		//		}
		//		else
		//		{
		//			window.location.reload();
		//		}
		//	}
		//	else{
		//		$("div#msg").append('<div class="alert alert-danger">删除数据失败</div>');
		//	}
		//});
	},
	getInitialState () {
		return {
			loading:false
		};
	},
	componentDidMount () {
		
	},
	renderToolBar(){
		return(
			<div id="table-toolbar" className="btn-toolbar" role="toolbar" aria-label="...">
				<div className="btn-group" role="group">
					<button type="button" className="btn btn-default" onClick={this.createItemHandler}><i className="glyphicon glyphicon-plus"></i></button>
					<button type="button" className="btn btn-default"><i className="glyphicon glyphicon-trash"></i></button>
				</div>
			</div>
		);	
	},
	renderContent (){
		return(
			<section className="content">
			</section>
		);
	},
	updateTable(){
		
	},
	render(){
		var node;
		if (this.state.loading)
		{
			node = (
				<div className="loading">
					<div className="loadingSpinner">
						<div className="dot1" />
						<div className="dot2" />
					</div>
				</div>	
			);
		}
		else 
		{
			node = (
				<div className="box box-primary">
					<div className="box-header with-border">
						<h3 className="box-title">栏目组</h3>
					</div>
					<div className="box-body">
						{this.renderToolBar()}
						<table id="table"></table>
					</div>
				</div>
			);
		}
		return node;
	},

});

KAdm.cateContent = ReactDOM.render(
	<CateContent/>, $("#cateContent")[0]
);
