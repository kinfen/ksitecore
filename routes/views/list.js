var keystone = require('keystone');
exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var itemQuery = req.list.model.findById(req.params.id);
	
	console.log(req.params.listtype);
	
    itemQuery.exec(function(err, category) {
        if (err)
        {
        	req.flash('error', err);
        }
        else
        {
        	ca = category;
        	view.render('list', {categoryName:ca.name, id:ca._id});
        }
    });
};
