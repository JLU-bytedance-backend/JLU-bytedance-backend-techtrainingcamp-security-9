var ICB = require('./ICB.js')
var Method = require('./Method.js')
class RMC
{
	constructor()
	{
		this.mp = {}
		this.ipifLock = {}  // IP锁定表
	}
	getInterID(url)
	{
		return this.mp[url].id
	}
	isLocking(ip)
	{
		if(this.ipifLock[ip] == undefined) 
			return undefined
		return this.ipifLock[ip].value
	}
	unlock(ip)
	{
		this.ipifLock[ip].value = 0
		this.ipifLock[ip].timeoutId = 0
		this.ipifLock[ip].endTimeStamp = 0
	}
	lock(ip,timeout)
	{
		if(timeout > 0)
			console.log("ip:" + ip + '已经被锁定')
		this.ipifLock[ip].value = timeout
		this.ipifLock[ip].endTimeStamp = Method.getTime() + timeout
		var self = this
		this.ipifLock[ip].timeoutId = setTimeout(function()
		{
			self.unlock(ip)
		},timeout)
	}
	checkLock(lockList)
	{
		for(let x in lockList)
		{
			let tmp = 0
			for(let y of lockList[x])
				tmp = Math.max(tmp,y)
			this.lock(x,tmp)
		}
	}
	getLevel(url,environment)
	{
		let res = this.mp[url].icb.getLevel(environment)
		console.log(environment.IP + "目前在" + url +"端口的等级为" + res)
		return res
	}
	register(url,environment)
	{
		if(this.ipifLock[environment.IP] == undefined)
			this.ipifLock[environment.IP] = {}
		let lockList = this.mp[url].icb.register(environment)
		this.checkLock(lockList)
		console.log(environment.IP + "访问了" + url + "端口")
	}
	update(url)
	{
		this.mp[url].icb.update()
	}

	addInterface(inter)
	{
		this.mp[inter.url] = { 
			id:inter.id,
			name:inter.name,
			icb: new ICB.ICB() 
		}
		console.log("成功添加 " + inter.url + "端口")
	}
	delInterface(inter)
	{
		delete this.mp[inter]
		console.log("成功删除 " + inter + " 端口")
	}
	importInterface(inter_list)
	{
		for(let i = 0, len = inter_list.length; i<len; i++){
			this.mp[inter_list[i].url] = { 
			id:inter_list[i].id,
			name:inter_list[i].name,
			icb: new ICB.ICB() }
			console.log("成功添加" + inter_list[i].url + "端口")
		}
		console.log("成功导入" + inter_list.length + "个端口")
		console.log("")
	}
	exportInterface()
	{
		let res = []
		for(let x in this.mp)
			res.push({
				id:this.mp[x].id,
				url:x,
				name:this.mp[x].name})
		return res
	}

	addRule(rule)
	{
		rule.class = 'Rule'
		ICB.ruleList[rule.id] = rule
		console.log("")
	}
	delRule(id)
	{
		delete ICB.ruleList[id]
	}
	importRule(rule_list)
	{
		for(let x in rule_list)
		{
			let rule = rule_list[x]
			rule.class = "Rule"
			ICB.ruleList[rule.id] = rule
			console.log("成功添加规则" + rule.crime)
		}
		console.log("成功导入" + rule_list.length + "条规则")
	}
	exportRule()
	{
		let res = []
		for(let x in ICB.ruleList)
		{
			let tmp = JSON.parse(JSON.stringify(ICB.ruleList[x]))
			delete tmp.class 
			res.push(tmp)
		}
		return res
	}

	inter_addRule(url,id)
	{
		let lockList = this.mp[url].icb.addRule(id)	
		this.checkLock(lockList)
	}
	inter_delRule(url,id)
	{
		this.mp[url].icb.delRule(id)	
	}
	inter_importRule(url,id_list)
	{
		this.mp[url].icb.importRule(id_list)
	}
	inter_exportRule(url)
	{
		let res = []
		let lst = this.mp[url].icb.executeList
		for(let i = 0, len = lst.length; i < len; i++)
			res.push(lst[i].rule.id)
		return res
	}

	interImportICB(url,new_icb)
	{
		this.mp[url].icb = ICB.recover(JSON.parse(new_icb))
	}
	interExportICB(url)
	{
		return JSON.stringify(this.mp[url].icb)
	}
	output(url)
	{
		console.log(this.mp[url].icb)
		this.mp[url].icb.output()
	}
	clear()
	{
		this.mp = {}
	}
}
module.exports = {RMC}