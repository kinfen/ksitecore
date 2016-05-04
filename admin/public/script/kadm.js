/**
 * Created by kinfen on 16/2/1.
 */

var category = {
	//set the handle function about the Category
	onNodeSelected: function(event, node){
		KAdm.cateContent.setState({
			category:node.id
		});
		KAdm.cateContent.loadData(KAdm.adminPath + "/api2/Archive/list",{
			"p":1,
			"ps":10
		});
		
	},
	activeCategory:function(){
		KAdm.mainCategory.updateTrees();
		
		//KAdm.category.props = {
		//	createHandler:this.createHandler,
		//	removeHandler:this.removeHandler
		//};
		//KAdm.category.render();
	}
};
var cateContent = {
	onTitleSelected: function(event){
		console.log(event);
	},
};
var boxEx = {
	//sector_
	mainSector:"#category .box",
	toolSectors: {
		edit:'[data-widget="edit"]',
		create:'[data-widget="create"]',
		delete:'[data-widget="delete"]',
		commit:'[data-widget="commit"]'
	},
	edit:function(obj){
		$(this.mainSector).find(".tools-hidden").show();
		$(this.mainSector).find(".tools-show").hide();
		$("#category").treeview("showCheckbox")
	},
	create:function(obj){
		console.log(obj);
	},
	delete:function(obj){
		console.log(obj);
	},
	commit:function(obj){
		$(this.mainSector).find(".tools-hidden").hide();
		$(this.mainSector).find(".tools-show").show();
	},
	activeBox:function(){
		var self = this;
		$(self.mainSector).find(".tools-hidden").hide();
		$(self.mainSector).find(".tools-show").show();
		_.each(this.toolSectors, function(secctor, key){
			$(self.mainSector).on("click", secctor, function(e){
				e.preventDefault();
				//console.log(key);
				self[key]($(this));
			})
		});
	}
	
};
KAdm.config = {
	animateSpeed:300
};
KAdm.control = {
	init:function()
	{
		this.loadSideBarMenu();
		this.loadPage('http://localhost:3000/admin/Category/Archive', "56aece7f7dd7f7e801621fa8");
		$(".sidebar").on('click', 'li a', function (e) {
			var ele = $(this).next();
			if (!ele.is('.treeview-menu')){
				var url = $(this).data("url");
				var navs = $(this).data("id");
				if (url.trim().length > 0)
				{
					KAdm.control.loadPage(url, navs);
				}
				
			}
			
		});
	},
	api:function(opt, isNeedCsrfVaild)
	{
		if (isNeedCsrfVaild)
		{
			opt.data[KAdm.csrf.key] = KAdm.csrf.value;
		}
		$.ajax(opt);
	},
	showLoading:function(b, delay){
		if (!b && delay && delay > 0)
		{
			setTimeout(function(){
				KAdm.mainLoading.setState({
					loading:b
				})
				$('#content').show();
			}, delay);
		}
		else 
		{
			KAdm.mainLoading.setState({
				loading:b
			})
			if (b)
			{
				$('#content').hide();
			}
			else
			{
				$('#content').show();
			}
		}
		
		
	},
	setNavsData:function(data){
		KAdm.sidebar.setState({
			navs:data
		});
	},
	loadSideBarMenu:function()
	{
		var self = this;
		this.api({
			url: KAdm.adminPath + '/api2/Navs/tree',
			success: function (data) {
				self.setNavsData(data.list);
			},
			error: function () {
				console.log('error');
			}

		});
	},
	loadPage:function(url, navs){
		this.showLoading(true);
		KAdm.control.api({
			url:url,
			data:{
				navs:navs	
			},
			dataType:"html",
			success:function(data)
			{
				console.log('load success');
				$('#content').html(data)
			},
			error:function(){

			}
		});
	},
	box:boxEx,
	category:category,
	cateContent:cateContent
};
console.log('init kadm');
KAdm.control.init();


