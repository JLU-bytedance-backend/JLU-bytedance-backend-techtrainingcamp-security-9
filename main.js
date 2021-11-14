var Module = require('./module.js')
var server4000 = require('./module/server4000.js')
var db_IO = require('./server/SystemIO.js')

var rmc = Module.rmc
var Rule = Module.rule
var server = Module.server
var method = Module.method
var app4000 = server4000.app

async function importICB(url)
{
	let res = await db_IO.importICB_DB(url)
	rmc.interImportICB(url,res)
}

async function exportICB(url)
{
	let str = rmc.interExportICB(url)
	await db_IO.exportICB_DB(url,str)
}

async function importRule()
{
	let res = await db_IO.importRule_DB()
	rmc.importRule(res)
}

async function exportRule()
{
	let str = rmc.exportRule()
	await db_IO.exportRule_DB(str)
}

async function importInter()
{
	let res = await db_IO.importInter_DB()
	rmc.importInterface(res)
}

async function exportInter()
{
	let str = rmc.exportInterface()
	await db_IO.exportInter_DB(str)
}


async function importInter_Rule()
{
	let lst = rmc.exportInterface()
	for(let i = 0, len = lst.length; i < len; i++)
	{
		let res = await db_IO.importInter_Rule_DB(lst[i].id)
		rmc.inter_importRule(lst[i].url,res)
	}
}

async function exportInter_Rule()
{
	let lst = rmc.exportInterface()
	for(let i = 0, len = lst.length; i < len; i++)
	{
		let res = rmc.inter_exportRule(lst[i].url)
		for(let j = 0, l = res.length; j < l; j++)
			await db_IO.exportInter_Rule_DB(lst[i].id,res[j])
	}
}

async function importSystem()
{
	await importRule()
	await importInter()
	await importInter_Rule()
	console.log("导入成功")
}

async function exportSystem() 
{
	await exportRule()
	await exportInter()
	await exportInter_Rule()
	console.log("导出成功")
}

let start = async function(){

await importSystem()
server.set(4000,app4000)
server.openServer(4000)
server.openFilter(4000)


// rmc.addInterface({url:'/svg',id:method.getUID(),name:"svg资源"})
// rmc.addInterface({url:'/login',id:method.getUID(),name:"登录"})
// rmc.addInterface({url:'/logout',id:method.getUID(),name:"登出"})
// rmc.addInterface({url:'/register',id:method.getUID(),name:"注册"})
// rmc.addInterface({url:'/applycode',id:method.getUID(),name:"获取验证码"})


// id = method.getUID()
// rmc.addRule(new Rule(id,10000,5,"level1",1,0,"l1"))
// rmc.inter_addRule('/svg',id)
// rmc.inter_addRule('/login',id)
// rmc.inter_addRule('/logout',id)
// rmc.inter_addRule('/register',id)
// rmc.inter_addRule('/applycode',id)

// id = method.getUID()
// rmc.addRule(new Rule(id,10000,10,"level2",2,3000,"l2"))
// rmc.inter_addRule('/svg',id)
// rmc.inter_addRule('/login',id)
// rmc.inter_addRule('/logout',id)
// rmc.inter_addRule('/register',id)
// rmc.inter_addRule('/applycode',id)

// await exportSystem()
// rmc.register('/login',{"IP":"12.46"})
// rmc.register('/login',{"IP":"12.46"})
// rmc.register('/login',{"IP":"123.45"})
// rmc.register('/login',{"IP":"123.45"})

// var rule,id
// let tmp = 0
// setInterval(function(){
// 	tmp ++
// 	if(tmp < 15) 
// 	{
// 		rmc.register('/login',{"IP":"12.46"})
// 		rmc.register('/login',{"IP":"123.45"})
// 	}
// 	rmc.update('/login')
// 	rmc.output('/login')
// 	console.log(rmc.ipifLock)
// },1000)

}
start()

