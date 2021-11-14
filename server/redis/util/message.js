function return_message(code, messages,data){//返回信息
    var message = {};
    message["CODE"] = code;
    message["MESSAGE"] = messages;
    message["DATA"] = data;
    return JSON.parse(JSON.stringify(message));
}

module.exports = {return_message};//向外展示哪些函数可用

