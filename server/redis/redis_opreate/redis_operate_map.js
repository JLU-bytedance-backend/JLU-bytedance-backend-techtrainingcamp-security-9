var father_class = require('./father_operator');
var father_operate = father_class.father_operate;

class operating_redis_map extends father_operate{

    insert_into_redis(table_name,data,limit_time){//插入更新都一个方法，更新只需要table_name一样再插入一遍就行
        return new Promise((resolve) =>{//为了同步，用promise ，方法看其父类文末的说明
            var res = this.check_map_data_tool.check_insert(table_name,data);
            if(res == true){
                this.client.hmset(table_name,data, (res => {
                    if(limit_time != -1)
                        this.client.expire(table_name,limit_time);
                    resolve(this.message.return_message(200,"插入成功",undefined));
                    return;
                }))
            }
            else{
                resolve(res);
                return;
            }
       })
    }

    select_from_redis(table_name){
        return new Promise((resolve,reject) =>{//为了同步，用promise ，方法看其父类文末的说明
            var ress = this.check_map_data_tool.check_select(table_name);
            if(ress == true){
                this.client.hgetall(table_name, (err,res) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    if(res == null){
                        resolve(this.message.return_message(400,"该条信息已过期",null));
                        return;
                    }            
                    else{
                        resolve(res);
                        return;
                    }
                });
            }
            else{
                resolve(ress);
                return;
            }
       })
    }

    delete_from_redis(table_name,field_list){
        return new Promise((resolve,reject) =>{//为了同步，用promise ，方法看其父类文末的说明
            var res = this.check_map_data_tool.check_delete(table_name,field_list);
            if(res == true){
                this.client.hdel(table_name,field_list,res => {
                    resolve(this.message.return_message(200,"删除成功",undefined));
                    return;
                })
            }
            else{
                resolve(res);
                return;
            }
        })
    }

}

module.exports = {operating_redis_map};


//var a = new operating_redis_map();
// console.log(a.test('test_hash',{'js':'javasscript','C##':'C Sharp'}));

// a.insert_into_redis('test_hash',{'phone':'12344445599','Applycode':'12'},100).then(res => {//插入更新
//     console.log(res);
//     a.close_conn();
// })

// a.select_from_redis('test_hash').then(res => {//查询
//     console.log(res);
//     a.close_conn();
// })

// a.delete_from_redis('test_hash',['phone','Applycode']).then(res => {//删除
//     console.log(res);
//     a.close_conn();
// })