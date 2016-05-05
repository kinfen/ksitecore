import React from 'react';
import ReactDOM from 'react-dom';
import Columns from '../keystone/admin/client/columns';
import Lists from '../keystone/admin/client/stores/Lists';
import CreateForm from '../keystone/admin/client/components/CreateForm';
import EditForm from '../keystone/admin/client/components/EditForm';
import EditFormHeader from '../keystone/admin/client/components/EditFormHeader';
import FlashMessages from '../keystone/admin/client/components/FlashMessages';
import Footer from '../keystone/admin/client/components/Footer';
//import MobileNavigation from '../keystone/admin/client/components/MobileNavigation';
//import PrimaryNavigation from '../keystone/admin/client/components/PrimaryNavigation';
import RelatedItemsList from '../keystone/admin/client/components/RelatedItemsList';
import SecondaryNavigation from '../keystone/admin/client/components/SecondaryNavigation';
import { Alert, Container, Spinner } from 'elemental';

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
	render () {
		if (!this.state.itemData) return <div className="view-loading-indicator"><Spinner size="md" /></div>;
		return (
			<div className="keystone-wrapper">
				<div className="keystone-body">
					<Container>
						<EditForm
							list={this.props.list}
							data={this.state.itemData} />
						{this.renderRelationships()}
					</Container>
				</div>
				<Footer
					appversion={this.props.appversion}
					backUrl={this.props.backUrl}
					brand={this.props.brand}
					User={this.props.User}
					user={this.props.user}
					version={this.props.version} />
			</div>
		);
	},
});

ReactDOM.render(
	<ItemView
		appversion={KAdm.appversion}
		backUrl={KAdm.backUrl}
		brand={KAdm.brand}
		itemId={KAdm.itemId}
		list={Lists[KAdm.list.key]}
		messages={KAdm.messages}
		nav={KAdm.nav}
		signoutUrl={KAdm.signoutUrl}
		User={KAdm.User}
		user={KAdm.user}
		version={KAdm.version}
	/>,
	document.getElementById('item-view')
);
