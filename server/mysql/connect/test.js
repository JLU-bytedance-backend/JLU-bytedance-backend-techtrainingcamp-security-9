var tar = require('./db_table_operators/table_four_operators')
var target = new tar.db_table_operator();

var item = {
	user_name : {
		operator:'=',
		value:'lwc'
	},
    id : {
        operator:'=',
        value:'17'
    }
};
var tmp = {
    id:"10",
    user_name:"dqy",
    password:123456,
    phone_num:123456
}
var items = {
    interface_id : '10',
    rules_id : '8'
}

// var items = {
//     id : '16',
// }

var l = [ 'id', 'password'];
var ll = [];

// target.dynamic_select_one_table_sql(l,item).then(res => {//查询
//     console.log(res);
//     target.close_pool();
// })

// target.dynamic_insert_one_table_sql(items).then(res => {//插入
//     console.log(res);
//     target.close_pool();
// })

// target.dynamic_update_one_table_sql(items,item).then(res => {//更新
//     console.log(res);
//     target.close_pool();
// })

// target.dynamic_delete_one_table_sql(item).then(res => {//删除
//     console.log(res);
//     target.close_pool();
// })

// target.dynamic_select_one_table_sql(l,item,"user").then(res => {
//     console.log(res);
//     target.close_pool();
// })

// target.dynamic_insert_one_table_sql(items,"interface_rules",['interface_id','rules_id'],2).then(res => {
//     console.log(res);
//     target.close_pool();
// })

// target.dynamic_update_one_table_sql(items,item,"user").then(res => {//更新
//     console.log(res);
//     target.close_pool();
// })

// target.dynamic_delete_one_table_sql(item,"user").then(res => {//删除
//     console.log(res);
//     target.close_pool();
// })

// primary_key = ['phone_num' , 'id'];
// var insert_con = {
    
//     id : '102',
//     user_name : 'wb',
//     password : '123456',
//     phone_num : '12322223334'
// }
// var where_con = {};
// for(var i of primary_key){
//     console.log(i);
//     console.log(insert_con[i]);
//     where_con[i] = insert_con[i];
//     console.log(where_con[i]);
// }            