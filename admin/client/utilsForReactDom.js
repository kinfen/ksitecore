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


KAdm.Dom.Pagination = React.createClass({

	maxPage:7,
	getInitialState () {
		return {
			pageSize: this.props.pageSize || 10,
			page: this.props.page || 1,
			totalPage: this.props.totalPage || 1,
			
		}
	},

	renderPageSizeSelector(){
		return(
			<div className="pull-left pagination-detail">
				<span className="pagination-info">第{this.state.Page}页</span>
				<span className="page-list">
					<span className="btn-group dropup">
						<button type="button" className="btn btn-default  dropdown-toggle" data-toggle="dropdown">
							<span className="page-size">{this.state.pageSize}</span>
							<span className="caret"></span>
						</button>
						<ul className="dropdown-menu" role="menu">
							<li className="active"><a href="javascript:void(0)">{this.state.pageSize}</a></li>
							<li><a href="javascript:void(0)">25</a></li>
							<li><a href="javascript:void(0)">50</a></li>
							<li><a href="javascript:void(0)">100</a></li>
							<li><a href="javascript:void(0)">All</a></li>
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
		if (this.state.totalPage <= this.maxPage)
		{
			beginIndex = 1;
			endIndex = this.state.totalPage;
			for (var i = beginIndex; i <= endIndex; i++)
			{
				var classStr = i === this.state.page? "page-number active" : "page-number";
				liList.push(<li className={classStr} key={i}><a href="javascript:void(0)">{i}</a></li>);
			}
		}
		else
		{
			beginIndex = 1;
			endIndex = this.maxPage;
			var fixIndexList = [];
			if (this.state.page - 1 > this.maxPage / 2)
				fixIndexList.push(beginIndex + 1);
			if (this.state.totalPage - this.state.page > this.maxPage / 2)
				fixIndexList.push(endIndex - 1);
			
			//console.log(fixIndexList.contains(1));

			for (var i = beginIndex; i <= endIndex; i++)
			{
				var classStr;
				var pageText;
				if (fixIndexList.indexOf(i) != -1)
				{
					classStr = "page-last-separator disabled";
					pageText = "...";
				}
				else 
				{
					if (i === this.state.page)
					{
						classStr = "page-number active"
					}
					else 
					{
						classStr = "page-number"
					}
					if (i === endIndex)
					{
						pageText = 
					}
				}
				var classStr = fixIndexList.indexOf(i) != -1 ? "page-last-separator disabled"
														: i === this.state.page
															? "page-number active" 
															: "page-number";
				var pageText = fixIndexList.indexOf(i) != -1 ? "..." 
																:i === endIndex
																	? this.max
				liList.push(<li className={classStr} key={i}><a href="javascript:void(0)">{pageText}</a></li>);
			}
		}
		
		
		
		return(
			<div className="pull-right pagination">
				<ul className="pagination">
					<li className="page-pre"><a href="javascript:void(0)">‹</a></li>
					{liList}
					<li className="page-next"><a href="javascript:void(0)">›</a></li>
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
