var check_tool = require('./checking_tools');
var check_tools = new check_tool.check_con();

class splicing_sql_tools{
    splicing_select(select_con,table_name){//拼接select部分语句，参数：select部分语句拼接所用数据+表名
        
        var sql = "select ";
        if(select_con.length == 0){
            return sql + "* "
        }

        var flag_valid = check_tools.check_select_con_right(select_con,table_name);//校验
        if(flag_valid == false){
            return "false";
        }

        var flag_select = false;//拼接
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

    splicing_where(where_con,table_name){//拼接where部分语句，参数：where部分语句拼接所用数据+表名
        var sql = "where ";  
        var flag_where = false;

        var flag_data = check_tools.check_where_con_right(where_con,table_name);//数据校验
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

    splicing_insert(insert_con,n,table_name){//参数：insert部分语句拼接所用数据+表名
        var data_flag = check_tools.check_insert_con_right(insert_con,n,table_name);//检查数据格式
        if(data_flag == false){
            return "false";
        }

        var sql = "( ";//拼接
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
        sql += ", '0' );";//最后的is_delete必须要加上
        return sql;

    }

    splicing_update(update_con,table_name){//拼接update部分操作，参数：update部分语句拼接所用数据+表名
        var flag_con = check_tools.check_update_con_right(update_con,table_name);//校验数据
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

    splicing_primary_key(insert_con,primary_key){//插入之前要进行重复插入判断，拼接此处语句的where部分，需要全部主键
        //参数：insert部分语句拼接所用数据+主键列表
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
        sql_where += ("and is_delete='0' ;");//只对没被删除的部分操作
        return sql_where;
    }
}

module.exports = {splicing_sql_tools};//把目标类导出