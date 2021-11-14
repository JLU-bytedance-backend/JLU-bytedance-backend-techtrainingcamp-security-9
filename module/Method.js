var crypto = require('crypto');
function getUID() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function getTime(){
	return new Date().getTime()
}
function crypto_md5(pwd){
    let md5 = crypto.createHash("md5")
    return md5.update(pwd).digest("hex")
}
module.exports = {getUID,getTime,crypto_md5}