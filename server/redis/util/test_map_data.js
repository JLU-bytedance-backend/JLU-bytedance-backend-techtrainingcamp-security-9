
class testing_data{

    constructor(){
        this.message = require('./message');
        this.set = new Set();
        this.set.add('phone');
        this.set.add('Applycode');
    }

    check_insert(table_name,data){
        if(table_name == undefined){
            return this.message.return_message(400,"table_name数据有误",undefined);
        }
        if(!(data["phone"] != undefined && data["Applycode"] != undefined)){
            return this.message.return_message(400,"map数据有误",undefined);
        }
        return true;
    }

    check_select(table_name){
        if(table_name == undefined){
            return this.message.return_message(400,"table_name数据有误",undefined);
        }
        return true;
    }

    check_delete(table_name,field_list){
        if(table_name == undefined){
            return this.message.return_message(400,"table_name数据有误",undefined);
        }
        for(var i of field_list){
            if(!this.set.has(i)){
                return this.message.return_message(400,"field_list数据有误",undefined);
            }
        }
        return true;
    }
}

module.exports = {testing_data};
