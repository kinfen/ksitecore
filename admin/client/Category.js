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
	getInitialState () {
		return {
			title:"栏目组",
			editMode:false,
			data:{}
		};
	},
	formNode(obj)
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
				return self.formNode(value);
			});
			obj.childs = undefined;
		}
		return node;
	},
	refreshCategory(callback){
		var self = this;
		KAdm.control.api({
			url:KAdm.adminPath + "/api/Category/tree",
			dataType:"json",
			success:function(data){
				var list = _.map(data.list, function(value){
					return self.formNode(value);
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
			url:KAdm.adminPath + "/api/Category",
			type:"POST",
			data:{
				action:"create",
				name:name,
				parent:nodes.length > 0 ? nodes[0].id : null,
				navs:KAdm.navs
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
		//
		//if (this.props.createHandler)
		//{
		//	
		//	this.props.createHandler(name, function(remind){
		//		if (remind)
		//		{
		//			this.setState({
		//				title:remind.title,
		//				content:remind.content
		//			});
		//			$(ReactDOM.findDOMNode(this)).find(".category-remind").slideDown(this.animateSpeed);
		//		}
		//		l.stop();
		//	});
		//}
		//else {
		//	
		//}
		
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
	},
	onCatetoryNodeChecked(e, node){
		//console.log('check!');
		//console.log(node);
	},
	updateTrees(){
		this.treeTarget = $(ReactDOM.findDOMNode(this)).find('.box-body .tree-group').treeview({
			showCheckbox:this.state.editMode,
			showBorder:false,
			onNodeSelected:this.onNodeSelected,
			onNodeChecked:this.onCatetoryNodeChecked,
			data:this.treeData
		})
	},
	renderHeader(){
		let toolsNormal = (<button type="button" className="btn btn-box-tool" onClick={this.enterEditMode}><i className="glyphicon glyphicon-edit"></i>
		</button>);
		
		let toolsEdit = (
			<span>
				<button type="button" className="btn btn-box-tool" onClick={this.showCreateFormHandler}><i className="glyphicon glyphicon-plus"></i>
				</button>
				<button type="button" className="btn btn-box-tool" onClick={this.props.removeHandler}><i className="glyphicon glyphicon-minus"></i>
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
	//renderRemind(){
	//	return (
	//		<div className="callout callout-info category-remind">
	//			<h4>{this.state.remind.title}</h4>
	//			{this.state.remind.content}
	//		</div>	
	//	);
	//},
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
	<Category
		createHandler={KAdm.control.category.createHandler}
		removeHandler={KAdm.control.category.removeHandler}
		onNodeSelected={KAdm.control.category.onNodeSelected}
	/>, $("#category")[0]
);
