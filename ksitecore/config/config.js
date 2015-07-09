var Config = function()
{
	
}

Config.prototype.CATEGORY_STATE_NORMAL = 'normal';
Config.prototype.CATEGORY_STATE_DISABLED = 'disabled';
Config.prototype.templates = ['Archive', 'Category'];
Config.prototype.category_states = [Config.prototype.CATEGORY_STATE_NORMAL, Config.prototype.CATEGORY_STATE_DISABLED];
exports = module.exports = new Config();
