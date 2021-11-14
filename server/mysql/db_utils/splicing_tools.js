var check_tool = require('./checking_tools');
var check_tools = new check_tool.check_con();

class splicing_sql_tools{
    splicing_select(select_con,table_name){//拼接
        
        var sql = "select ";
        if(select_con.length == 0){
            return sql + "* "
        }

        var flag_valid = check_tools.check_select_con_right(select_con,table_name);
        if(flag_valid == false){
            return "false";
        }

        var flag_select = false;
        for(var sc of select_con){
            if(flag_select != true){
                flag_select = true;
            }else{
                sql += ', ';
            }
            sql += (sc + " ");
        }
        return sql;
    }

    splicing_where(where_con,table_name){
        if(Object.getOwnPropertyNames(where_con).length == 0)
            return "where is_delete = 0;";

        var sql = "where ";  
        var flag_where = false;

        var flag_data = check_tools.check_where_con_right(where_con,table_name);
        if(flag_data == false){
            return "false";
        }

        for(var i in where_con){
            if(flag_where != true){
                flag_where = true;
            }
            else{
                sql += "and ";
            }
            sql += (i + where_con[i]["operator"] + "'" + where_con[i]["value"] + "'" + " ");
        }

        sql += "and is_delete = '0'"//对所拥有的where都要加，因为对已经删除了的东西操作无意义
        sql += ';';
        return sql;
    }

    splicing_insert(insert_con,n,table_name){
        var data_flag = check_tools.check_insert_con_right(insert_con,n,table_name);//检查数据格式
        if(data_flag == false){
            return "false";
        }

        var sql = "( ";
        var tmp = {};
        var flag_one = false;
        var flag_two = false;
        for(var i in insert_con){
            if(flag_one != true){
                flag_one = true;
            }
            else{
                sql += ", "
            }
            sql += (i + " ");
            tmp[i] = insert_con[i];
        }
        sql += ", is_delete ) values ( ";
        for(var i in tmp){
            if(flag_two != true){
                flag_two = true;
            }
            else{
                sql += ", "
            }
            sql += ("'" + tmp[i] + "'" +" ");
        }
        sql += ", '0' );";
        return sql;

    }

    splicing_update(update_con,table_name){
        var flag_con = check_tools.check_update_con_right(update_con,table_name);
        if(flag_con == false){
            return "false";
        }
        
        var sql_update = "set ";
        var flag_update = false;
        for(var i in update_con){
            if(flag_update != true){
                flag_update = true;
            }
            else{
                sql_update += ", ";
            }
            sql_update += (i + "='" + update_con[i] + "' ");
        }
        return sql_update;
    }

    splicing_primary_key(insert_con,primary_key){
        var sql_where = "where ";
            var flag_where = false;
            for(var i of primary_key){
                if(flag_where != true){
                    flag_where = true;
                }
                else{
                    sql_where += "and ";
                }
                sql_where += (i + "='" + insert_con[i] + "' ");
            }
        sql_where += ("and is_delete='0' ;");
        return sql_where;
    }
}

module.exports = {splicing_sql_tools};//把目标类导出