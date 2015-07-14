var React = require('react');
var CreateForm = require('../components/CreateForm');

var View = React.createClass({
	
	displayName: 'ListView',
	
	getInitialState: function() {
		return {
			createIsVisible: Keystone.showCreateForm,
			animateCreateForm: false
		};
	},
	
	toggleCreate: function(visible) {
//		this.setState({
//			createIsVisible: visible,
//			animateCreateForm: true
//		});
		if (visible)
		{			

     		 parent.$("#item-modal-pre" ).modal({});

		}
		
	},
	renderCreateButton: function() {
		if (Keystone.list.autocreate) {
			return (
				<div className="toolbar">
					<a href={'?new' + Keystone.csrf.query} className="btn btn-default">
						<span className="ion-plus-round mr-5" />
						Create {Keystone.template.singular}
					</a>
				</div>
			);
		}
		return (
			<div className="toolbar">
				<button type="button" className="btn btn-default" onClick={this.toggleCreate.bind(this, true)}>
					<span className="ion-plus-round mr-5" />
					Create {Keystone.template.singular}
				</button>
			</div>
		);
	},
	render: function() {
		if (Keystone.template.nocreate) return null;
		return (
			<div className="create-item">
				{this.renderCreateButton()}
			</div>
		);
	}
	
});

React.render(<View />, document.getElementById('list-view'));
parent.$("#item-view-modal").empty();
if (parent.react)
{
	React.unmountComponentAtNode(parent.$("#item-view-modal")[0])
}
parent.react = React.render(<CreateForm list={Keystone.template} id={Keystone.category_id} values={Keystone.createFormData} err={Keystone.createFormErrors} />, parent.$("#item-view-modal")[0]);
