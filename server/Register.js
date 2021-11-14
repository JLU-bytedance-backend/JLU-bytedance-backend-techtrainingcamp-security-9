var tar = require('./mysql/connect/db_table_operators/table_four_operators.js')
var Module = require('../module.js')
var rmc = Module.rmc
var method = Module.method
var applycode = Module.applycode
var target = new tar.db_table_operator()

function work(req,callback)
{
	let ip = req.Environment.IP
	rmc.register('/register',req.Environment)
	let phone = req.PhoneNumber
    let pwd = req.Password;
    let name = req.Username

	if(phone == undefined || pwd == undefined || name == undefined)
		{callback({code:400,msg:"信息不全"}); return;}

	if(false) // phone 格式不对
		{callback({code:400,msg:"电话格式错误"}); return;}
	if(false) // pwd 格式不对
		{callback({code:400,msg:"密码格式错误"}); return;}
	if(false) // name 格式不对
		{callback({code:400,msg:"用户名格式错误"}); return;}

	let level = rmc.getLevel('/register',req.Environment)
	if(level > 0) //需要验证码
	{
		if(req.VerifyCode == undefined)
			{callback({code:400,msg:"缺少验证码"}); return;}
		
		if(applycode.check('/register',phone,req.VerifyCode))
			{callback({code:400,msg:"验证码错误或过期，请重新获取"}); return;}
	}
	
	let rphone = undefined// 用户是否存在
	if(rphone != undefined)
		{callback({code:400,msg:"用户已注册"}); return;}

	var tmp = {
	    id:method.getUID(),
	    user_name:name,
	    password:method.crypto_md5(pwd),
	    phone_num:phone
	}

	target.dynamic_insert_one_table_sql(tmp,"user",['phone_num'],4).then(res=>{
		if(res.CODE == 200) res = {code:200,msg:"注册成功"}
		else res = {code:400,msg:"注册失败"}
		callback(res)
	})
}
module.exports = {work}