var RMC = require('./module/RMC.js')
var Server = require('./module/Server.js')
var Applycode = require('./module/Applycode.js')
var Rule = require('./module/Rule.js')
var Method = require('./module/Method.js')
var Interface = require('./module/Interface.js')
var server = new Server.Server()
var rmc = new RMC.RMC()

module.exports = {
	server,
	rmc,
	applycode:Applycode,
	method:Method,
	rule:Rule,
	interface:Interface
}
