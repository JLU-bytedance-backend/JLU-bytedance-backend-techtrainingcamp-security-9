var Module = require('../module.js')
var rmc = Module.rmc
var applycode = Module.applycode
function work(req,callback)
{
	let ip = req.Environment.IP
	rmc.register('/applycode',req.Environment)
	//rmc.output('/applycode')
	let url = req.Url
	if(url == undefined) 
		{callback({code:400,msg:"缺少接口",
				path:undefined,
				timeout:undefined}); return;}
	
	let phone = req.PhoneNumber
	if(phone == undefined)
		{callback({code:400,msg:"缺少电话信息",
			path:undefined,
			timeout:undefined}); return;}
	
	callback({code:200,msg:"获取验证码成功",
			path:applycode.generate(url,phone),
			timeout:"有效期" + applycode.timeout + "s"})
	return 
}	
module.exports = {work}