var tar = require('./mysql/connect/db_table_operators/table_four_operators.js')
var operating_redis_map = require('./redis/redis_opreate/redis_operate_map.js')
var operating_redis_str = require('./redis/redis_opreate/redis_operate_string.js')

var target = new tar.db_table_operator()
var redis_map = new operating_redis_map.operating_redis_map()
var redis_str = new operating_redis_str.operating_redis_str()

async function importICB_DB(url)
{
	let res = await redis_str.select_from_redis(url)
	return res
}

async function exportICB_DB(url,icb)
{
	let res = await redis_str.insert_into_redis(url, icb, -1)
	return res
}

async function addInter_DB(data)
{
	await target.dynamic_insert_one_table_sql(data,"interface",['url'],3);
}

async function importInter_DB()
{
	let l = ['id','url','name']
	let item = {}
	let res = await target.dynamic_select_one_table_sql(l,item,"interface")
	return res.DATA
}

async function exportInter_DB(data)
{
	for(let i = 0, len = data.length; i < len; i++)
		await target.dynamic_insert_one_table_sql(data[i],"interface",['url'],3);
}

async function addRule_DB(data)
{
	for(let i = 0, len = data.length; i < len; i++)
		await target.dynamic_insert_one_table_sql(data,"rules",['id'],7);
}

async function importRule_DB()
{
	let l = ['id','timeout','num'
				 ,'crime','level'
				 ,'lockTime','remark']
	let item = {}
	let res = await target.dynamic_select_one_table_sql(l,item,"rules")
	return res.DATA
}

async function exportRule_DB(data)
{
	for(let i = 0, len = data.length; i < len; i++)
		await target.dynamic_insert_one_table_sql(data[i],"rules",['id'],7);
}

async function importInter_Rule_DB(uid)
{
	let l = ["rules_id"]
	let item = {    
		interface_id:{
        operator:'=',
        value:uid
    }}
	let res = await target.dynamic_select_one_table_sql(l,item,"interface_rules")
	let ress = []
	for(let i = 0, len = res.DATA.length; i < len; i++) 
		ress.push(res.DATA[i].rules_id)
	return ress
}

async function exportInter_Rule_DB(uid,rid)
{
	let item = {
	    interface_id : uid,
	    rules_id : rid
	}
	await target.dynamic_insert_one_table_sql(item,"interface_rules",['interface_id','rules_id'],2);
}

module.exports = {
	importICB_DB,
	exportICB_DB,
	
	addInter_DB,
	importInter_DB,
	exportInter_DB,
	
	addRule_DB,
	importRule_DB,
	exportRule_DB,

	importInter_Rule_DB,
	exportInter_Rule_DB
}