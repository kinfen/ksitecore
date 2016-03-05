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
			footers:[(<button type="button" className="btn btn-primary" data-dismiss="modal" key={0}>关闭</button>)]
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
	render(){
		
		var modalType = this.state.type == "" ? this.state.type : "modal-" + this.state.type;
		
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
							<p>{this.state.body}</p>
						</div>
						<div className="modal-footer">
							{this.state.footers}
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
