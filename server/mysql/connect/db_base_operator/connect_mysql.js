class db_operator{//用于定义基础接口
    constructor(){//由构造器设置类里面的属性
        this.select_sql = "select ";
        this.insert_sql = "insert into ";
        this.update_sql = "update ";
        this.delete_sql = "delete from "

        this.db = require('../../db_protie/db_proties');//连接数据库用的配置信息
        this.mysql = require('mysql');//驱动
        this.db_config = this.db.get_db_config_lym();//获取配置信息
        this.conn_pool = this.mysql.createPool(this.db_config);//建立连接池,这玩意就一直开着吧，手动关闭
        this.message = require('../../result_message/message');  
        
    }

    close_pool(){
        this.conn_pool.end();
    }

    return_result(result,do_what){//处理返回，封装打包
        if(do_what == 1){
            //console.log("1",this.message.return_message(200,"查询成功",result));
            return this.message.return_message(200,"successSelect",result)
        }
        else if(do_what == 2){
            return this.message.return_message(200,"successInsert",result["changedRows"])
        }
        else if(do_what == 3){
            return this.message.return_message(200,"successUpdate",result["changedRows"])
        }
        else if(do_what == 4){
            return this.message.return_message(200,"successDelete",result["changedRows"])
        }
    }

    conn_to_db(sql,do_what){
        return new Promise((resolve, reject) => {//解决了异步问题，先执行这个函数，用Promise
            this.conn_pool.getConnection((err,connect) => {
                if(err){
                    reject(err);
                }
                else {
                    connect.query(sql,(err,result) =>{
                        if(err){
                            reject(err);
                        }
                        else{       
                            resolve(this.return_result(result,do_what));
                        }
                    });
                }
                connect.release();
            });
            return;
        })
    }
}

module.exports = {db_operator};//导出此文件哪些内容

//处理异步问题，先用Promise套住，在调用的时候，用then
//比如：
/**
var cla = require('./connect_mysql');
var aaa = new cla.db_operator();
var sql = "select * from user;";
aaa.conn_to_db(sql,1).then(res=>{    
    console.log(res);
})
 */
