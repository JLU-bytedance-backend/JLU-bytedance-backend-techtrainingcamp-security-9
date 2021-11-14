class father_operate{
    constructor(){
        this.redis = require('redis');
        this.redis_config = require('../redis_configs/redis_conf');
        this.client = this.redis.createClient(this.redis_config.RDS_PORT,this.redis_config.RDS_HOST,this.redis_config.RDS_OPTS);//一个对象开一个连接
        this.client.auth(this.redis_config.RDS_PWD)//输入密码验证

        this.check_tools = require('../util/test_map_data');
        this.check_map_data_tool = new this.check_tools.testing_data();

        this.message = require('../util/message');
    }

    close_conn(){//对象弃用，关闭连接
        this.client.quit();
    }
}

module.exports = {father_operate};