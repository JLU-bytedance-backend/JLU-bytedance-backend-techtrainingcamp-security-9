var Module = require('../module.js')
var rmc = Module.rmc
function work(req)
{
	rmc.register('/svg',req.Environment)
}
module.exports = {work}