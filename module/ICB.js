var Rule = require('./Rule.js')
var Method = require('./Method.js')
var ruleList = {}
var constructor_map = new Map()

class ipRecord
{
	constructor(ip,time)
	{
		this.ip = ip
		this.time = time
		this.class = "ipRecord"
	}	
}

class ICB
{
	constructor()
	{
		this.ipRecordQ = [] // 记录队列
		this.ruleRecorder = {} // 规则计数器
		this.executeList = [] // 规则执行列表
		this.ipLevel = {} // IP评级表
		this.class = "ICB"
	}
	output()
	{
		console.log(this.ipRecordQ)
		console.log(this.ruleRecorder)
		console.log(this.executeList)
		console.log(this.ipLevel)
		console.log(ruleList)
		console.log("")
	}
	register(environment)
	{
		let ip = environment.IP
		this.ipLevel[ip] = 0

		let lockList = {}
		let tmp = new ipRecord(environment.IP,Method.getTime())
		this.ipRecordQ.push(tmp)
		for(let i = 0,len = this.executeList.length; i < len;i++)
		{
			let rule = this.executeList[i].rule
			if(this.ruleRecorder[rule.id][ip] == undefined)
				this.ruleRecorder[rule.id][ip] = 0
			this.ruleRecorder[rule.id][ip] ++
			if(this.ruleRecorder[rule.id][ip] >= ruleList[rule.id].num)
			{
				if(lockList[ip] == undefined)
					lockList[ip] = []
				lockList[ip].push(rule.lockTime)
				this.ipLevel[ip] = Math.max(ruleList[rule.id].level,this.ipLevel[ip])
			}
		}
		this.update()
		return lockList
	}
	update()
	{
		let dt = Method.getTime()
		let mp = {}
		for(let i = 0,len = this.executeList.length; i < len;i++)
		{
			let rule = this.executeList[i].rule
			let index = this.executeList[i].pointer
		
			while(index < this.ipRecordQ.length && dt - this.ipRecordQ[index].time > rule.timeout)
			{
				let ip = this.ipRecordQ[index].ip
				this.ruleRecorder[rule.id][ip] --

				if(mp[ip] == undefined) mp[ip] = []
				if(this.ruleRecorder[rule.id][ip] >= ruleList[rule.id].num)
					mp[ip].push({"level":ruleList[rule.id].level,"result":1})
				else mp[ip].push({"level":ruleList[rule.id].level,"result":0})

				index ++
			}
			this.executeList[i].pointer = index
		}
		
		for(let x in mp)
		{
			mp[x].push({"level":0,"result":1})
			mp[x].sort(function(obj1,obj2){
				if(obj1.level == obj2.level)
					return obj1.result > obj2.result ? -1 : 1
				return obj1.level > obj2.level ? -1 : 1
			})

			for(let i = 0,len = mp[x].length; i < len; i++)
			{
				if(i > 0 && mp[x][i].level == mp[x][i-1].level  
						 && mp[x][i].result == mp[x][i-1].result) continue
				
				if(mp[x][i].result == 1)
					this.ipLevel[x] = Math.max(mp[x][i].level, this.ipLevel[x])
				if(mp[x][i].result == 0 && this.ipLevel[x] == mp[x][i].level )
					this.ipLevel[x] = 0
			}
		}

		
		let head = this.ipRecordQ.length;
		for(let i = 0,len = this.executeList.length; i < len;i++)
			head = Math.min(head,this.executeList[i].pointer)
		for(let i = 0,len = this.executeList.length; i < len;i++)
			this.executeList[i].pointer -= head	
		this.ipRecordQ.splice(0,head)	
	}
	getLevel(environment)
	{
		return this.ipLevel[environment.IP]
	}
	delRule(id)
	{
		for (let i = 0,len = this.executeList.length; i < len; i++) 
		{
			if(this.executeList[i].rule.id == id)
			{
				this.executeList.splice(i,1)
				return 
			}
		}
	}
	addRule(id)
	{
		this.ruleRecorder[id] = {}
		let rule = ruleList[id]
		let dt = Method.getTime()
		let pointer = this.ipRecordQ.length
		let lockList = {}

		for(let i = this.ipRecordQ.length - 1; i >= 0;i--)
		{ 
			let ip = this.ipRecordQ[i].ip
			// 初始化ip对应新加入的rule的次数,防止未定义 
			if(this.ruleRecorder[rule.id][ip] == undefined) 
					this.ruleRecorder[rule.id][ip] = 0
			if(dt - this.ipRecordQ[i].time <= rule.timeout)
			{
				pointer = i
				this.ruleRecorder[rule.id][ip] ++
				if(this.ruleRecorder[rule.id][ip] >= ruleList[rule.id].num)
				{
					if(this.ipLevel[ip] == undefined) 
						this.ipLevel[ip] = ruleList[rule.id].level
					else this.ipLevel[ip] = Math.max(ruleList[rule.id].level,
						this.ipLevel[ip])
					if(lockList[ip] == undefined)
						lockList[ip] = []
					lockList[ip].push(rule.lockTime)
				}
			}
			//这里就算当前记录不在管辖时间范围内 也不要直接结束循环(break)
			//因为要对所有ip都初始化
		}
			
		this.executeList.push({
			"rule":rule,
			"pointer":pointer
		})
		this.update()
		return lockList
	}
	getAllRules()
	{
		let lst = []
		for(let i = 0, len = this.executeList; i < len;i++)
			lst.push(this.executeList.rule)
		return lst
	}
	exportRecorder()
	{
		return this.ruleRecorder
	}
	exportIpLevel()
	{
		return this.ipLevel
	}
	clear()
	{
		this.ipRecordQ = []
		this.ruleRecorder = {} 
		this.executeList = [] 
		this.ipLevel = {} 
		this.ipifLock = {}
	}
	importRule(new_ruleList)
	{
		this.clear()
		for(let i = 0,len = new_ruleList.length; i < len;i++)
			this.addRule(new_ruleList[i])
	}
	importRecordQ(ipRecordQ)
	{
		this.ipRecordQ = ipRecordQ
	}
}

constructor_map.set("ICB",ICB)
constructor_map.set("ipRecord",ipRecord)
constructor_map.set("Rule",Rule)

function recover(target)
{
	if(target === undefined || target === null) 
		return target
	let constructor = target.constructor
	let source
	if(constructor == Object){
		if(target.class != undefined)
			source = new (constructor_map.get(target.class))()
		else source = {}
		for(let x in target)
			source[x] = recover(target[x])
	}	
	else if(constructor == Number || constructor == String || constructor == Boolean)
		return target
	else if(constructor == Array){
		source = []
		for(let x of target)
			source.push(recover(x))
	}
	return source
}

function deepClone(target)
{
	if(target === undefined || target === null) 
		return target
	let constructor = target.constructor
	var source
	if(constructor == Function)
		return eval('(' + target.toString() + ')')
	else if(constructor == Number || constructor == String || constructor == Boolean)
		return target
	else if(constructor == Object){
		source = {}
		for(let x in target)
			source[x] = deepClone(target[x])
	}	
	else if(constructor == Array){
		source = []
		for(let x of target)
			source.push(deepClone(x))
	}
	else if(constructor == Map){
		source = new Map()
		for(let x of target)
			source.set(x[0],deepClone(x[1]))
	}
	else if(constructor == Set){
		source = new Set()
		for(let x of target)
			source.add(deepClone(x))
	}
	else {
		source = new target.constructor.prototype.constructor()
		for(let x in target)
			source[x] = deepClone(target[x])		
	}
	return source
}

module.exports = {
	ICB,
	Rule,
	ipRecord,
	deepClone,
	recover,
	ruleList
}