var base_operator = require('../db_base_operator/connect_mysql');
var base_class = base_operator.db_operator;

var splicing_tool = require('../../db_utils/splicing_tools');
var splicing_tools = new splicing_tool.splicing_sql_tools();

class db_table_operator extends base_class{
    dynamic_select_one_table_sql(select_con,where_con,table_name){//查寻语句
        return new Promise((resolve,reject) =>{
            var sql = splicing_tools.splicing_select(select_con,table_name);//拼select部分语句
            if(sql == "false"){
                resolve(this.message.return_message(400,"查询失败(查询的某些列不存在)", undefined));
                return;
            }
            
            sql += ("from " + table_name +" ");//from部分根据需求定制特定接口

            var sql_where = splicing_tools.splicing_where(where_con,table_name);//拼where部分语句
            if(sql_where == "false"){
                resolve(this.message.return_message(400,"查询失败(where条件错误)", undefined));
                return;
            } 
            sql += sql_where;
            console.log(sql);

            this.conn_to_db(sql,1).then(res => {//与数据库进行交互
                resolve(res);
                return;
            })
        })
    }

    dynamic_insert_one_table_sql(insert_con,table_name,primary_key,attribute_num){//插入操作
        return new Promise((resolve, reject) => {//解决了异步问题，先执行这个函数，用Promise
            var sql = this.insert_sql;//语句头
            sql += (table_name + " ");//插入哪张表

            var sql_insert = splicing_tools.splicing_insert(insert_con,attribute_num,table_name);//拼写具体语句
            if(sql_insert == "false"){
                resolve(this.message.return_message(400,"插入失败，数据错误", undefined));
                return;
            }

            //此时数据纯净，进而用主键判断时候重复插入
            var repeatSQL = "select * from "+ table_name + " " + splicing_tools.splicing_primary_key(insert_con,primary_key);

            this.conn_to_db(repeatSQL,1).then(res => {
                if(res["DATA"].length == 0){//没插入过
                    sql += sql_insert;//拼出插入语句
                    
                    this.conn_to_db(sql,2).then(res => {//与数据库交互
                        resolve(res);
                        return;
                    })
                }
                else{
                    resolve(this.message.return_message(400,"请勿重复插入", undefined));
                    return;
                }
            })
        })
    }

    dynamic_update_one_table_sql(update_con,where_con,table_name){//更新操作
        return new Promise((resolve,reject) =>{
            var sql = this.update_sql;//语句头
            sql += (table_name + " ");//加上表名

            var sql_update = splicing_tools.splicing_update(update_con,table_name);//拼写set部分语句
            if(sql_update == "false"){
                resolve(this.message.return_message(400,"更新失败(更新的列有的不存在)", undefined));
                return;
            } 
            sql += sql_update;

            var sql_where = splicing_tools.splicing_where(where_con,table_name);//拼写where部分语句
            if(sql_where == "false"){
                resolve(this.message.return_message(400,"查询失败(where条件错误)", undefined));
                return;
            }
            sql += sql_where;
            console.log(sql);
            
            this.conn_to_db(sql,3).then(res => {//送数据库
                resolve(res);
                return;
            })
       })
    }

    dynamic_delete_one_table_sql(where_con,table_name){//逻辑删除，内部用update实现
        return new Promise((resolve,reject) =>{//为了同步，用promise ，方法看其父类文末的说明
            var deletes = {
                is_delete : '1'//将表中每行最后一个属性置1
            }
            
            this.dynamic_update_one_table_sql(deletes,where_con,table_name).then(res => {//调用update来逻辑删除
                resolve(res);
                return;
            })
       })
    }
    
}

module.exports = {db_table_operator};