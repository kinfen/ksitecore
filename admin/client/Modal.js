import React from 'react';
import ReactDOM from 'react-dom';
var Modal = React.createClass({
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

KAdm.modal = ReactDOM.render(
	<Modal/>, $("#modal")[0]
);
