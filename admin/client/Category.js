/**
 * Created by kinfen on 16/2/1.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

var Category = React.createClass({
	treeTarget:null,
	animateSpeed:300,
	treeData:null,
	treeTarget:null,
	getInitialState () {
		return {
			title:"栏目组",
			editMode:false,
			data:{}
		};
	},
	refreshCategory(callback){
		var self = this;
		var formNode = function(obj)
		{
			var self = this;
			var node = {};
			node.text = obj.name;
			node.link = obj.link;
			node.navs = obj.navs;
			obj.name= undefined;
			node.id=obj._id;
			if (obj.childs)
			{
				node.nodes = _.map(obj.childs, function(value){
					return formNode(value);
				});
				obj.childs = undefined;
			}
			return node;
		};
		
		KAdm.control.api({
			url:KAdm.adminPath + "/api2/Category/tree",
			data:{
				navs:self.props.navs
			},
			dataType:"json",
			success:function(data){
				var list = _.map(data.list, function(value){
					return formNode(value);
				});
				self.treeData = list;
				self.updateTrees();
				if (callback)
				{
					callback(data);
				}
			},
			error:function(xhr, error)
			{
				if (callback)
				{
					callback(xhr, error);
				}
			}
		});
	},
	componentDidMount () {
		$(ReactDOM.findDOMNode(this)).find("#category-create").hide();
		
		this.refreshCategory();
	},
	enterEditMode(e){
		this.setState({
			editMode:true
		})
	},
	leaveEditMode(e){
		this.treeTarget.treeview("uncheckAll");
		this.setState({
			title:"栏目组",
			editMode:false
		})
		$(ReactDOM.findDOMNode(this)).find("#category-create").slideUp(this.animateSpeed);
	},
	checkForm(form)
	{
		var name = form['name'].value;
		if (name.length ==0 )
			return false;
		return true;
	},
	removeHandler(e){
		var checkedNodes = this.treeTarget.treeview("getChecked");
		
		if (checkedNodes.length == 0)
		{
			KAdm.modal.show({
				style:"default",
				title:"提示",
				body:"请勾选需要删除的栏目"
			});
			return;
		}
		
		var list = [];
		for (var i = 0; i < checkedNodes.length; i++)
		{
			
			var node = checkedNodes[i];
			list.push(<li key={i}>{node.text}</li>);
		}
		var bodyElement = (
			<div>
				<div>是否确认删除以下{list.length}个栏目</div>
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
		var checkedNodes = this.treeTarget.treeview("getChecked");
		this.treeTarget.treeview("unselectNode", [checkedNodes, {silent:true}]);
		var ids = _.pluck(checkedNodes, "id");
		
		var btn = e.currentTarget;
		var l =Ladda.create(btn);
		l.start();
		
		KAdm.control.api({
			url:KAdm.adminPath + "/api2/Category",
			type:"POST",
			data:{
				action:"delete",
				ids:ids
			},
			success:function(data)
			{
				if (data.status===1)
				{
					self.treeTarget.treeview("uncheckAll");
					self.refreshCategory();
				}

				KAdm.cateContent.setState({
					loading:false
				});
				l.stop();
				KAdm.modal.hide();
				//KAdm.cateContent.refresh(data.info.results);
			},
			error:function(){
				l.stop();
			}
		}, true);
	},
	submitHandler(e){
		e.preventDefault();
		var nodes = this.treeTarget.treeview('getSelected');
		var form = e.currentTarget;
		var btn = form.querySelector("button[type='submit']");
		if (!this.checkForm(form))
		{
			return false;
		}
		var name = form['name'].value;
		var l = Ladda.create(btn);
		l.start();
		var self = this;
		KAdm.control.api({
			url:KAdm.adminPath + "/api2/Category",
			type:"POST",
			data:{
				action:"create",
				name:name,
				parent:nodes.length > 0 ? nodes[0].id : null,
				navs:self.props.navs
			},
			success:function(data)
			{
				if (data.status===1)
				{
					self.refreshCategory();
				}
				
				KAdm.cateContent.setState({
					loading:false
				});
				l.stop();
				//KAdm.cateContent.refresh(data.info.results);
			},
			error:function(){
				l.stop();
			}
		}, true);
	},
	showCreateFormHandler(e){
		this.setState({
			title:"创建栏目"
		});
		$(ReactDOM.findDOMNode(this)).find("#category-create").slideDown(this.animateSpeed);
	},
	onNodeSelected(e, node){
		if (this.state.editMode){
			
		}	
		else {
			this.props.onNodeSelected(e, node);
		}
		var ids = $('.box-body .tree-group').treeview("getExpanded");
	},
	onCatetoryNodeChecked(e, node){
		//console.log('check!');
		//console.log(node);
	},
	updateTrees(){
		
		var expandedNodes;
		var selectedNodes;
		var checkedNodes;
		var firstRun = true;
		if (this.treeTarget)
		{
			//save the tree state to avoid refresh and lost data
			expandedNodes = this.treeTarget.treeview("getExpanded");
			selectedNodes = this.treeTarget.treeview("getSelected");
			checkedNodes = this.treeTarget.treeview("getChecked");
			expandedNodes = _.pluck(expandedNodes, "nodeId");
			selectedNodes = _.pluck(selectedNodes, "nodeId");
			checkedNodes = _.pluck(checkedNodes, "nodeId");
			firstRun = false;
			this.treeTarget.treeview("remove");
		}
		this.treeTarget = $(ReactDOM.findDOMNode(this)).find('.box-body .tree-group').treeview({
			showCheckbox:this.state.editMode,
			showBorder:false,
			onNodeSelected:this.onNodeSelected,
			onNodeChecked:this.onCatetoryNodeChecked,
			data:this.treeData
		});
		if (!firstRun)
		{
			if (expandedNodes.length > 0)
			{
				this.treeTarget.treeview("expandNode", [expandedNodes, {silent:true}]);
			}
			if (selectedNodes.length > 0)
			{
				//now when edit and delete the selectNode will make mistake
				this.treeTarget.treeview("selectNode", [selectedNodes, {silent:true}]);
			}
			if (checkedNodes.length > 0)
			{
				this.treeTarget.treeview("checkNode", [checkedNodes, {silent:true}]);
			}
		}
	},
	renderHeader(){
		let toolsNormal = (<button type="button" className="btn btn-box-tool" onClick={this.enterEditMode}><i className="glyphicon glyphicon-edit"></i>
		</button>);
		
		let toolsEdit = (
			<span>
				<button type="button" className="btn btn-box-tool" onClick={this.showCreateFormHandler}><i className="glyphicon glyphicon-plus"></i>
				</button>
				<button type="button" className="btn btn-box-tool" onClick={this.removeHandler}><i className="glyphicon glyphicon-trash"></i>
				</button>
				<button type="button" className="btn btn-box-tool" onClick={this.leaveEditMode}><i className="glyphicon glyphicon-ok"></i>
				</button>
			</span>	
		);
		return (
				<div className="box-header with-border">
					<h3 className="box-title">{this.state.title}</h3>
					<div className="box-tools">
						{this.state.editMode ? toolsEdit : toolsNormal}
					</div>
				</div>
		);
	},
	renderCreateForm(){
		
		return (
			<form id="category-create" onSubmit={this.submitHandler}>
				<div className="form-group">
					<div className="input-group" >
						<input name="name"  type="text" className="form-control" placeholder="名称"/>
						<div className="input-group-btn">
							<button type="submit" className="btn btn-primary btn-flat ladda-button" data-style="expand-left"><span className="ladda-labble">创建</span></button>
						</div>
					</div>
				</div>
			</form>	
		);
	},
	render(){
		return (
			<div>
				<div className="box box-solid">
						{this.renderHeader()}
					<div className="box-body">
						{this.renderCreateForm()}
						<div className="tree-group">
						</div>
					</div>
				</div>
			</div>	
		);
	},
	componentDidUpdate(preProps, preState){
		this.updateTrees();
	}

});

KAdm.mainCategory = ReactDOM.render(
	<Category navs={KAdm.navs} onNodeSelected={KAdm.control.category.onNodeSelected}/>, $("#category")[0]
);
