var fs = require('fs');
var svgCaptcha = require('svg-captcha');
var operating_redis_str = require('../server/redis/redis_opreate/redis_operate_string.js')
var redis_str = new operating_redis_str.operating_redis_str()
var timeout = 60

function generate(url, phone)
{
	let cap = svgCaptcha.create({
          size:4,
          inverse: false,
          fontSize: 36,
          noise: 3,
          width: 80,
          height: 30,
      });

	fs.writeFile("./svg/" + url + phone + ".svg", cap.data, (err) => {
	  	if (err) throw err;
	  	//console.log('The file has been saved!');
	});

	redis_str.insert_into_redis('YZM-' + url + '-' + phone, cap.text, 60).then(res => {//插入更新
	    // console.log(res);
	    return
	})
	return "/svg/" + url + phone + ".svg"
}

function check(url, phone, crayCode,callback)
{
	redis_str.select_from_redis('YZM-' + url + '-' + phone).then(res => {//查询
		if(res.CODE == 400) {callback(false); return;}
		if(res.DATA.toLowerCase() != crayCode.toLowerCase()) {callback(false); return;}
	    callback(true);
	    return;
	})
}

module.exports = {check,generate,timeout}
