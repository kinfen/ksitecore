var _ = require('underscore'),
	React = require('react'),
	Fields = require('FieldTypes'),
	InvalidFieldType = require('./InvalidFieldType');

var Form = React.createClass({
	
	displayName: 'CreateForm',
	createSuccess : false,
	getDefaultProps: function() {
		return {
			err: null,
			values: {},
			animate: false,
			type: null
		};
	},
	
	getInitialState: function() {
		
		var values = this.props.values;
		
		_.each(this.props.list.fields, function(field) {
			if (!values[field.path]) {
				values[field.path] = field.defaultValue;
			}
		});
		
		return {
			values: values
		};
		
	},
	
	handleChange: function(event) {
		var values = this.state.values;
		values[event.path] = event.value;
		this.setState({
			values: values
		});
	},

	componentWillMount: function() {
		this._bodyStyleOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	},
	
	componentDidMount: function() {
		if (this.refs.focusTarget) {
			this.refs.focusTarget.focus();
		}
		var self = this;
		parent.$('#item-modal-pre').on('hidden.bs.modal', function (e) {
		  // do something...
			if (self.createSuccess)
			{
				parent.$('#item-modal').modal();
			}
			self.setState({
				values:self.getInitialState()
			})
		});
		parent.$('#item-modal').on('hidden.bs.modal', function(e){
			self.createSuccess = false;
		});
		
	},
	
	componentWillUnmount: function() {
		document.body.style.overflow = this._bodyStyleOverflow;
	},
	
	getFieldProps: function(field) {
		var props = _.clone(field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'create';
		return props;
	},
	createItem:function(e){
		var self = this;
		var data = this.props.values;
		data._csrf = Keystone.csrf.value;
		data.action = "create";
		
		var l = parent.Ladda.create(e.currentTarget);
		l.start();
	    $.ajax({ 
	      type: "POST", 
	      url: "/ksitecore/api/" + Keystone.template.path, 
	      data: data, 
	      dataType: "json", 
	      success: function (data) { 
	        console.log(data);
	        l.stop();
	        if (data.state === 1)
	        {
	        		self.createSuccess = true;
	          	parent.$("#item-modal-pre").modal('hide');
	          	parent.$("#item-form-frame").attr("height", parent.$(window).height() - 180);
	          	parent.$("#item-form-frame").attr("src", "/keystone/" + data.path + "/" + data.item._id);
	         
	        }
	      }, 
	      error: function (message) { 
	        console.log("提交数据失败！"); 
	      } 
	    });

	},
	closeModalWithID:function(id){
		console.log(id);
		parent.$(id).modal('hide');
	},
	renderToolbar: function() {
		
		var toolbar = {};
		
		if (!this.props.list.noedit) {
			toolbar.save = <button type="submit" className="btn btn-primary">Save</button>;
			// TODO: Confirm: Use React & Modal
			toolbar.reset = <a href={parent.$('#item-form-frame').attr("src")} className="btn btn-link btn-cancel" data-confirm="Are you sure you want to reset your changes?">reset changes</a>;
		}
		
		if (!this.props.list.noedit && !this.props.list.nodelete) {
			// TODO: Confirm: Use React & Modal
			//toolbar.del = <a href={'/ksitecore/categories/list/' + this.props.id + '?type=' + this.props.type + '&delete=' + this.props.data.id + Keystone.csrf.query} className="btn btn-link btn-cancel delete" data-confirm={'Are you sure you want to delete this?' + this.props.list.singular.toLowerCase()}>delete {this.props.list.singular.toLowerCase()}</a>;
		}
		
		return (
			<div>
				{toolbar}
			</div>
		);
		
	},
	render: function() {
		
		var errors = null,
			form = {},
			list = this.props.list,
			formAction = '/ksitecore/categories/list/' + this.props.id + '?type=' + list.path,
			nameField = this.props.list.nameField,
			focusRef;
		
		var modalClass = 'modal fade';
		
		if (this.props.err && this.props.err.errors) {
			var msgs = {};
			_.each(this.props.err.errors, function(err, path) {
				msgs[path] = <li>{err.message}</li>;
			});
			errors = (
				<div className="alert alert-danger">
					<h4>There was an error creating the new {list.singular}:</h4>
					<ul>{msgs}</ul>
				</div>
			);
		}
		
		if (list.nameIsInitial) {
			var nameFieldProps = this.getFieldProps(nameField);
			nameFieldProps.ref = focusRef = 'focusTarget';
			if (nameField.type === 'text') {
				nameFieldProps.className = 'item-name-field';
				nameFieldProps.placeholder = nameField.label;
				nameFieldProps.label = false;
			}
			form[nameField.path] = React.createElement(Fields[nameField.type], nameFieldProps);
		}
		
		_.each(list.initialFields, function(path) {
				
			var field = list.fields[path];
			
			if ('function' !== typeof Fields[field.type]) {
				form[field.path] = React.createElement(InvalidFieldType, { type: field.type, path: field.path });
				return;
			}
			
			var fieldProps = this.getFieldProps(field);
			
			if (!focusRef) {
				fieldProps.ref = focusRef = 'focusTarget';
			}
			
			form[field.path] = React.createElement(Fields[field.type], fieldProps);
			
		}, this);
		
		return (
			<div>
				<div className={modalClass} id="item-modal-pre">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="modal-close" onClick={this.closeModalWithID.bind(this, '#item-modal-pre')}></button>
								<div className="modal-title">Create a new {list.singular}</div>
							</div>
							<div className="modal-body">
								{errors}
								{form}
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-primary ladda-button" data-style="expand-right" onClick={this.createItem.bind(this)}>Create</button>
								<button type="button" className="btn btn-default" onClick={this.closeModalWithID.bind(this, '#item-modal-pre')}>cancel</button>
							</div>
						</div>
					</div>
				</div>
				<div className={modalClass} id="item-modal">
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="modal-close" onClick={this.closeModalWithID.bind(this, '#item-modal')}></button>
								<div className="modal-title">Success Create a new {list.singular}</div>
							</div>
							<div className="modal-body">
								<iframe id="item-form-frame"  src=""  width="100%" frameborder="0"></iframe>
							</div>
							<div className="modal-footer">
								{this.renderToolbar()}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
	
});

module.exports = Form;
