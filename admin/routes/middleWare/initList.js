/**
 * Created by kinfen on 16/1/30.
 */

var Base = require('../../api/global/Base');

module.exports = function (keystone) {
	return function (respectHiddenOption) {
		return function (req, res, next) {
			try{
				req.list = keystone.list(req.params.model);
				if (!req.list || (respectHiddenOption && req.list.get('hidden'))) {
					Base.error(res, 'error', 'List ' + req.query.model + ' could not be found.');
				}
				next();
			}catch(e)
			{
				Base.error(res, 'error', e);
			}
			
		};
	};
};
