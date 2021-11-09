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

    check_select_con_right(select_con,table_name){//判定用于拼select部分语句的数据对不对
        //参数：select部分语句拼接所用数据+表名
        var set = this.choose_table_set(table_name);//选模型

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

    check_where_con_right(where_con,table_name){//判定用于拼where部分语句的数据对不对
        //参数：参数：where部分语句拼接所用数据+表名
        var set = this.choose_table_set(table_name);//选模型

        for(var i in where_con){
            if(set.has(i)){//属性名不能错
                var op = where_con[i]["operator"];//操作符不能错
                var val = where_con[i]["value"];//值不能是undefined
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

    check_insert_con_right(insert_con,n,table_name){//判定用于拼insert部分语句的数据对不对
        //参数：insert部分语句拼接所用数据+表名
        var set = this.choose_table_set(table_name);//选模型
        var cnt_set = new Set();//根据约定，插入数据必需给全部数据，所以用来判断出现的数据种数

        for(var i in insert_con){//属性名不能错+值不能是undefined
            if(!(set.has(i) && insert_con[i] != undefined)){
                return false;
            }
            cnt_set.add(i);
        }
        console.log(cnt_set.size);
        if(cnt_set.size != n){
            return false;
        }
        return true;
    }

    check_update_con_right(update_con,table_name){//判定用于拼update部分语句的数据对不对
        //参数：update部分语句拼接所用数据+表名
        var set = this.choose_table_set(table_name);//选模型

        for(var i in update_con){//属性名不能错+值不能是undefined
            if(!(set.has(i) && update_con[i] != undefined)){
                return false;
            }
        }
        return true;
    }
}

module.exports = {check_con};//把目标类导出