// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
 
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
function viewItem(path, id)
{
	console.log('hihi');
	$("#item-form-frame").attr("height", $(window).height() - 180);
	$("#item-form-frame").attr("src", "/keystone/" + path + "/" + id);
	$('#item-modal').modal();
}
function deleteItem(btnRef, path, id, csrfObj)
{
	//delete function can appear anywhere, so I pick it out from createform.js
	
	if (!confirm('do you want to remove ' + path + " " + id))
	{
		return;
	}
	
	var extendData = {action:"delete"};
	_.extend(extendData, csrfObj);
	var l = parent.Ladda.create(btnRef);
	l.start();
    $.ajax({ 
      type: "POST", 
      url: "/ksitecore/api/" + path + "/delete/" + id, 
      data: extendData, 
      dataType: "json", 
      success: function (data) { 
        console.log(data);
        console.log("haha");
        l.stop();
        if (data.state === 1)
        {
          	$("#item-modal").modal('hide');
        }
      }, 
      error: function (message) { 
        console.log("提交数据失败！"); 
        l.stop();
      } 
    });
}






