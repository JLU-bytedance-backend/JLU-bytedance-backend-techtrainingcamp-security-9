class rules_col{//存放数据库各个表单的模型&操作符模型
    constructor(){
        this.set = new Set();//存储rules的所有列
        this.set.add("id");
        this.set.add("limit_duration");
        this.set.add("request_number");
        this.set.add("crime");
        this.set.add("level");
        this.set.add("lock_duration");
        this.set.add("remark");
        this.set.add("is_delete");

        this.set_interface = new Set();//存储interface所有列
        this.set_interface.add("id");
        this.set_interface.add("url");
        this.set_interface.add("name");
        this.set_interface.add("is_delete");

        this.set_user = new Set();//存储user所有列
        this.set_user.add("id");
        this.set_user.add("user_name");
        this.set_user.add("password");
        this.set_user.add("phone_num");
        this.set_user.add("is_delete");

        this.set_rule_interface = new Set();//存放关系表所有列
        this.set_rule_interface.add("interface_id");
        this.set_rule_interface.add("rules_id");
        this.set_rule_interface.add("is_delete");

        this.set_operator = new Set();//存储所有操作符
        this.set_operator.add(">");
        this.set_operator.add("<");
        this.set_operator.add(">=");
        this.set_operator.add("<=");
        this.set_operator.add("=");
        this.set_operator.add("!=");
    }
}

module.exports = {rules_col};