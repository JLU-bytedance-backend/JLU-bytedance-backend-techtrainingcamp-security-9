var father_class = require('./father_operator');
var father_operate = father_class.father_operate;

class operating_redis_str extends father_operate{

    insert_into_redis(table_name,data,limit_time){//插入更新都一个方法，更新只需要table_name一样再插入一遍就行
        return new Promise((resolve) =>{//为了同步，用promise ，方法看其父类文末的说明
            if(table_name != undefined && data != undefined){
                this.client.set(table_name,data, (res => {
                    if(limit_time != -1)
                    this.client.expire(table_name,limit_time);
                    resolve(this.message.return_message(200,"插入成功",undefined));
                    return;
                }))
            }
            else{
                resolve(this.message.return_message(400,"key Or value 错误",undefined));
                return;
            }
       })
    }

    select_from_redis(table_name){
        return new Promise((resolve,reject) =>{//为了同步，用promise ，方法看其父类文末的说明
            if(table_name != undefined){
                this.client.get(table_name, (err,res) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    if(res == null){
                        resolve(this.message.return_message(400,"查询的键值对不存在",null))
                        return;
                    }            
                    else{
                        resolve(res);
                        return;
                    }
                });
            }
            else{
                resolve(this.message.return_message(400,"key不可以为undefined",undefined));
                return;
            }
       })
    }

    delete_from_redis(table_name){
        return new Promise((resolve,reject) =>{//为了同步，用promise ，方法看其父类文末的说明
            if(table_name != undefined){
                this.client.del(table_name,res => {
                    resolve(this.message.return_message(200,"删除成功",undefined));
                    return;
                })
            }
            else{
                resolve(this.message.return_message(400,"key不可以为undefined",undefined));
                return;
            }
        })
    }

}
module.exports = {operating_redis_str};

//var a = new operating_redis_str();
// console.log(a.test('test_hash',{'js':'javasscript','C##':'C Sharp'}));

// a.insert_into_redis('test_hash1','222',20).then(res => {//插入更新
//     console.log(res);
//     a.close_conn();
// })


// a.select_from_redis('test_hash1').then(res => {//查询
//     console.log(res);
//     a.close_conn();
// })

// a.delete_from_redis('test_hash1').then(res => {//删除
//     console.log(res);
//     a.close_conn();
// })