var keystone = require('keystone'),
	Category = keystone.list('SysCategory');



exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	

	Category.model.find()
    .exec(function(err, categorys) {
        if (err)
        {
        	req.flash('error', err);
        }
        else
        {
        	var hashData = {};
        	for (var i = 0; i < categorys.length; i++)
        	{
        		var obj = categorys[i];
				var tmp = {};
				tmp._id = obj._id;
        		tmp.text = obj.name;
        		var tag = obj.parent ? obj.parent + '' : 'root';
        		tmp.parent = tag;
        		if (hashData[tag] == null)
        		{
        			hashData[tag] = [];
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
