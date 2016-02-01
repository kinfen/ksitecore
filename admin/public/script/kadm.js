/**
 * Created by kinfen on 16/2/1.
 */

function loadSideBarMenu()
{
	$.ajax({
		url: KAdm.adminPath + '/api/Navs/tree',
		success: function (data) {
			sidebar.setState({
				navs:data
			});
		},
		error: function () {
			console.log('error');
		}

	});
}

function loadPage(url)
{
	$.ajax({
		url:"http://localhost:3000/admin/category/archive",
		dataType:"html",
		success:function(data)
		{
			$('#content').html(data)
		},
		error:function(){
			
		}
	})
}
loadSideBarMenu();
loadPage();
mainLoading.setState({
	loading:true
})


