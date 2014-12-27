var keystone = require('keystone'),
	Category = keystone.list('SysCategory');



exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'sitecore';
	
	// // Load the galleries by sortOrder
	// view.query('galleries', keystone.list('Gallery').model.find().sort('sortOrder'));


 
	Category.model.find()
    .exec(function(err, categorys) {
        // 对帖子做些处理
        if (err)
        {
        	req.flash('error', err);
        }
        else
        {
        	var menuData = [];
        	var hashData = {};
        	for (var i = 0; i < categorys.length; i++)
        	{
        		var obj = categorys[i];
        		var tmp = {}
        		tmp.text = obj.name;
        		tmp.href = '#kinfen';
        		tmp._id = obj._id + '';

        		var tag = obj.parent ? obj.parent + '' : 'root';
        		tmp.parent = tag;
        		if (hashData[tag] == null)
        		{
        			hashData[tag] = new Array();
        			
        		}
        		hashData[tag].push(tmp);
        		// console.log('create array ' + hashData[tag].length);
        	}

        	// for (var k in hashData)
        	// {
        	// 	console.log(k + ':' + hashData[k]);
        	// }
        	function reformData(tag, res)
			{
				var list = null;
				if (res[tag])
				{
					list = res[tag];
				}
				if (!list) return null;

				for (var i = 0; i < list.length; i++)
				{
					var obj = list[i];

					obj.nodes = reformData(obj._id, res);
					console.log('nodes' + obj.nodes);
				}

				// console.log(list);
				return list;
			}

			var menuData = reformData('root', hashData);
			// console.log(menuData);

        	view.render('contentManager', {list:JSON.stringify(menuData)});
        }
    });


	// // Render the view
	// view.render('contentManager', {categoryName:'kinfen'});
	// // view.render('sitecore');
	
};
