# risk-management-backend






# 风控系统

## 名词约定

- 接口样式：url样式
- 接口控制块 ：ICB (interface control block)用于存放指定URL样式接口的控制信息
- 接口控制信息：用于存放接口的历史访问情况，IP评级，规则向量表等
  - 请求事件队列：IP的访问记录历史
    - 访问记录
      - ip
      - 时间戳
  - 规则向量表（map）：存放所有规则向量
    - 规则id(key)
    - 规则向量(value)：若干评级规则
      - 规则描述
        - 访问时限
        - 访问次数
        - 评级名称
        - 优先级
      - 规则id
  - 规则计数器(map)
    - 规则id(key)
    - IP计数(value)[map]
      - IP
      - 次数
  - 规则执行列表[list]：
    - 规则向量
    - 指针
  - IP评级表[map]：记录每个IP评级
  - IP锁定表[map]：记录每个IP锁定状况
    - key : ip
    - value : 
      - islock
      - endtimeStamp(系统时间 结束)
      - timeoutID  



## 接口

- 请求登记
  - 函数名称 register
  - 参数 environment
  - 返回值 void

- 获取等级
  - 函数名称 getLevel
  - 参数 environment
  - 返回值 string (ip的评级)
- 获取锁定状态
  - 函数名称 islocking
  - 参数 ip
  - 返回值 bool
- 设置锁定
  - 函数名称 lock
  - 参数 ip timeout
  - 返回值 bool
- 更新
  - 函数名称 update
  - 参数 void
  - 返回值 void
- 删除规则向量
  - s
  - 参数 id(规则)
  - 返回值 bool
- 获取当前全部规则向量
  - s
  - 参数 void
  - 返回值 list
- 导出计数器快照
  - s
  - 参数 id （-1:全部）
  - 返回值 map
- 导出评级快照
  - s
  - 参数 id （-1:全部）
  - 返回值 map
- 导入规则向量
  - s
  - 参数 规则向量 (map)
  - 返回值 void 
- 导入规则向量表
  - s
  - 参数 规则向量（map）
  - 返回值 bool
- 导入事件队列
  - s
  - 参数 List
  - 返回值 bool



### 数据存储

缓存 Redis

- 风控管理信息
  - url -> ICB(string)

静态 MySQL

- 多对多 
- 接口表
  - url
  - name
  - id
- 规则表
  - id
  - limit_duration 访问时限
  - request_number访问次数
  - crime 评级名称
  - level 优先级
  - lock_duration 锁定时长
  - remark 备注
- 接口 - 规则表
  - id（接口）
  - id（规则）





# 数据库文档

一：

MySQL：

​	120.24.40.102

​	root

​	lymMySQLPass

​	3306

Redis:

​	requirepass

​	120.24.40.102

​	6379

​	lymRedisPass

二：Mysql表设计

​	表一：

​	rules规则表：

​		rule的id作为了主键

​		加了一个属性：is_delete作为该条规则是否删除的依据

··		其余看文档即可

​	表二：

​	interface接口表：

​		interface的id作为主键

​		加一条is_delete属性作为该接口是否删除的依据

​		其余看文档即可

​	第三：

​	interface_rules表：

​		存储接口和规则多对多关系表

​		加一个id作为主键

​		加一个is_valid作为该条关系是否存在的依据

​		其余看文档即可

​	第四：

​	user表：

​		id:由uuid生成随即不重复的id作为主键

​		user_name存储用户名

​		password存储密码

​		phone_num存储电话号码

​		is_delete用于判定该用户是否注销