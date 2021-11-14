
function get_db_config_lym(){//这个就是存储数据库连接信息

    var db_config = {
        user:'root',
        password:'lymMySQLPass',
        host:'120.24.40.102',
        port:'3306',
        database:'catchyou_bytedance'
    }

    return db_config;//需要返回值直接给就行
}

module.exports = {get_db_config_lym};//向外展示哪些函数可用