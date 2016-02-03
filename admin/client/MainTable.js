/**
 * Created by kinfen on 16/2/1.
 */
'use strict';


import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

var MainTable = React.createClass({
	getInitialState () {
		return {
			data: {},
			columns: []
		}	
	},
	componentDidMount () {
		console.log('mount');
		KAdm.control.table.init("#table", this.state.data);
		
	},
	//renderHeader(){
	//	let headList = [];
	//	_.each(this.state.columns, function(obj, index){
	//		let style = obj.align ? {textAlign:obj.align} : {};
	//		style = _.extend(style, obj.width ? {width:obj.width} : {});
	//		let c = obj.checkbox ? "bs-checkbox" : null;
	//		let tdContent = obj.checkbox? <input name="btSelectItem" type="checkbox"/> :
	//			obj.title;
	//		var node = (<th className={c} style={style} data-field={obj.field} tabIndex="0" key={index}>
	//						<div className="th-inner ">{tdContent}</div>
	//						<div className="fht-cell"></div>
	//					</th>);
	//		headList.push(node);
	//	});
	//	return (
	//		<thead>
	//			<tr>
	//				{headList}
	//			</tr>
	//		</thead>
	//	);
	//},
	//renderList (){
	//	var list = [];
	//	var self = this;	
	//	_.each(self.state.data, function(obj, i){
	//		let tds = [];
	//		_.each(self.state.columns, function(field, j){
	//			let style = field.align ? {textAlign:field.align} : {};
	//			style = _.extend(style, field.width ? {width:field.width} : {});
	//			let c = field.checkbox ? "bs-checkbox" : null;
	//			let tdContent = field.checkbox? <input data-index={i} name="btSelectItem" type="checkbox"/> :
	//							obj[field.field];
	//			//console.log(obj[field.field]);
	//			tds.push(<td style={style} className={c} key={j}>
	//				{tdContent}
	//			</td>);
	//		});
	//		
	//		let node = (<tr id={obj.id} data-index={i} key={i}>
	//			{tds}
	//		</tr>);
	//		list.push(node);
	//	});
	//	
	//	return(
	//		<tbody>
	//			{list}
	//		</tbody>
	//	);
	//},
	render(){
		//return (
		//	//<table data-toggle="table" className="table table-hover table-no-bordered">
		//	//	{this.renderHeader()}
		//	//	{this.renderList()}
		//	//</table>	
		//	
		//);
		console.log('render');
		return (
				<table id="table"></table>
		)
	},
	componentDidUpdate()
	{
		$('#table').bootstrapTable('destroy');
		KAdm.control.table.init("#table", this.state.data);
		//
	},


});

KAdm.mainTable = ReactDOM.render(
	<MainTable/>, $("#table1")[0]
);
