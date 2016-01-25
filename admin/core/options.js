/**
 * Created by kinfen on 16/1/25.
 */
exports = module.exports = function()
{
	var exports = {};
	
	exports.set = function (key, value)
	{
		if (arguments.length === 1) {
			return this._options[key];
		}

		this._options[key] = value;
		return this;
	}
	exports.options = function(options) {
		if (!arguments.length) {
			return this._options;
		}
		if (utils.isObject(options)) {
			debug('settings options');
			var keys = Object.keys(options),
				i = keys.length,
				k;
			while (i--) {
				k = keys[i];
				this.set(k, options[k]);
			}
		}
		return this._options;
	};
	exports.get = exports.set;
	console.log("get");
	return exports;
}
