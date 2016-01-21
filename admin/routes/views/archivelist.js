var keystone = require('../../keystone'),
	Category = keystone.list('Category');

var ca = null;

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var itemQuery = Category.model.findById(req.params.id);
	console.log("yi");
    itemQuery.exec(function(err, category) {
		
        if (err)
        {
        	req.flash('error', err);
        }
        else
        {
        	ca = category;
			console.log("yi2");
        	view.render('archivelist', {categoryName:ca.name, id:ca._id});
        }
    });
};
