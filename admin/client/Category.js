/**
 * Created by kinfen on 16/2/1.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

var Category = React.createClass({
	getInitialState () {
		return {
			editMode:false,
			data:{}
		};
	},
	componentDidMount () {

	},
	enterEditMode(e){
		this.setState({
			editMode:true
		})
	},
	leaveEditMode(e){
		this.setState({
			editMode:false
		})
	},
	onNodeSelected(e, node){
		if (this.state.editMode){
			
		}	
		else {
			this.props.onNodeSelected(e, node);
		}
	},
	renderHeader(){
		let toolsNormal = (<button type="button" className="btn btn-box-tool" onClick={this.enterEditMode}><i className="glyphicon glyphicon-edit"></i>
		</button>);
		
		let toolsEdit = (
			<span>
				<button type="button" className="btn btn-box-tool" onClick={this.props.createHandler}><i className="glyphicon glyphicon-plus"></i>
				</button>
				<button type="button" className="btn btn-box-tool" onClick={this.props.removeHandler}><i className="glyphicon glyphicon-minus"></i>
				</button>
				<button type="button" className="btn btn-box-tool" onClick={this.leaveEditMode}><i className="glyphicon glyphicon-ok"></i>
				</button>
			</span>	
		);
		
		return (
			
				<div className="box-header with-border">
					<h3 className="box-title">栏目组</h3>
					<div className="box-tools">
						{this.state.editMode ? toolsEdit : toolsNormal}
					</div>
				</div>
		);
	},
	render(){
		return (
			<div className="box box-solid">
				{this.renderHeader()}
				<div className="box-body no-padding">
				</div>
			</div>
		);
	},
	componentDidUpdate(){
		$(ReactDOM.findDOMNode(this)).find('.box-body').treeview({
			showCheckbox:this.state.editMode,
			showBorder:false,
			onNodeSelected:this.onNodeSelected,
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
