/**
 * Created by kinfen on 16/2/1.
 */
mainLoading.setState({
	loading:false
});
$('#content').show();

function loadCategory()
{
	function formNode(obj)
	{
		var node = {};
		node.text = obj.name;
		if (obj.childs)
		{
			var array = [];
			for (var i = 0; i < obj.childs.length; i++)
			{
				
			}``
		}
	}
	$.ajax({
		url:KAdm.adminPath + "/api/Category/tree",
		dataType:"json",
		success:function(data){
			var catList = [];
			for (var i = 0; i < data.length; i++)
			{
				var node = {};
				node.text = data.name;
				nodes
				catList.text = data.name;
				
			}
		},
		error:function(xhr, error)
		{
			
		}
		
	});
}

loadCategory();
