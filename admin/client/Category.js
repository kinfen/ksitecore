/**
 * Created by kinfen on 16/2/1.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

var Category = React.createClass({
	treeTarget:null,
	animateSpeed:300,
	getInitialState () {
		return {
			title:"栏目组",
			editMode:false,
			remind:{},
			data:{}
		};
	},
	componentDidMount () {
		$(ReactDOM.findDOMNode(this)).find("#category-create").hide();
		$(ReactDOM.findDOMNode(this)).find(".category-remind").hide();
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
	createHandler(e){
		e.preventDefault();
		var node = this.treeTarget.treeview('getSelected');
		console.log(node);
		if (node.length == 0)
		{
			this.setState({
				remind:{
					title:"提示",
					content:"请选择一个父级栏目?"
				}
			});
			$(ReactDOM.findDOMNode(this)).find(".category-remind").slideDown(this.animateSpeed);
			return;
		}
		
		if (this.props.createHandler)
		{
			var l = Ladda.create(e.currentTarget);
			l.start();
			this.props.createHandler(name, function(remind){
				if (remind)
				{
					this.setState({
						title:remind.title,
						content:remind.content
					});
					$(ReactDOM.findDOMNode(this)).find(".category-remind").slideDown(this.animateSpeed);
				}
				l.stop();
			});
		}
		else {
			
		}
		
	},
	showCreateFormHandler(e){
		this.setState({
			title:"创建栏目"
		});
		$(ReactDOM.findDOMNode(this)).find("#category-create").slideDown(this.animateSpeed);
	},
	onNodeSelected(e, node){
		if (this.state.editMode){
			//console.log(node);
			this.treeTarget.treeview("toggleNodeChecked", [node.nodeId]);
			//this.treeTarget.treeview("selectNode", [node.nodeId]);
		}	
		else {
			this.props.onNodeSelected(e, node);
		}
	},
	onCatetoryNodeChecked(e, node){
		console.log('check!');
		console.log(node);
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
			<div  id="category-create" className="form-group">
				<div className="input-group" >
					<input  type="text" className="form-control" placeholder="名称"/>
					<div className="input-group-btn">
						<button  type="button" className="btn btn-primary btn-flat ladda-button" data-style="expand-left" onClick={this.createHandler}><span className="ladda-labble">创建</span></button>
					</div>
				</div>
			</div>	
		);
	},
	renderRemind(){
		return (
			<div className="callout callout-info category-remind">
				<h4>{this.state.remind.title}</h4>
				{this.state.remind.content}
			</div>	
		);
	},
	render(){
		return (
			<div>
				{this.renderRemind()}
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
	componentDidUpdate(){
		this.treeTarget = $(ReactDOM.findDOMNode(this)).find('.box-body .tree-group').treeview({
			showCheckbox:this.state.editMode,
			showBorder:false,
			onNodeSelected:this.onNodeSelected,
			onNodeChecked:this.onCatetoryNodeChecked,
			data:this.state.data
		})
	}

});

KAdm.mainCategory = ReactDOM.render(
	<Category 
		createHandler={KAdm.control.category.createHandler}
		removeHandler={KAdm.control.category.removeHandler}
		onNodeSelected={KAdm.control.category.onNodeSelected}
	/>, $("#category")[0]
);
