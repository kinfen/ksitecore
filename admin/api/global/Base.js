/**
 * Created by kinfen on 16/1/30.
 */

var Base = function(){};
Base.prototype.json = function (res, obj)
{
	res.json(obj);
}
Base.prototype.error = function (res, key, err, msg)
{
	msg = msg || 'API Error';
	key = key || 'unknown error';
	msg += ` (${key})`;
	console.log(msg + (err ? ':' : ''));
	if (err) {
		console.log(err);
	}
	res.status(500);
	this.json(res, { status:0,  error: key || 'error', detail: err ? err.message : '' });	

}

exprots = module.exports = new Base();
