var Module = require('../module.js')
var rmc = Module.rmc
function work(req,callback)
{
	let ip = body.Environment.IP
	rmc.register('/logout',req.Environment)
	callback({code:200,msg:""})
	return
}
module.exports = {work}