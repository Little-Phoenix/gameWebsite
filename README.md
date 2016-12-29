web app with react stack

### 技术选型
##### 基础库:
- React  43k

##### 应用状态管理:
- Redux
- Redux-saga
- React-redux

##### 应用路由:
- React-router
- React-router-redux

网络库: fetch

##### Vue 参照

- Vue
- vue-router
- vuex
- vue-resource

### 相应资源
##### React

- github
    - https://github.com/facebook/react
- 文档
    - 英文: https://facebook.github.io/react/docs/getting-started.html
    - 中文: http://reactjs.cn/react/docs/getting-started.html

##### React-router

- github
    - https://github.com/reactjs/react-router
- 文档
    - 英文: https://github.com/rackt/react-router/tree/master/docs
    - 中文: https://react-guide.github.io/react-router-cn/

##### Redux

- github
    -  https://github.com/reactjs/redux
-  文档
    - 英文: http://redux.js.org/
    - 中文: http://cn.redux.js.org/

##### React-router-redux

- github
    - https://github.com/reactjs/react-router-redux


##### Redux-saga

- github
    - https://github.com/yelouafi/redux-saga
- 文档
    - 英文: http://yelouafi.github.io/redux-saga/
    - 中文: http://leonshi.com/redux-saga-in-chinese/

##### fetch
- https://github.com/github/fetch

代码规范

- React
    - 英文: https://github.com/airbnb/javascript/tree/master/react
    - 中文: https://github.com/JasonBoy/javascript/tree/master/react


####目录结构
```
.
├── gulpfile                 # gulp build(sass, image)
├── webpack                  # webpack build(inline-sass, js source code, js library)
├── server                   # Express application that provides webpack middleware
├── src                      # 程序源码
│   ├── actions
│ 	│ 	└── index.js       # 公共action creator
│   ├── reducers
│ 	│ 	└── index.js       # 公共reducer
│   ├── sagas
│ 	│ 	└── index.js      # 异步网络请求处理
│   ├── main.js              # Application bootstrap and rendering（应用入口，负责整个应用的初始化启动和渲染）
│   ├── components           # Global Reusable Presentational Components（公共组件）
│   ├── containers           # 应用入口组件容器
│   ├── layouts              # Components that dictate major page structure（基础页面结构，处理公共路由逻辑）
│   ├── routes               # Main route definitions and async split points（异步路由）
│   │   ├── index.js         # Bootstrap main application routes with store（路由配置）
│		│		├── config           # 各页面头部底部文案及样式配置
│   │   └── home             # Fractal route
│   │       ├── index.js     # Route definitions and async split points（当前页面入口）
│   │       ├── components   # Presentational React Components（展示及逻辑组件）
│   │       ├── container    # Connect components to actions and store（关联action及store至当前页面入口组件，reducer注入）
│   │       └── modules      # 初始化当前页面state，声明处理当前action的reducer
│   ├── config               # 各页面头部底部文案及样式配置
│   ├── services             # 各种公用工具
│   ├── public               # 全局样式及图片等静态资源
│   ├── store                # Redux-specific pieces
│   │   └── index.js         # Create and instrument redux store(创建store, 启动saga监听)
│   └── styles               # Application-wide styles (generally settings)
└── dist										 # compiled code
```


#####基本概念
######参考资源
```
http://www.jianshu.com/p/3334467e4b32
```
如上链接清晰全面分析了redux运作机制

- connect
	- connect就是将store中的必要数据作为props传递给React组件来render，并包装action creator用于在响应用户操作时dispatch一个action
- provider
	- 接受Redux的store作为props，并将其声明为context的属性之一，子组件可以在声明了contextTypes之后可以方便的通过this.context.store访问到store。不过我们的组件通常不需要这么做，将store放在context里，是为了给下面的connect用的
- replaceReducer
	- 路由变更新，在asyncReducers对象上新增属性，用以处理新路由里的action

#####代码简写示例
```
<Provider store={store}>
  <Router history={browserHistory}>
    <Route path="/" component={coreLayout}>
			<IndexRoute component={task}/>
      <Route path="/home" component={home}/>
      <Route path="/users" component={Users}>
        <Route path="/user/:userId" component={User}/>
      </Route>
    </Route>
  </Router>
<Provider
```
#####数据流向示例
state：{
	task: {data: {}},
	home: {data: {}},
	users: {data: {}}
}

1. 进入应用
	- 准备路由容器及store
	- 启用saga监听（网络事件）
	- 执行路由匹配
2. 匹配路由
3. reducer注入当前路由，经由connect -- state转化为props传入当前路由组件树，action creator传入当前路由组件树
4. 路由变更， 回到第二步

示例：
```
connect(mapStateToProps, mapActionCreators)(routeEle)
connect(state.task, taskActionCreator)(taskEle)
```


测试服务器地址：

	ssh piyafang@192.168.199.224
	root dian(!)&test

	测试服务器代码目录：  /data/91atmEnv/react_app


上线：

	本地压缩  webpack -p
	http://ops.dianjoy.com/task/command/

	分支：
		master: 179   
		preview : 180   灰度发布（可能会有用）
		develop：  开发

###网页调试  localstorage需存字段
1. "91atm":
 {"jb":"0","data":"yeojmFH5wsH6pLLoQlDGLLFJTbQpNnHNyyLGsu%2Fr6lMVphN%2BT5cbHmSyO26w%2Bsb2RfTUcNoxsDQk89MfV9eTPeKwJPvjrC66DJ2FPGQEvoe6KtnPOTXyEIt9RcEFYzGLrrcKaDpcw6yMz0cAPK6HR4IRDunTRNEeTMKza9EJo2Gtlr0yNmzU%2BrDn2ThcreqkITlmzH4YXGMArv8zMcns%2FZJV%2FBA3aoeN5f5BiocO7RliPB8DMmzzRXWNMkpOHQF%2BGq%2BSWd25FA8gSTeHi3jDQoZPgnYZzwiIqXmHrBmzvv9c3BhGJi6WJXIj1rwNi9eCCQ5N7KK0b4flhxBrTBXQBIyunisr2PoipFPwW9g15T0wUv1s6VqU%2B5rhBkpYx7jp6DWNFex%2Fmu4%2FldPcSETqgyUsjUkcY6GxmXSksie7OE4CNpFRjtXE81a%2BAMR5vTNSeMKmrTZeeH4uEf9sbubEFr6ClSCp9qWwo9QDF2gfUNG1T5FRk0h6BfAVuCqO%2FmFRT0exAv2Rv3ke7x7DB2vHW1kcWbf%2FaGdWqIvaE22PjL6Lp6dMVeQHNzyjwJYk8m%2BJGdB7g9RpfZF%2BqI4qSfbwBv%2BwRb3Ir9nFVRop1R29mrhNyDmiDfGCgT%2FFklg6%2B5CARgs%2Bgz7ZJNlc7IxDuK88k4PuWkSdQOXVS%2FS7VtS0rt49Iie9N%2BcKg81bRYcGh791p8QE0sU%2B4n2z69qPHcbIA4ZPgnYZzwiIqXmHrBmzvv9c3BhGJi6WJXIj1rwNi9eCOXYwWioeg%2B3d%2BFcn5JFiyJ99pSVxPuIa9GoZPAlR78FiLiuHoxQ6Y3jxPeI1f4LscQCG2ybrEsuiFHwjbRFbBDYxKdeKW3HhTanMkDWConONjWS0Jggko7kxM6xALFZqtu1HmzZOjEeMyeWmx6BJlfSryP5%2B2r0%2B%2FqXl%2F4ZYYTNdiKZZKtjGFMowNQieB5oYzO8HfAI56MTkIkQjNLEe%2F%2BkU4nEzbJFlEsFZP1Bc2tS5Rg4Olt9SoTz5dQ7z5%2BKsAaUyQqZo75rt1txjahfcRH2nQo0xiMxnr34%2FkREUHRddruH5dgNBhH%2FPFQDKUHMPBYWu8GyAlnXmdu%2Bmk6dRSiBMg2WuXSMcpQpn8zfqCRQDbTVTUNa38xuUMPSLjA1cIogLSqGvFAdfssSqfffNrdfamyUr8t9k0LsRZ1hyL7liW6sv1mpTraGMPVNtdPXBoeqLA%2BXJBnhxwgiFgdi7hKRePqFBvHMv5jCya%2B10C7Q%3D","e_version":"1","device_id":"CFD51BCF-D3B4-43A0-998E-817142938F27","key":"GXmoic%2Fj1QsYdyb3%2BQz1%2FuEoUy6Z6pDOJTQRJ8BZwxe48Y1WPRhDi8SqOit9XnkSM2rjDDDNUrd%2BG831iWsJW1eCH2T0JMI8rU5bZPsdAAH3i9tVaKuSQ6rhw%2F%2B6RQjCYgL%2FsOteuhMXNBx4PjrvKDY5eFcX5qm16dJL5UkeB68%3D","bb-8":"%7B%0A%20%20%20%20s00%20%3D%20%2200%3A10%3A56%22%3B%0A%20%20%20%20s01%20%3D%20%22meng%5CU7684%20iPod%20touch%22%3B%0A%20%20%20%20s02%20%3D%200%3B%0A%20%20%20%20s03%20%3D%20%2238.0%22%3B%0A%20%20%20%20s04%20%3D%202%3B%0A%20%20%20%20s05%20%3D%20%2227.16%20GB%22%3B%0A%20%20%20%20s06%20%3D%20%2225.30%20GB%22%3B%0A%20%20%20%20s07%20%3D%20%221.87%20GB%22%3B%0A%20%20%20%20s09%20%3D%20%2260%3Ab%3A3%3A5c%3Ade%3A0%22%3B%0A%20%20%20%20s10%20%3D%20dianjoy%3B%0A%20%20%20%20s11%20%3D%20%22Asia%2FShanghai%22%3B%0A%20%20%20%20s12%20%3D%20512%3B%0A%20%20%20%20s13%20%3D%20%22173.000000.1f%22%3B%0A%20%20%20%20s14%20%3D%201%3B%0A%20%20%20%20s15%20%3D%20%22zh-Hans-CN%22%3B%0A%20%20%20%20s16%20%3D%20%22iPod5%2C1%22%3B%0A%20%20%20%20s17%20%3D%20%22CFD51BCF-D3B4-43A0-998E-817142938F27%22%3B%0A%20%20%20%20s18%20%3D%20%22359BEF78-9ECF-4A4B-9D7B-0C060900F8B9%22%3B%0A%20%20%20%20s19%20%3D%20d41d8cd98f00b204e9800998ecf8427e5abed680%3B%0A%20%20%20%20s20%20%3D%20%22Darwin%20Kernel%20Version%2015.6.0%3A%20Fri%20Aug%2019%2010%3A37%3A54%20PDT%202016%3B%20root%3Axnu-3248.61.1~1%2FRELEASE_ARM_S5L8942X%22%3B%0A%20%20%20%20s21%20%3D%2029167554560%3B%0A%20%20%20%20s22%20%3D%20528130048%3B%0A%7D","package_name":"com.master.rsrs0","app_version":"1.2.0"}

 2. user && token

 	"token": 5829390832a1e52c8b80d93ea6dba1aa
	"user": 1177161
