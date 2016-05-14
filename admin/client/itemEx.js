import React from 'react';
import ReactDOM from 'react-dom';
import Lists from 'keystone/admin/client/stores/Lists';
import EditForm from './components/EditForm';
import FooterBar from './components/FooterBar';
import RelatedItemsList from 'keystone/admin/client/components/RelatedItemsList';
import {Button,ResponsiveText, Alert, Container, Spinner } from 'elemental';

var ItemView = React.createClass({
	displayName: 'ItemView',
	getInitialState () {
		return {
			createIsOpen: false,
			itemData: null,
		};
	},
	componentDidMount () {
		this.loadItemData();
	},
	loadItemData () {
		this.props.list.loadItem(this.props.itemId, { drilldown: true }, (err, itemData) => {
			console.log(itemData);
			if (err || !itemData) {
				// TODO: nicer error handling
				//console.log('Error loading item data', err);
				//alert('Error loading data (details logged to console)');
				return;
			}
			KAdm.control.showLoading(false, 300);
			this.setState({ itemData });
		});
	},
	toggleCreate (visible) {
		this.setState({
			createIsOpen: visible,
		});
	},
	confirmReset(){
		var bodyElement = (
			<div>
				<div>是否重置当前对象的属性?</div>
			</div>
		);
		KAdm.modal.show({
			style:"info",
			title:"提示",
			body:bodyElement,
			footer:{
				leftItems:[
					<button key={0} type="button" className="btn btn-info pull-left ladda-button" data-style="expand-left">重置</button>
				],
				rightItems:[{
					name:"关闭",
					style:"default",
					data:"dismiss"
				}]
			}
		});
	},
	confirmDelete (){
		var bodyElement = (
			<div>
				<div>是否确认删除当前对象</div>
			</div>
		);
		KAdm.modal.show({
			style:"danger",
			title:"提示",
			body:bodyElement,
			footer:{
				leftItems:[
					<button key={0} type="button" className="btn btn-danger pull-left ladda-button" data-style="expand-left" onClick={this.handleDelete}>删除</button>
				],
				rightItems:[{
					name:"关闭",
					style:"default",
					data:"dismiss"
				}]
			}
		});
	},
	handleDelete(e){
		var self = this;
		var selections = $(this.sector).bootstrapTable("getSelections");
		var ids = this.props.itemId;
		var btn = e.currentTarget;
		var l =Ladda.create(btn);
		l.start();
		KAdm.control.api({
			url:KAdm.adminPath + "/api2/" + this.props.list.singular,
			type:"POST",
			data:{
				action:"delete",
				ids:ids,
			},
			success:function(data)
			{
				if (data.status===1)
				{
					KAdm.control.loadPage(this.props.backUrl);
				}
				l.stop();
				KAdm.modal.hide();
			},
			error:function(){
				l.stop();
			}
		}, true);
	},
	renderRelationships () {
		let { relationships } = this.props.list;
		let keys = Object.keys(relationships);
		if (!keys.length) return;
		return (
			<div>
				<h2>Relationships</h2>
				{keys.map(key => {
					let relationship = relationships[key];
					let refList = Lists[relationship.ref];
					return <RelatedItemsList key={relationship.path} list={this.props.list} refList={refList} relatedItemId={this.props.itemId} relationship={relationship} />;
				})}
			</div>
		);
	},
	renderFooterBar () {
		var buttons = [
			<Button key="save" type="primary" submit>保存</Button>
		];
		buttons.push(
			<Button key="reset" onClick={this.confirmReset} type="link-text">
				<ResponsiveText hiddenXS="重置修改" visibleXS="重置" />
			</Button>
		);
		if (!this.props.list.nodelete) {
			buttons.push(
				<Button key="del" onClick={this.confirmDelete} type="link-delete" className="u-float-right">
					<ResponsiveText hiddenXS="删除" visibleXS="删除" />
				</Button>
			);
		}
		return (
			<FooterBar className="EditForm__footer">
				{buttons}
			</FooterBar>
		);
	},
	render () {
		if (!this.state.itemData) return <div className="view-loading-indicator"><Spinner size="md" /></div>;
		return (
		<div className="box box-primary">
			<div className="box-header with-border">
				<h3 className="box-title">编辑</h3>
			</div>
			<div className="box-body">
					<Container>
						<EditForm
							list={this.props.list}
							data={this.state.itemData} />
						{this.renderRelationships()}
					</Container>
			</div>
			<div className="box-footer">
				{this.renderFooterBar()}
			</div>
		</div>
		);
	},
});

ReactDOM.render(
	<ItemView
		backUrl={KAdm.backUrl}
		itemId={KAdm.itemId}
		list={Lists[KAdm.list.key]}
		nav={KAdm.nav}
		signoutUrl={KAdm.signoutUrl}
		User={KAdm.User}
		user={KAdm.user}
	/>,
	document.getElementById('item-view')
);
