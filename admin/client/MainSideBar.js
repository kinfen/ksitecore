'use strict';
/**
 * Created by kinfen on 16/1/30.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

var MainSideBar = React.createClass({
	getInitialState () {
		return {
			userHead: "dist/img/user2-160x160.jpg",
			userName: "Kinfen",
			userState: 1,
			navs: this.props.navs
			
		};
	},
	componentDidMount () {

	},
	handleInputChange (e) {
	},
	renderUserPanel(){
		let stateNode = this.props.userState == "1" ?
			<a href="#"><i className="fa fa-circle text-success"></i> 在线</a> :
			<a href="#"><i className="fa fa-circle text-danger"></i> 离线</a> ;
		return (
			<div className="user-panel">
				<div className="pull-left image">
					<img src={this.props.userHead} className="img-circle" alt="User Image"/>
				</div>
				<div className="pull-left info">
					<p>{this.props.userName}</p>
					{stateNode}
				</div>
			</div>
		);
	},
	finishAnimation () {
		if (!this.isMounted()) return;
		if (this.refs.email) {
			ReactDOM.findDOMNode(this.refs.email).select();
		}
		this.setState({
			isAnimating: false
		});
	},
	renderTreeMenu(navs, level, key){
		var list = [];
		if (navs.length > 0)
		{
			var self = this;
			_.each(navs, function(element, index){
				let cn = level == 0 ?'treeview':'';
				let subNods;
				let rightItem;
				if (element.childs && element.childs.length > 0)
				{
					subNods = (<ul className="treeview-menu">
								{self.renderTreeMenu(element.childs, level + 1, key)}
								</ul>);
					rightItem = <i className="fa fa-angle-left pull-right"></i>
					
				}
				list.push(
					<li className={cn} key={index}>
						<a href='#' data-url={element.link}>
							<i className="fa fa-dashboard"></i><span>{element.name}</span>{rightItem}
						</a>
						{subNods}
					</li>
				);
			});
		}
		
		return list;
	},
	render(){
		
		return (
			<section className="sidebar">
				{this.renderUserPanel()}
				<ul className="sidebar-menu">
					<li className="header">模块组</li>
					{this.renderTreeMenu(this.state.navs, 0, '')}
				</ul>		
			</section>
		);
	},
});

KAdm.sidebar = ReactDOM.render(
	<MainSideBar
	userHead="dist/img/user2-160x160.jpg"
	userName="Kinfen"
	userState="1"
	navs={[]}
	/>,
	$('.main-sidebar')[0]
);
