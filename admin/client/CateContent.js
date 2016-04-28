/**
 * Created by kinfen on 16/2/1.
 */
'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import moment from 'moment'
import _ from 'underscore';

var CateContent = React.createClass({
	sector:"#table",
	sortName:null,
	sortOrder:null,
	currentUrl:null,
	
	tableList:function(data) {
		data = _.map(data, function (obj) {
			return _.mapObject(obj, function (value, key) {
				if (typeof(value) == "object" && value.name) {
					return value.name;
				}
				else if (key == "publishedDate") {
					return moment(value).format('YYYY-M-D H:mm');
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
		var self = this;
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
				item.formatter = function(value, row, index){
					var target = $("<a href='#'>" + value + "</a>");
					target.on("click", self.props.onTitleSelected);
					return target.outerHTML();
				};
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
	loadData(url, params){
		this.currentUrl = url;
		var self = this;
		this.setState({
			loading:true
		});
		if (!params)
		{
			params={p:1,ps:10}
		}
		else
		{
			params.p= params.p ? params.p : 1;
			params.ps= params.ps ? params.ps : 10;
		}
		
		KAdm.control.api({
			url:url,
			data:params,
			success:function(data)
			{
				if (data.status == 1)
				{
					console.log(data);
					self.setState({
						loading:false,
						page:data.info.currentPage,
						totalPages:data.info.totalPages,
						data:self.tableList(data.info.results)
					});
				}
				else {
					console.log(data);
				}

			}
		});
	},
	checkForm(form)
	{
		var name = form['name'].value;
		if (name.length ==0 )
			return false;
		return true;
	},
	createItemHandler:function(e)
	{
		var node = (
			<form id="table-create">
				<div className="create-input-group">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="名称" name="name"/>
						<div className="input-group-btn">
							<button type="submit" className="btn btn-primary ladda-button" data-style="expand-left">
								<span className="ladda-labble">创建</span>
							</button>
						</div>
					</div>
				</div>
			</form>
		);
		var createField = $(ReactDOM.findDOMNode(this)).find(".create-input-group");
		if ($(ReactDOM.findDOMNode(this)).find(".create-input-group").length == 0)
		{
			//insert the create item next to the fixed-table-header
			$(ReactDOM.findDOMNode(this)).find('.fixed-table-header').after(ReactDOMServer.renderToString(node));
			createField = $(ReactDOM.findDOMNode(this)).find(".create-input-group");
			createField.hide();
		}
		createField.slideToggle(KAdm.config.animateSpeed);
		$(ReactDOM.findDOMNode(this)).find("#table-create").submit(this.submitHandler);
	},
	submitHandler:function(e){
		
		e.preventDefault();
		var form = e.currentTarget;
		var btn = form.querySelector("button[type='submit']");
		if (!this.checkForm(form))
		{
			return false;
		}
		if (!this.state.category)
		{
			KAdm.modal.show({
				style:"default",
				title:"提示",
				body:"请选择一个栏目栏目创建" + this.props.model
			});
			return false;
		}
		var name = form['name'].value;
		var l = Ladda.create(btn);
		l.start();
		var self = this;

		KAdm.control.api({
			url:KAdm.adminPath + "/api/" + this.props.model,
			type:"POST",
			data:{
				action:"create",
				name:name,
				category:this.state.category,
			},
			success:function(data)
			{
				if (data.status===1) {
					self.loadData(self.currentUrl);
				}
				else 
				{
					console.log(data);
				}
				l.stop();
				
			},
			error:function(){
				l.stop();
			}
		}, true);
		return false;
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
		if (selections.length == 0)
		{
			KAdm.modal.show({
				style:"default",
				title:"提示",
				body:"请勾选需要删除的栏目"
			});
			return;
		}
		var list = [];
		for (var i = 0; i < selections.length; i++)
		{
			var node = selections[i];
			list.push(<li key={i}>{node.name}</li>);
		}
		var bodyElement = (
			<div>
				<div>是否确认删除以下{list.length}个对象</div>
				<ul>
					{list}
				</ul>
			</div>
		);

		KAdm.modal.show({
			style:"danger",
			title:"提示",
			body:bodyElement,
			footer:{
				leftItems:[
					<button key={0} type="button" className="btn btn-danger pull-left ladda-button" data-style="expand-left" onClick={this.removeItem}>删除</button>
				],
				rightItems:[{
					name:"关闭",
					style:"default",
					data:"dismiss"
				}]
			}
		});
	},
	removeItem(e){
		var self = this;

		var selections = $(this.sector).bootstrapTable("getSelections");
		var ids = _.pluck(selections, "_id");
		
		var btn = e.currentTarget;
		var l =Ladda.create(btn);
		l.start();

		KAdm.control.api({
			url:KAdm.adminPath + "/api/" + this.props.model,
			type:"POST",
			data:{
				action:"delete",
				ids:ids
			},
			success:function(data)
			{
				if (data.status===1)
				{
					self.loadData(self.currentUrl);
				}
				KAdm.cateContent.setState({
					loading:false
				});
				l.stop();
				KAdm.modal.hide();
			},
			error:function(){
				l.stop();
			}
		}, true);
	},
	pageSelectedHandler(page)
	{
		this.loadData(this.currentUrl, {
			p:page
		});
	},
	getInitialState () {
		return {
			loading:false,
			category:null,
			data:null,
			page:1,
			totalPage:10,
			pageSize:10,
		};
	},
	componentDidUpdate(){
		if (!this.state.loading)
		{
			this.configTableView();
		}
	},
	configTableView(){
		var self = this;
		var eventHandler = function(row)
		{
			
			var selections = $(self.sector).bootstrapTable("getSelections");
			//console.log('config');
			//console.log($(this).bootstrapTable("getSelections"));
			//console.log(selections);
			//console.log($('#table-toolbar button.delete'));
			if (selections.length >= 1){
				$('#table-toolbar button.delete').removeClass("disabled");

			}
			else{
				$('#table-toolbar button.delete').addClass("disabled");
			}
		};
		var sortHandler = function(name,order) {
			var orderTag = order == "asc" ? "+" : "-";
			self.sortName = name;
			self.sortOrder = order;
			self.loadData(self.currentUrl, {sort:orderTag + name});
		};
		$(this.sector).bootstrapTable({
			//onPostBody:eventHandler,
			//onPreBody: eventHandler,
			onSort:sortHandler,
			onCheck: eventHandler,
			onUncheck: eventHandler,
			onCheckAll: eventHandler,
			onUncheckAll: eventHandler
		});
	},
	componentDidMount () {
		this.configTableView();
		//var columns = this.fields(KAdm.model.fields, KAdm.model.defaultColumns);
		//console.log(columns);
		//$(this.sector).bootstrapTable({
		//	columns:columns,
		//	classes : "table table-hover table-no-bordered",
		//	striped : false,
		//	clickToSelect : true,
		//	minimumCountColumns: 1,
		//	showColumns: true,
		//	toolbar : "#table-toolbar",
		//	data: []
		//}).on('click-row.bs.table', function (e, row, $element) {
		//	console.log($element);
		//	//- console.log(this);
		//	//- console.log($(this).bootstrapTable("getSelections"));
		//	//- console.log(e);
		//	//- console.log(row);
		//	//- console.log($element);
		//});
		
		
	},
	renderToolBar(){
		return(
			<div id="table-toolbar" className="btn-toolbar" role="toolbar" aria-label="...">
				<div className="btn-group" role="group">
					<button type="button" className="btn btn-default create" onClick={this.createItemHandler}><i className="glyphicon glyphicon-plus"></i></button>
					<button type="button" className="btn btn-default delete disabled" onClick={this.removeItemHandler}><i className="glyphicon glyphicon-trash"></i></button>
				</div>
			</div>
		);	
	},
	renderCreateForm()
	{
		var node = (
			<form id="table-create" onSubmit={this.submitHandler}>
				<div className="create-input-group">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="名称"/>
						<div className="input-group-btn">
							<button type="submit" className="btn btn-primary ladda-button" data-style="expand-left">
								<span className="ladda-labble">创建</span>
							</button>
						</div>
					</div>
				</div>
			</form>
		);
		return node;
	},
	renderContent (){
		return(
			<section className="content">
			</section>
		);
	},
	renderTable(){
		var thList = [];
		var columns = this.fields(KAdm.model.fields, KAdm.model.defaultColumns);
		for (var i = 0; i < columns.length; i++)
		{
			var column = columns[i];
			thList.push(
				<th 
					data-field={column.field}
					data-sortable={i == 0 ? null : "true"}
					data-width={column.width}
					data-checkbox={column.checkbox}
					key={i} 
				>
						{column.title}
				</th>);
		}
		//<div className="th-inner sortable both"></div>
		var itemList = [];
		if (this.state.data)
		{
			for (var i = 0; i < this.state.data.length; i++)
			{
				var item = this.state.data[i];
				var tdList = [];
				for (var j = 0; j < columns.length; j++)
				{
					var column = columns[j];
					tdList.push(<td key={j}>{item[column.field]}</td>);
					
				}
				itemList.push(<tr key={i}>
					{tdList}
				</tr>);
			}
			
		}
		return (
			<table id="table"
				   data-sort-name={this.sortName}
				   data-sort-order={this.sortOrder}
				   data-toggle="table"
				   data-classes="table table-hover table-no-bordered" 
				   data-striped="false"
				   data-minimum-count-columns="1"
				   data-show-columns="true" 
				   data-toolbar="#table-toolbar"
				   data-side-pagination="server"
				>
				<thead>
					<tr>
						{thList}
					</tr>
				</thead>
				<tbody>
					{itemList}
				</tbody>
			</table>	
		);
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
						{this.renderTable()}
						<KAdm.Dom.Pagination page={this.state.page} pageSize={this.state.pageSize} totalPages={this.state.totalPages} onPageWillChangeTo={this.pageSelectedHandler} />
					</div>
				</div>
			);
		}
		return node;
	},
});
KAdm.cateContent = ReactDOM.render(
	<CateContent model={KAdm.model.singular} onTitleSelected={KAdm.control.cateContent.onTitleSelected} />, $("#cateContent")[0]
);
