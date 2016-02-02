/**
 * Created by kinfen on 16/2/1.
 */
'use strict';


import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

var MainContent = React.createClass({
	getInitialState () {
		return {
			loading:false

		};
	},
	componentDidMount () {

	},
	renderHeader(){
		return (
			<section className="content-header">
				<h1>Dashboard<small>Control Panel</small></h1>
				<ol className="breadcrumb">
					<li>
						<a href="#">
							<i className="fa fa-dashboard">Home</i>
						</a>
					</li>
					<li className="active">
						<a href="#">
							<i className="fa fa-dashboard">Dashboard</i>
						</a>
					</li>
				</ol>
			</section>
		);
	},
	renderContent (){
		return(
			<section className="content">
			</section>
		);
	},
	render(){
		return (
			<div>
				{this.renderHeader()}
				{this.renderContent()}
			</div>
		);
	},

});

KAdm.mainContent = ReactDOM.render(
	<MainContent/>, $("#content")[0]
);
