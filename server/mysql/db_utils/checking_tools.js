var rules_column = require('./db_column');//记录rules表中的各个列
var rules_columns = rules_column.rules_col;

class check_con extends rules_columns{

    choose_table_set(table_name){//根据表明选模型，增加模型只需要在这里加一条就行
        var set;
        switch (table_name){
            case "rules" :
                set = this.set;
                break;
            case "interface" :
                set = this.set_interface;
                break;
            case "interface_rules" :
                set = this.set_rule_interface;
                break;
            case "user" :
                set = this.set_user;
                break;
        }
        return set;
    }

    check_select_con_right(select_con,table_name){
        var set = this.choose_table_set(table_name);

        for(var item of select_con){
            if(set.has(item)){
                continue;
            }
            else{
                return false;
            }
        }
        return true;
    }

    check_where_con_right(where_con,table_name){
        var set = this.choose_table_set(table_name);

        for(var i in where_con){
            if(set.has(i)){
                var op = where_con[i]["operator"];
                var val = where_con[i]["value"];
                if(!(this.set_operator.has(op) && val != undefined)){
                    return false;
                }
            }
            else{
                return false;
            }
        }       
        return true;  
    }

    check_insert_con_right(insert_con,n,table_name){
        var set = this.choose_table_set(table_name);
        var cnt_set = new Set();

        for(var i in insert_con){
            if(!(set.has(i) && insert_con[i] != undefined)){
                return false;
            }
            cnt_set.add(i);
        }
        if(cnt_set.size != n){
            return false;
        }
        return true;
    }

    check_update_con_right(update_con,table_name){
        var set = this.choose_table_set(table_name);

        for(var i in update_con){
            if(!(set.has(i) && update_con[i] != undefined)){
                return false;
            }
        }
        return true;
    }
}

module.exports = {check_con};//把目标类导出