class Rule
{
	constructor(id,timeout,num,crime,level,lockTime,remark)
	{
		this.id = id // 规则id
		this.timeout = timeout //规则的限定时间
		this.num = num //规则的限定次数
		this.crime = crime // 罪名,比如验证码
		this.level = level // 等级,规则的等级越高,处罚越严重
		this.lockTime = lockTime // 拦截时间,触犯规则后需拦截该IP后续操作
		this.remark = remark //备注,详细说明该规则
		this.class = "Rule"
	}
}
module.exports = Rule