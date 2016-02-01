/**
 * Created by kinfen on 16/2/1.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

var Category = React.createClass({
	getInitialState () {
		return {
			data:''
		};
	},
	componentDidMount () {

	},
	renderHeader(){
		return (
			
				<div className="box-header with-border">
					<h3 className="box-title">栏目组</h3>
					<div className="box-tools">
						<button type="button" className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i>
						</button>
					</div>
				</div>
		);
	},
	render(){
		return (
			<div className="box box-solid">
				{this.renderHeader()}
				<div className="box-body no-padding">
					<section className="menubar">
						<ul className="nav nav-pills nav-stacked sidebar-menu">
							<li className="active treeview">
								<a href="#"><i className="fa fa-inbox"></i> Inbox
								<span className="label label-primary pull-right">12</span></a>
								<ul className="treeview-menu">
									<li className="treeview">
										<a href="#">
											<i className="fa fa-dashboard"></i><span>abc</span>
										</a>
									</li>
								</ul>
							</li>	
							<li><a href="#"><i className="fa fa-envelope-o"></i> Sent</a></li>
							<li><a href="#"><i className="fa fa-file-text-o"></i> Drafts</a></li>
							<li><a href="#"><i className="fa fa-filter"></i> Junk <span className="label label-warning pull-right">65</span></a>
							</li>
							<li><a href="#"><i className="fa fa-trash-o"></i> Trash</a></li>
						</ul>
					</section>
				</div>
			</div>
		);
	},

});

category = ReactDOM.render(
	<Category />, $("#category")[0]
);
