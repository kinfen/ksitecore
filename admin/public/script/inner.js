/**
 * Created by kinfen on 16/2/1.
 */

console.log("inner loaded");
KAdm.control.showLoading(false, 1000);
KAdm.control.box.activeBox();
KAdm.control.category.activeCategory();


KAdm.itemPage = ReactDOM.render(
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


