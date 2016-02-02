/**
 * Created by kinfen on 16/2/1.
 */

var table = {
	tableList:function(data) {
		data = _.map(data, function (obj) {
			return _.mapObject(obj, function (value, key) {
				if (typeof(value) == "object" && value.name) {
					return value.name;
				}
				else if (key == "publishedDate") {
					return "yyyy-mm-dd";
					//return moment(value).format('YYYY-MM-DD');
				}
				return value;
			})

		});
		console.log(data);
		return data;
	},
	fields:function(fields, fieldsStr){
		
			//set table columns prototype,such as label, align, width
		var d = fieldsStr.split(",");
		
		var fieldsList = [{field:"selected", title:"selected", checkbox:true, width:"28px"}];
		_.each(d, function(obj, index){
			var tmpList = obj.split('|');
			var width;
			if (tmpList.length > 1)
				width = tmpList[1].trim();
			
			obj = fields[tmpList[0].trim()];
			if (width)
				obj.width = width;
			var item = {field:obj.path, title:obj.label, align:"center"};
			if (obj.path == "name")
			{
				item.align = "left";
			}
			if (obj.width){
				item.width = obj.width;
			}
			if (obj.populate){
				var str = obj.populate.path;
				populates.push(str);
			}
			fieldsList.push(item);
		});
		return fieldsList;
		
	},
	init:function(sector, data) {
		console.log(data);
		var columns = this.fields(KAdm.model.fields, KAdm.model.defaultColumns);
		//console.log(columns);
		//console.log('init Table');
		//$(sector).bootstrapTable({
		//	columns:columns,
		//	classes : "table table-hover table-no-bordered",
		//	striped : false,
		//	clickToSelect : true,
		//	minimumCountColumns: 1,
		//	showColumns: true,
		//	toolbar : "#tool-bar",
		//	data: this.tableList(data)
		//}).on('click-row.bs.table', function (e, row, $element) {
		//	//- console.log(this);
		//	//- console.log($(this).bootstrapTable("getSelections"));
		//	//- console.log(e);
		//	//- console.log(row);
		//	//- console.log($element);
		//});
		//$("#table").on("pre-body.bs.table check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table", function(row){
		//	//console.log("hoho");
		//	//var selections = $("#table").bootstrapTable("getSelections");
		//	//if (selections.length == 1){
		//	//	$('#tool-bar li.edit').removeClass("disabled");
		//	//	$('#tool-bar li.edit a').css("pointer-events", "");
         //   //
		//	//}
		//	//else{
		//	//	$('#tool-bar li.edit').addClass("disabled");
		//	//	$('#tool-bar li.edit a').css("pointer-events", "none");
         //   //
		//	//}
		//});
		
		KAdm.mainTable.setState({
			columns:columns,
			data:this.tableList(data)
		});
		
		//$('#tool-bar li.edit').on("click", this.editItemHandler);
		//$('#tool-bar li.delete').on("click", this.removeItemHandler);
	},
	//editItemHandler:function(e)
	//{
	//	var selections = $("#table").bootstrapTable("getSelections");
	//	if (selections.length == 1){
	//		//- $('.action-sheet').dropdown('toggle');
	//		var obj = selections[0];
	//		parent.viewItem(Keystone.template.path, obj._id);
	//	}
	//},
	//removeItemHandler:function (e)
	//{
	//	var selections = $("#table").bootstrapTable("getSelections");
	//	var ids = _.pluck(selections, "_id");
	//	var csrfObj = {};
	//	csrfObj[Keystone.csrf.key] = Keystone.csrf.value;
	//
	//	parent.deleteItem(null, Keystone.template.path, ids, csrfObj, function(result){
	//		if (result)
	//		{
	//			if (Keystone.template.path === "categories")
	//			{
	//				parent.window.location.reload();
	//			}
	//			else
	//			{
	//				window.location.reload();
	//			}
	//		}
	//		else{
	//			$("div#msg").append('<div class="alert alert-danger">删除数据失败</div>');
	//		}
	//	});
	//}
}

KAdm.control = {
	init:function()
	{
		this.loadSideBarMenu();
		this.loadPage('http://localhost:3000/admin/Category/Archive');
		$(".sidebar").on('click', 'li a', function (e) {
			var ele = $(this).next();
			if (!ele.is('.treeview-menu')){
				var url = $(this).data("url");
				if (url.trim().length > 0)
				{
					KAdm.control.loadPage(url);
				}
				
			}
			
		});
	},
	api:function(opt)
	{
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
			url: KAdm.adminPath + '/api/Navs/tree',
			success: function (data) {
				self.setNavsData(data.list);
			},
			error: function () {
				console.log('error');
			}

		});
	},
	loadPage:function(url){
		this.showLoading(true);
		$.ajax({
			url:url,
			dataType:"html",
			success:function(data)
			{
				$('#content').html(data)
			},
			error:function(){

			}
		});
	},
	loadCategory:function(){
		function formNode(obj)
		{
			var node = {};
			node.text = obj.name;
			node.link = obj.link;
			obj.name= undefined;
			node.id=obj._id;
			if (obj.childs)
			{
				node.nodes = _.map(obj.childs, function(value){
					return formNode(value);
				});
				obj.childs = undefined;
			}
			return node;
		}
		this.api({
			url:KAdm.adminPath + "/api/Category/tree",
			dataType:"json",
			success:function(data){
				var list = _.map(data.list, function(value){
					return formNode(value);
				});
				$('#category').treeview({
					showBorder:false,
					onNodeSelected: function(event, node) {
						KAdm.control.api({
							url:KAdm.adminPath + "/api/Archive/list?cat=" + node.id + "&p=1&ps=10",
							success:function(data)
							{
								console.log(data);
								KAdm.control.table.init("#table", data.info.results);
							}
						});
						//console.log(node);
						//$("#content-frame").attr("src", "/ksitecore/#{list.path}/list/" + node._id + "?type=" + node.template);
					},
					data:list
				});
			},
			error:function(xhr, error)
			{

			}

		});
	},
	table:table
};
console.log('init kadm');
KAdm.control.init();


