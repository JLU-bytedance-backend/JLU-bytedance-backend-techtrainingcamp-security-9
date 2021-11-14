var cors = require('cors')
var crypto = require('crypto');
var request = require('request')
var express = require('express')
var bodyParser = require('body-parser')
var session = require("express-session")

var Svg = require('../server/Svg.js')
var Login = require('../server/Login.js')
var Logout = require('../server/Logout.js')
var Register = require('../server/Register.js')
var Applycode = require('../server/Applycode.js')

var Module = require('../module.js')
var server = Module.server
var method = Module.method
var rmc = Module.rmc
var now_url = 'localhost:4000'

var app = new express()
app.use(bodyParser.json())
app.use(bodyParser.raw())
app.use(bodyParser.urlencoded())
app.use(session({
	secret:"catch you",
	resave:true,
	cookie : {maxAge : 60*1000*30},
	saveUninitialized:true
}))
app.use(cors())

app.all('/*',(req,res,next)=>{
	
	let rip = req.ip
	let look = server.askStatus(4000) // 是否开启filter
	if(look == 0) { next(); return; }
	let url = '/' + req.url.split('/')[1];
	if(url == '/module') 
		{res.send("非法访问"); return;}

	let ip = undefined
	if(req.body.Environment != undefined)
		if(req.body.Environment.IP != undefined)
			ip = req.body.Environment.IP

	if(url == '/svg') ip = rip

	if(ip == undefined) 
		{res.send({code:400,msg:"缺失ip"}); return;}

	let tmp = rmc.isLocking(ip)
	if(tmp != undefined && tmp >0) 
		{res.send("您已被风控,请过"+ tmp/1000 + "s" + "重试"); return;}

	next();
	return
})

app.use('/svg',(req,res,next)=>{
	let msg = Svg.work({Environment:{IP:req.ip}})
	next();
	return;
})

app.use('/svg',express.static('./svg'))
app.use('/module',express.static('./module'))

app.post('/login',(req,res)=>{
	if(req.session.userinfo)
	{
		res.send("不能重复登陆");
		res.end();
		return;
	}
	Login.work(req.body,msg=>{
		// 写进session
		if(msg == 200)
		{
			req.session.userinfo = {
				phone:req.body.PhoneNumber,
				password:method.crypto_md5(req.body.Password),
				username:req.body.Username
			}
		}
		res.send(msg)
		res.end()
		return
	})
})

app.post('/logout',(req,res)=>{
	Logout.work(req.body,msg=>{
		req.session.destroy(function(err){
	        res.send(msg)
	        res.end()
	    })
	})
	return 
})

app.post('/register',(req,res)=>{
	Register.work(req.body,msg=>{
		res.send(msg)
		res.end()
	}) 
	return
})


app.post('/applycode',(req,res)=>{
	Applycode.work(req.body,msg=>{
		msg.path = now_url + msg.path 
		res.send(msg)
		res.end()
	})
	return 
})

module.exports = {app}