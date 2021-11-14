var cors = require('cors')
var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')

class Server
{
	constructor()
	{
		this.server = {}
		this.flag = {}
	}
	askStatus(num)
	{
		return this.flag[num]
	}
	set(num,app)
	{
		this.flag[num] = 0
		this.server[num] = app
	}
	openServer(num)
	{
		this.server[num].listen(num,()=>{
		    console.log('The server is listening on port : ',num)
		})
	}
	closeServer(num)
	{
		this.flag[num] = 0
		this.server[num].close()
	}
	delServer(num)
	{
		delete this.server[num]
	}
	openFilter(num)
	{	
		this.flag[num] = 1
	}
	closeFilter(num)
	{
		this.flag[num] = 0
	}
}
module.exports = {Server}