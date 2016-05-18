 import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
KAdm.Dom = {};
KAdm.Dom.Modal = React.createClass({
	getInitialState () {
		return {
			type: "",
			title:"",
			body:"",
			btnLabel:"确认",
			callback:undefined,
			footer:{
				leftItems:[],
				rightItems:[{
					name:"关闭",
					style:"default",
					data:"dismiss",
				}]
			}
		}
	},
	componentDidMount () {
	},
	show(state){
		if (!state.footer)
		{
			state.footer = this.getInitialState().footer;
		}
		if (state){
			this.setState(state);
		}
		$("#modal .modal").modal();
	},
	hide(){
		$("#modal .modal").modal("hide");
	},
	render(){
		
		var modalType = this.state.type == "" ? this.state.type : "modal-" + this.state.type;
		
		var body;
		body = typeof this.state.body === "string"
			? (<p>{this.state.body}</p>)
			: this.state.body;
		
		var footer = [];
		var count = 0;
		var self  = this;
		_.each(this.state.footer, function(obj, key){
			for (var i = 0; i < obj.length; i++)
			{
				
				var item = obj[i];
				if (item.$$typeof)
				{
					count++;
					footer.push(item);
				}
				else 
				{
					var className = "btn btn-" + item.style;
					if (key === "leftItems")
						className += " pull-left";
					var callback = item.onClick;
					if (item.data === "dismiss")
					{

						footer.push(<button type="button" className={className} onClick={callback} data-dismiss="modal" key={count++}>{item.name}</button>);
					}
					else
					{
						footer.push(<button type="button" className={className} onClick={callback} key={count++}>{item.name}</button>);
					}
				}
			}
		});
		
		return (
			<div className={"modal fade " + modalType}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span></button>
							<h4 className="modal-title">{this.state.title}</h4>
						</div>
						<div className="modal-body">
							{body}
						</div>
						<div className="modal-footer">
							{footer}
						</div>
					</div>
				</div>
			</div>		
		);
		
	}
});
KAdm.Dom.LaddaBtn = React.createClass({
	getInitialState () {
		//console.log('init param' + this.props.page);
		return {
			//pageSize: this.props.pageSize || 10,
			//page: this.props.page || 1,
			//totalPage: this.props.totalPage || 1,

		}
	},
	onClick(e){
		var btn = e.currentTarget;
		var l = Ladda.create(btn);
		l.start();
		console.log('click');
	},
	render(){
		var direction = "expand-" + this.props.direction || "left";
		var classStr = "btn ladda-button btn-" + this.props.type || "primary";
		var extClassName = classStr + " " + this.props.className || "";
		var props = {};
		var tag = 'button';
		props.type = this.props.submit ? 'submit' : 'button';
		props.dataStyle = direction;
		props.className = classStr;
		props.onClick= this.onClick;
		if (props.href) {
			tag = 'a';
			delete props.type;
		}
		return React.createElement(tag, props, this.props.children);
	}
});

KAdm.Dom.Pagination = React.createClass({

	maxPage:7,
	getInitialState () {
		//console.log('init param' + this.props.page);
		return {
			//pageSize: this.props.pageSize || 10,
			//page: this.props.page || 1,
			//totalPage: this.props.totalPage || 1,
			
		}
	},
	nextPage(){
		if (this.props.onPageWillChangeTo)
		{
			this.props.onPageWillChangeTo(Math.min(this.props.page + 1, this.props.totalPages) );
		}
	},
	prePage(){
		if (this.props.onPageWillChangeTo)
		{
			this.props.onPageWillChangeTo(Math.max(this.props.page - 1, 1) );
		}
	},
	pageSizeSelectedHandler(e){
		var size = $(e.currentTarget).data("size");
		if (this.props.onPageSizeWillChangeTo)
		{
			this.props.onPageSizeWillChangeTo(size);
		}	
	},
	pageSelectedHandler(e){
		var page = $(e.currentTarget).data("page");
		if (this.props.onPageWillChangeTo)
		{
			this.props.onPageWillChangeTo(page);
		}
	},
	renderPageSizeSelector(){
		
		var psList = [10, 25, 50, 100];
		var liList = [];
		for (var i = 0; i < psList.length; i++)
		{
			var size = psList[i];
			liList.push(
				<li onClick={this.pageSizeSelectedHandler} data-size={size} key={i}><a href="javascript:void(0)">{size}</a></li>
			);
		}
		
		return(
			<div className="pull-left pagination-detail">
				<span className="pagination-info">第{this.props.page}页&nbsp;</span>
				<span className="page-list">
					<span className="btn-group dropup">
						<button type="button" className="btn btn-default  dropdown-toggle" data-toggle="dropdown">
							<span className="page-size">{this.props.pageSize}</span>
							<span className="caret"></span>
						</button>
						<ul className="dropdown-menu" role="menu">
							{liList}
						</ul>
					</span>
				</span>
			</div>	
		);
	},
	
	
	renderPageSelector(){
		
		var liList = [];
		var beginIndex;
		var endIndex;
		var page = this.props.page;
		page = Math.max(1, page);
		page = Math.min(this.props.totalPages, page);
		
		if (this.props.totalPages <= this.maxPage)
		{
			beginIndex = 1;
			endIndex = this.props.totalPages;
			for (var i = beginIndex; i <= endIndex; i++)
			{
				var classStr = i === page? "page-number active" : "page-number";
				liList.push(<li className={classStr} data-page={i} key={i} onClick={this.pageSelectedHandler}><a href="javascript:void(0)">{i}</a></li>);
			}
		}
		else
		{
			var offset = 0;
			var halfPage = Math.floor(this.maxPage / 2);
			beginIndex = page - halfPage;
			endIndex = page + halfPage;
			if (page-halfPage < 1)
			{
				offset = 1 - (page - halfPage);
			}
			else if (page + halfPage > this.props.totalPages)
			{
				offset = this.props.totalPages - (page + halfPage);
			}
			beginIndex += offset;
			endIndex += offset;
			var keyCounter = 0;
			if (beginIndex > 1)
			{
				beginIndex += 2;
				liList.push(<li className="page-number" onClick={this.pageSelectedHandler} data-page={1} key={1}><a href="javascript:void(0)" >1</a></li>);
				liList.push(<li className="page-last-separator disabled" key={2}><a href="javascript:void(0)">...</a></li>);
			}
			if (endIndex < this.props.totalPages) {
				endIndex -= 2;
			}
			for (var i = beginIndex; i <= endIndex; i++)
			{
				var classStr = i === page? "page-number active" : "page-number";
				liList.push(<li className={classStr} data-page={i} key={i} onClick={this.pageSelectedHandler}><a href="javascript:void(0)">{i}</a></li>);
			}
			if (endIndex < this.props.totalPages)
			{
				liList.push(<li className="page-last-separator disabled" key={this.props.totalPages - 1}><a href="javascript:void(0)">...</a></li>);
				liList.push(
					<li className="page-number" onClick={this.pageSelectedHandler} data-page={this.props.totalPages} key={this.props.totalPages}>
						<a href="javascript:void(0)">{this.props.totalPages}</a>
					</li>);
			}
		}
		
		
		return(
			<div className="pull-right pagination">
				<ul className="pagination">
					<li className="page-pre" onClick={this.prePage}><a href="javascript:void(0)" >‹</a></li>
					{liList}
					<li className="page-next" onClick={this.nextPage}><a href="javascript:void(0)" >›</a></li>
				</ul>
			</div>	
		);
	},
	render(){
		return (
			<div className="table-pagination">
				{this.renderPageSizeSelector()}
				{this.renderPageSelector()}
			</div>
		);
	}

});

KAdm.modal = ReactDOM.render(
	<KAdm.Dom.Modal/>, $("#modal")[0]
);
