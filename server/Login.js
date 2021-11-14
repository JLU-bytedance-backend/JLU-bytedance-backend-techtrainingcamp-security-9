var tar = require('./mysql/connect/db_table_operators/table_four_operators.js')
var Module = require('../module.js')
var rmc = Module.rmc
var method = Module.method
var applycode = Module.applycode
var target = new tar.db_table_operator()

async function work(req,callback)
{
	let ip = req.Environment.IP
	rmc.register('/login',req.Environment)
	//rmc.output('/login') //

	let phone = req.PhoneNumber
    let pwd = req.Password;

	if(phone == undefined || pwd == undefined)
		{callback({code:400,msg:"信息不全"}); return;}

	if(false) // phone 格式不对
		{callback({code:400,msg:"电话格式错误"}); return;}
	if(false) // pwd 格式不对
		{callback({code:400,msg:"密码格式错误"}); return;}

	
	let l = ['password','id']
	let item = {
		phone_num:{
			operator:'=',
			value:phone
		}
	}

	let level = rmc.getLevel('/login',req.Environment)
	if(level > 0) //需要验证码
	{
		if(req.VerifyCode == undefined)
			{callback({code:400,msg:"缺少验证码"}); return;}
		
		applycode.check('/login',phone,req.VerifyCode,res=>{
			if(res == 0)
				{callback({code:400,msg:"验证码错误或过期，请重新获取"}); return;}

			target.dynamic_select_one_table_sql(l,item,"user").then(res=>{
				if(res.DATA.length == 0)
					{callback({code:400,msg:"用户未注册"}); return;}
				let data = res.DATA[0]
				if(data.password != method.crypto_md5(pwd))
					{callback({code:400,msg:"密码错误"}); return;}
				callback({code:200,msg:"登陆成功"});
			})
		})
	}
	else
	{	
		target.dynamic_select_one_table_sql(l,item,"user").then(res=>{
			if(res.DATA.length == 0)
				{callback({code:400,msg:"用户未注册"}); return;}
			let data = res.DATA[0]
			if(data.password != method.crypto_md5(pwd))
				{callback({code:400,msg:"密码错误"}); return;}
			callback({code:200,msg:"登陆成功"});
			return
		})
	}
}

module.exports = {work}